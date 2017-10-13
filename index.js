
class JscalpelCore {
    constructor({
        target,
        path,
        returnedValue,
        error
    }) {
        this._target = target;
        this._path = path;
        this._error = error;
        this._returnedValue = returnedValue;
    }

    _getValueByPath (path) {
        let result = null;
        let epTarget = this._target;
        let keyPaths = this._fallbackpath(path).split('.')
        for (let i = 0, len = keyPaths.length; i < len; i++) {
          result = result ? result[keyPaths[i]] : epTarget[keyPaths[i]];
          if (typeof result === undefined) {
              return result;
          }
        }
        return result
    }
    _getValue (path) {
        let result = null;
        let epTarget = this._target;
        let pResult = [];
        let self = this;
        if (typeof path === 'string' && path.length > 0) {
            return this._getValueByPath(path);
        } else if (Object.prototype.toString.call(path) === '[object Array]') {
            path.forEach((singlePath, idx) => {
                if (typeof singlePath === 'string') {
                    result = self._getValueByPath(singlePath);
                    pResult.push(result);
                }
            })
            if (pResult.length === 0) {
                return null;
            }
            return pResult;
        }
        return null;
    }

    get (path) {
        return path ? this._getValueByPath(path) : this._returnedValue;
    }
    _fallbackpath (path) {
        if (typeof path !== 'string') {
            return '';
        }
        return path;
    }
    _setOrDel (path, value) {
        let current = {};
        let fallbacPath = this._fallbackpath(path);
        if (fallbacPath === '') {
            if (typeof this._error === 'function') {
                this._error(this._target, path);
            }
            return;
        }
        let pathArr = fallbacPath.split('.');
        let pathLens = pathArr.length;
        let i = 0;
        if (pathLens === 1) {
            this._target[pathArr[i]] = value;
            return;
        }
        while (i < pathLens-1) {
            this._target[pathArr[i]][pathArr[i+1]] = (i === pathLens-2 ? value : {});
            i++;
        }
    }
    set (path, value) {
        this._setOrDel(path, value);
    }

    has (path) {
       let returnedValue = this._getValueByPath(path);
       if (!returnedValue) {
           return false;
       }
       return true;
    }

    remove(path) {
        this._setOrDel(path, void 0);
    }
}


const jscalpel = ({ target, path, prefix, callback, success, deep, plugins, error}, defaultOpts) => {
    const nativeToString = Object.prototype.toString;
    const compatCb = success || callback;
    let enablePrefix = prefix ? true : false;
    const deepCopy = (obj) => {
        const returnObj = {};
        let tempArr = [];
        if (nativeToString.call(obj) === '[object Object]') {
            Object.path(obj).forEach((path, index) => {
                if (Array.isArray(obj[path])) {
                    obj[path].forEach((value, index) => {
                        tempArr.push(value);
                    });
                    returnObj[path] = tempArr;
                    tempArr = [];
                } else if (nativeToString.call(obj[path] === '[object Object]')) {
                    returnObj[path] = deepCopy(obj[path]);
                }
            });
            return returnObj;
        } else {
            return obj;
        }
    }
    const autoCompletepath = (path) => {
        return (`${prefix && enablePrefix ? `${prefix}.${path}` : `${path}`}`);
    }
    const getValueByPath = function ({path, target, plugins, index}) {
        // 优化: 如果检测到undefined直接跳出遍历
        let result = target
        let pathPaths = (autoCompletepath(path)).split('.')
        for (let i = 0, len = pathPaths.length; i < len; i++) {
          result = result[pathPaths[i]]
          if (result === undefined) {
              return result;
          }
        }
        return result
      }
    
      const executePlugins = ({ plugins, name, value }) => {
          let willPluginInfo = {
              value,
              name
          }
          if (plugins && Array.isArray(plugins) && plugins.length) {
            plugins.forEach((plugin, index) => {
                plugin(willPluginInfo);
            });
          }

      } 
    const getParameterNames = (fn) => {
        const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const DEFAULT_PARAMS = /=[^,]+/mg;
        const FAT_ARROWS = /=>.*$/mg;
        const code = fn.toString()
            .replace(COMMENTS, '')
            .replace(FAT_ARROWS, '')
            .replace(DEFAULT_PARAMS, '');

        const result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
            .match(/([^\s,]+)/g);

        return result === null
            ? []
            : result;
    }

    const getReturnedVal = (defaultValue, result, pResult) => {
        if (typeof value !== 'undefined') {
            return value;
        } else {
            return result || pResult;
        }
    }
    //  try transform anything to object
    const transformAnyToObj = (target) => {
        let epTarget  = null;
        try {
            epTarget = typeof target === 'string' ? JSON.parse(target) : target;
            if (deep) {
                epTarget = deepCopy(epTarget);
            }
    
            if (nativeToString.call(epTarget) !== '[object Object]' && !Array.isArray(epTarget)) {
                typeof error === 'function' && error(epTarget);
                return;
            }
        } catch (err) {
            typeof error === 'function' && error(epTarget, err);
            return;
        }
        return epTarget;
    }

    let defaultValue = null;
    let result = null;
    let willPluginInfo = {};
    let epTarget = transformAnyToObj(target);
    let pResult = null;
    let cbParams = compatCb ? getParameterNames(compatCb) : [];
    path = typeof path === 'function' ? path(prefix) : path;


    if (typeof path === 'string' && path.length > 0) {
        result = getValueByPath({path, target});
        executePlugins({plugins, name: cbParams[0], value: result});
        if (compatCb && typeof compatCb === 'function') {;
            defaultValue = compatCb.call(null, result, epTarget, path, defaultOpts);
        } else {
            defaultValue = compatCb;
        }
    } else if (nativeToString.call(path) === '[object Array]') {
        pResult = [];
        path.forEach((singlePath, idx) => {
            if (typeof singlePath === 'string') {
                result = getValueByPath({path: singlePath, target});
                executePlugins({plugins, value: result, name: cbParams[idx]});
                pResult.push(result);
            }
            result = null;
        })
        pResult.push(epTarget, path, defaultOpts);
        if (compatCb && typeof compatCb === 'function') {
            defaultValue = compatCb.apply(null, pResult);
        } else {
            defaultValue = compatCb;
        }
    }
    
    return new JscalpelCore({
        target: epTarget,
        path,
        returnedValue: getReturnedVal(defaultValue, result, pResult.slice(0,-3)),
        error
    })
}

export default jscalpel;