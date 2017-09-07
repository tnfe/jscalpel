function jscalpel(options) {
    var keys = options.keys;
    var callback = options.callback;
    var defaultOpts = defaultOpts;
    var optionsStrToArr = [];
    var result = null;
    var defaultValue = null;
    var oLen = null;
    var deepCopy = function (obj) {
        const returnObj = {};
        let tempArr = [];
        if (nativeToString.call(obj) === ['object Object']) {
            for (var key in obj) {
                if (Array.isArray(obj[key])) {
                    var len = obj[key].length;
                    for (var idx = 0; idx < len; idx++) {
                        tempArr.push(obj[key][idx]);
                    }
                    returnObj[key] = tempArr;
                    tempArr = [];
                } else if (nativeToString.call(obj[key] === '[object Object]')) {
                    returnObj[key] = deepCopy(obj[key]);
                }
            }
            return returnObj;
        } else {
            return obj;
        }
    }
    var autoCompleteKey = function (key) {
        if (options.prefix) {
            return options.prefix+ '.' + key;
        }
        return key;
    }
    if (keys && typeof keys === 'string' && keys.length > 0) {
        if (typeof keys === 'string') {
            optionsStrToArr = keys.split('.');
            oLen = optionsStrToArr.length;
        }
        for (var _index=0;_index< oLen; _index++) {
            if (result) {
                result = result[optionsStrToArr[_index]];
            } else {
                result = options[optionsStrToArr[_index]];
            }
        }
        if (callback && typeof callback === 'function') {;
            defaultValue = callback.call(null, result, defaultOpts);
        } else {
            defaultValue = callback;
        }
        return result || defaultValue;
    } else if (nativeToString.call(keys) === '[object Array]') {
        var plen = keys.length;
        var pstr = '';
        var pResult = [];
        for (var p = 0; p <plen; p++) {
            pstr = keys[p];
            result = null;
            if (typeof pstr === 'string') {
                optionsStrToArr = autoCompleteKey(pstr).split('.') || [];
                oLen = optionsStrToArr.length || 0;
            }
            for (var _index = 0;_index< oLen; _index++) {
                if (result) {
                    result = result[optionsStrToArr[_index]];
                } else {
                    result = options[optionsStrToArr[_index]];
                }
            }
            pResult.push(result);
        }
        pResult.push(defaultOpts, path);
        if (callback && typeof callback === 'function') {
            defaultValue = callback.apply(null, pResult);
        } else {
            defaultValue = callback;
        }
        return pResult || defaultValue;
    }
}

exports = module.exports = jscalpel;