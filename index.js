const Jscalpel = ({ target, keys, prefix, callback, deep }, defaultOpts) => {
    const nativeToString = Object.prototype.toString;
    const deepCopy = (obj) => {
        const returnObj = {};
        let tempArr = [];
        if (nativeToString.call(obj) === ['object Object']) {
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
    const autoCompleteKey = (key) => (`${prefix ? `${prefix}.${key}` : `${key}`}`);
    let defaultValue = null;
    let result = null;
    let epTarget = null;
    try {
        epTarget = typeof target === 'string' ? JSON.parse(target) : target;
        if (deep) {
            alert('isDeepCopy');
            epTarget = deepCopy(epTarget);
        }
        if (!nativeToString.call(epTarget) === '[object Object]') {
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
        keys.forEach((singlePath, index) => {
            result = null;
            if (typeof singlePath === 'string') {
                `${autoCompleteKey(singlePath)}`.split('.').forEach((value, index) => {
                    result= (result ? result[value] : epTarget[value])
                })
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

export default Jscalpel;