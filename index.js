
class JscalpelCore {
    constructor({
        target,
        keys
    }) {
        this._target = target;
        this._keys = keys;
    }

    _getValueByKeys (keys) {
        let result = null;
        let epTarget = this._target;
        let pResult = [];
        if (typeof keys === 'string' && keys.length > 0) {
            keys.split('.').forEach((value, index) => {
                result= (result ? result[value] : epTarget[value])
                console.log('value keys', value, result);
            });
            return result;
        } else if (Object.prototype.toString.call(keys) === '[object Array]') {
            keys.forEach((singlePath, idx) => {
                if (typeof singlePath === 'string') {
                    singlePath.split('.').forEach((value, index) => {
                        result= (result ? result[value] : epTarget[value])
                    });
                    if (typeof result === 'undefined' || result+'' === 'null') {
                        return;
                    }
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
    get (key) {
        return this._getValueByKeys(key);
    }
    set (keys, value) {
        let current = {};
        let keyArr = keys.split('.');
        let keyLens = keyArr.length;
        let i = 0;
        while (i < keyLens-1) {
            if (keyLens === 1) {
                this._target[keyArr[i]] = value;
                break;
            }
            this._target[keyArr[i]][keyArr[i+1]] = (i === keyLens-2 ? value : {});
            i++;
        }
    }

    has (key) {
       let returnedValue = this._getValueByKeys(key);
       if (!returnedValue) {
           return false;
       }
       return true;
    }

    del (keys) {
        let current = {};
        let keyArr = keys.split('.');
        let keyLens = keyArr.length;
        let i = 0;
        while (i < keyLens-1) {
            if (keyLens === 1) {
                this._target[keyArr[i]] = value;
                break;
            }
            this._target[keyArr[i]][keyArr[i+1]] = (i === keyLens-2 ? void 0 : {});
            i++;
        }
    }
}


const jscalpel = ({ target, keys, prefix, callback, success, deep, plugins, error}, defaultOpts) => {
    const nativeToString = Object.prototype.toString;
    const compatCb = success || callback;
    let enablePrefix = prefix ? true : false;
    const deepCopy = (obj) => {
        const returnObj = {};
        let tempArr = [];
        if (nativeToString.call(obj) === '[object Object]') {
            Object.keys(obj).forEach((key, index) => {
                if (Array.isArray(obj[key])) {
                    obj[key].forEach((value, index) => {
                        tempArr.push(value);
                    });
                    returnObj[key] = tempArr;
                    tempArr = [];
                } else if (nativeToString.call(obj[key] === '[object Object]')) {
                    returnObj[key] = deepCopy(obj[key]);
                }
            });
            return returnObj;
        } else {
            return obj;
        }
    }
    const autoCompleteKey = (key) => {
        return (`${prefix && enablePrefix ? `${prefix}.${key}` : `${key}`}`);
    }
    const getValuebyKey = function (key, target, plugins) {
        // 优化: 如果检测到undefined直接跳出遍历
        let result = target
        let keysPaths = (autoCompleteKey(key)).split('.')
        for (let i = 0, len = keysPaths.length; i < len; i++) {
          result = result[keysPaths[i]]
          if (result === undefined) {
              return result;
          }
        }
        // fixed: 获取到最终path信息，再进行插件操作
        let willPluginInfo = {
          value: result,
          name: key
        };
        // 增加校验插件个数，另外这里不判断willPluginInfo.value，是因为即使value为undefined，也可能需要插件处理
        if (plugins && Array.isArray(plugins) && plugins.length) {
          plugins.forEach(function (plugin, index) {
              plugin(willPluginInfo);
          });
        }
        return result
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
    let defaultValue = null;
    let result = null;
    let epTarget = null;
    const cbParams = compatCb ? getParameterNames(compatCb) : [];
    let willPluginInfo = {};
    if (typeof keys === 'function') {
        keys = keys(prefix);
    }
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
    if (typeof keys === 'string' && keys.length > 0) {
        result = getValuebyKey(keys, target, plugins)
        if (compatCb && typeof compatCb === 'function') {;
            defaultValue = compatCb.call(null, result, epTarget, keys, defaultOpts);
        } else {
            defaultValue = compatCb;
        }
    } else if (nativeToString.call(keys) === '[object Array]') {
        const pResult = [];
        keys.forEach((singlePath, idx) => {
            result = null;
            if (typeof singlePath === 'string') {
                result = getValuebyKey(singlePath, target, plugins);
                pResult.push(result);
            }
        })
        pResult.push(epTarget,keys, defaultOpts);
        if (compatCb && typeof compatCb === 'function') {
            defaultValue = compatCb.apply(null, pResult);
        } else {
            defaultValue = compatCb;
        }
        return new JscalpelCore({
            target: epTarget,
            keys
        })
    }
}

export default jscalpel;