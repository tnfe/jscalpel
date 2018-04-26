# jscalpel诞生记
jscalpel取名为js手术刀。 基于笔者开发[norton-miniui](http://github.com/ihtml5/norton-miniui)其间积累的一个函数，最早原型可见
```javascript
// 对object单个或多个key进行分析,分析完成后，执行相应的回调
    function getAllOptions(options) {
        return function (path, func, defaultOpts) {
            var optionsStrToArr = [];
            var result = null;
            var defaultValue = null;
            var oLen = null;
            if (path && typeof path === 'string' && path.length > 0) {
                if (typeof path === 'string') {
                    optionsStrToArr = path.split('.');
                    oLen = optionsStrToArr.length;
                }
                for (var _index=0;_index< oLen; _index++) {
                    if (result) {
                        result = result[optionsStrToArr[_index]];
                    } else {
                        result = options[optionsStrToArr[_index]];
                    }
                }
                if (func && typeof func === 'function') {;
                    defaultValue = func.call(null, result, defaultOpts);
                } else {
                    defaultValue = func;
                }
                return result || defaultValue;
            } else if (nativeToString.call(path) === '[object Array]') {
                var plen = path.length;
                var pstr = '';
                var pResult = [];
                for (var p = 0; p <plen; p++) {
                    pstr = path[p];
                    result = null;
                    if (typeof pstr === 'string') {
                        optionsStrToArr = pstr.split('.') || [];
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
                if (func && typeof func === 'function') {
                    defaultValue = func.apply(null, pResult);
                } else {
                    defaultValue = func;
                }
                return pResult || defaultValue;
            }
        }
    }
```
从上面的方法，我们可以看出最早的jscalpel需要通过传递options返回一个闭包,来实现对传入的对象的遍历。
