const jscalpel = ({ target, keys, prefix, callback, deep, dynamicKeys, plugins}, defaultOpts) => {
    const nativeToString = Object.prototype.toString;
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
    const getParameterNames = (fn) => {
        const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*\*\/))/mg;
        const DEFAULT_PARAMS = /=[^,\)]+/mg;
        const FAT_ARROWS = /=>[\s\S]*/mg;
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

    var getKeyPathValue = function (key, target, plugins) {
      // 优化: 如果检测到undefined直接跳出遍历
      let result = target
      let keysPaths = (autoCompleteKey(key)).split('.')
      for (let i = 0, len = keysPaths.length; i < len; i++) {
        result = result[keysPaths[i]]
        if (result === undefined) break
      }
      // fixed: 获取到最终path信息，再进行插件操作
      let willPluginInfo = {
        value: result,
        name: key
      };
      // 增加校验插件个数，另外这里不判断willPluginInfo.value，是因为即使value为undefined，也可能需要插件处理
      if (plugins && Array.isArray(plugins) && plugins.length) {
        plugins.forEach(function (plugin, index) {
          result = plugin(willPluginInfo);
        });
      }
      return result
    }

    // 修复dynamicKeys与prefix表现不一致的问题
    var originalKeys = keys
    let epTarget = null;
    const cbParams = callback ? getParameterNames(callback) : [];
    console.log('cbParams', cbParams);
    if (typeof dynamicKeys === 'function') {
        keys = dynamicKeys(keys) || keys;
        // 有dynamicKeys时禁用prefix
        enablePrefix = false;
    }

    try {
      epTarget = typeof target === 'string' ? JSON.parse(target) : target;
      if (deep) {
        epTarget = deepCopy(epTarget);
      }

      if (nativeToString.call(epTarget) !== '[object Object]' && !Array.isArray(epTarget)) {
        throw new Error();
        return;
      }
    } catch (err) {
      console.error('传入的target不是有效的JSON或target不是Object/Array类型');
      return;
    }
    if (typeof keys === 'string' && keys.length > 0) {
      let result = getKeyPathValue(keys, epTarget, plugins)
      result = [result, epTarget, originalKeys, defaultOpts]

      if (callback && typeof callback === 'function') {
        return callback.apply(null, result) || result || defaultOpts;
      } else {
        return callback || result || defaultOpts
      }
    } else if (nativeToString.call(keys) === '[object Array]') {
        const pResult = [];
        keys.forEach((singlePath, idx) => {
            if (typeof singlePath === 'string') {
              let result = getKeyPathValue(singlePath, epTarget, plugins)
              pResult.push(result);
            }
        })
        pResult.push(epTarget, originalKeys, defaultOpts);
        
        let defaultValue = null
        if (callback && typeof callback === 'function') {
          defaultValue = callback.apply(null, pResult);
        } else {
          defaultValue = callback;
        }
        return defaultValue || pResult || defaultOpts;
    }
}

export default jscalpel;