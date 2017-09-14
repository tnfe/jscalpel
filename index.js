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
        var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var DEFAULT_PARAMS = /=[^,]+/mg;
        var FAT_ARROWS = /=>.*$/mg;
        var code = fn.toString()
            .replace(COMMENTS, '')
            .replace(FAT_ARROWS, '')
            .replace(DEFAULT_PARAMS, '');

        var result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
            .match(/([^\s,]+)/g);

        return result === null
            ? []
            : result;
    }
    let defaultValue = null;
    let result = null;
    let epTarget = null;
    const cbParams = callback ? getParameterNames(callback) : [];
    console.log('cbParams', cbParams);
    let willPluginInfo = {};
    if (typeof dynamicKeys === 'function') {
        keys = dynamicKeys(keys) || keys;
        enablePrefix = false;
    }
    try {
        epTarget = typeof target === 'string' ? JSON.parse(target) : target;
        if (deep) {
            epTarget = deepCopy(epTarget);
        }

        if (nativeToString.call(epTarget) !== '[object Object]' && !Array.isArray(epTarget)) {
            console.error('传入的target不是有效的json或者object');
            return;
        }
    } catch (err) {
        console.error('传入的target不是有效的json或者object');
        return;
    }
    if (typeof keys === 'string' && keys.length > 0) {

        `${autoCompleteKey(keys)}`.split('.').forEach((value, index) => {
            result= (result ? result[value] : epTarget[value])
            willPluginInfo = {
                value: result,
                name: cbParams[index]
            };
            if (plugins && Array.isArray(plugins)) {
                plugins.forEach((plugin, index) => {
                    result = plugin(willPluginInfo);
                })
            }
        })
        if (callback && typeof callback === 'function') {;
            defaultValue = callback.call(null, result, epTarget, keys, defaultOpts);
        } else {
            defaultValue = callback;
        }
        if (typeof defaultValue === 'undefined') {
            return result || defaultOpts;
        }
        return defaultValue;
    } else if (nativeToString.call(keys) === '[object Array]') {
        const pResult = [];
        keys.forEach((singlePath, idx) => {
            result = null;
            if (typeof singlePath === 'string') {
                `${autoCompleteKey(singlePath)}`.split('.').forEach((value, index) => {
                    result= (result ? result[value] : epTarget[value])
                });
                willPluginInfo = {
                    value: result,
                    name: cbParams[idx]
                }
                if (plugins && Array.isArray(plugins)) {
                    plugins.forEach((plugin, index) => {
                        result = plugin(willPluginInfo);
                    })
                }
                pResult.push(result);
            }
        })
        pResult.push(epTarget,keys, defaultOpts);
        if (callback && typeof callback === 'function') {
            defaultValue = callback.apply(null, pResult);
        } else {
            defaultValue = callback;
        }
        if (typeof defaultValue === 'undefined') {
            return pResult || defaultOpts;
        }
        return defaultValue;
    }
}

export default jscalpel;