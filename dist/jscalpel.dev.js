(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.jscalpel = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nativeToString = Object.prototype.toString;
var isObject = function isObject(path) {
    return nativeToString.call(path) === '[object Object]';
};

var JscalpelCore = function () {
    function JscalpelCore(_ref) {
        var target = _ref.target,
            returnedValue = _ref.returnedValue,
            error = _ref.error;

        _classCallCheck(this, JscalpelCore);

        this._target = target;
        this._error = error;
        this._returnedValue = returnedValue;
    }

    _createClass(JscalpelCore, [{
        key: '_getValueByPath',
        value: function _getValueByPath(path) {
            var result = null;
            var epTarget = this._target;
            var keyPaths = this._fallbackpath(path).split('.');
            for (var i = 0, len = keyPaths.length; i < len; i++) {
                result = result ? result[keyPaths[i]] : epTarget[keyPaths[i]];
                if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === undefined) {
                    return result;
                }
            }
            return result;
        }
    }, {
        key: '_getValue',
        value: function _getValue(path) {
            var result = null;
            var pResult = [];
            var self = this;
            if (typeof path === 'string' && path.length > 0) {
                return this._getValueByPath(path);
            } else if (nativeToString.call(path) === '[object Array]') {
                path.forEach(function (singlePath, idx) {
                    if (typeof singlePath === 'string') {
                        result = self._getValueByPath(singlePath);
                        pResult.push(result);
                    }
                });
                if (pResult.length === 0) {
                    return null;
                }
                return pResult;
            }
            return null;
        }
    }, {
        key: 'get',
        value: function get(path) {
            return path ? this._getValueByPath(path) : this._returnedValue;
        }
    }, {
        key: '_fallbackpath',
        value: function _fallbackpath(path) {
            if (typeof path !== 'string') {
                return '';
            }
            return path;
        }
    }, {
        key: '_extend',
        value: function _extend(ns, ns_string, value) {
            if (isObject(ns)) {
                var current = ns;
                var parts = ns_string.split('.');
                var pl = parts.length;
                for (var i = 0; i < pl; i++) {
                    if (typeof current[parts[i]] === 'undefined') {
                        current[parts[i]] = {};
                    }
                    if (typeof value !== 'undefined' && i === pl - 1) {
                        current = current[parts[i]] = value;
                    }
                    current = current[parts[i]];
                }
            }
        }
    }, {
        key: '_setOrDel',
        value: function _setOrDel(path, value) {
            var fallbackPath = this._fallbackpath(path);
            if (fallbackPath === '') {
                if (typeof this._error === 'function') {
                    this._error(this._target, path);
                }
                return;
            }
            this._extend(this._target, fallbackPath, value);
        }
    }, {
        key: 'set',
        value: function set(path, value) {
            var _this = this;

            if (isObject(path)) {
                Object.keys(path).forEach(function (key, index) {
                    _this._setOrDel(key, path[key]);
                });
            } else {
                this._setOrDel(path, value);
            }
        }
    }, {
        key: 'has',
        value: function has(path) {
            var returnedValue = this._getValueByPath(path);
            if (!returnedValue) {
                return false;
            }
            return true;
        }
    }, {
        key: 'del',
        value: function del(path) {
            this._setOrDel(path, void 0);
        }
    }]);

    return JscalpelCore;
}();

var jscalpel = function jscalpel(_ref2, defaultOpts) {
    var target = _ref2.target,
        path = _ref2.path,
        keys = _ref2.keys,
        prefix = _ref2.prefix,
        callback = _ref2.callback,
        success = _ref2.success,
        deep = _ref2.deep,
        plugins = _ref2.plugins,
        error = _ref2.error;

    var compatCb = success || callback;
    var enablePrefix = prefix ? true : false;
    var deepCopy = function deepCopy(obj) {
        var returnObj = {};
        var tempArr = [];
        if (nativeToString.call(obj) === '[object Object]') {
            Object.keys(obj).forEach(function (path, index) {
                if (Array.isArray(obj[path])) {
                    obj[path].forEach(function (value, index) {
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
    };

    var autoCompletePath = function autoCompletePath(path) {
        // console.log('cccc');
        return '' + (prefix && enablePrefix ? prefix + '.' + path : '' + path);
    };

    var getValueByPath = function getValueByPath(_ref3) {
        var path = _ref3.path,
            target = _ref3.target;

        var result = target;
        var parseingPaths = autoCompletePath(path).split('.');
        for (var i = 0, len = parseingPaths.length; i < len; i++) {
            result = result[parseingPaths[i]];
            if (result === undefined) {
                return result;
            }
        }
        return result;
    };

    var executePlugins = function executePlugins(_ref4) {
        var plugins = _ref4.plugins,
            name = _ref4.name,
            value = _ref4.value;

        var willPluginInfo = {
            value: value,
            name: name
        };
        if (plugins && Array.isArray(plugins) && plugins.length) {
            plugins.forEach(function (plugin, index) {
                plugin(willPluginInfo);
            });
        }
    };
    var getParameterNames = function getParameterNames(fn) {
        var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var DEFAULT_PARAMS = /=[^,]+/mg;
        var FAT_ARROWS = /=>.*$/mg;
        var code = fn.toString().replace(COMMENTS, '').replace(FAT_ARROWS, '').replace(DEFAULT_PARAMS, '');

        var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);

        return result === null ? [] : result;
    };

    var getReturnedVal = function getReturnedVal(defaultValue, result, pResult) {
        if (typeof value !== 'undefined') {
            return value;
        } else {
            return result || pResult;
        }
    };
    //  try transform anything to object
    var transformAnyToObj = function transformAnyToObj(target) {
        var epTarget = null;
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
    };

    var defaultValue = null;
    var result = null;
    var epTarget = transformAnyToObj(target);
    var pResult = null;
    var cbParams = compatCb ? getParameterNames(compatCb) : [];
    path = typeof path === 'function' ? path(prefix) : path || keys;

    if (typeof path === 'string' && path.length > 0) {
        result = getValueByPath({ path: path, target: target });
        executePlugins({ plugins: plugins, name: cbParams[0], value: result });
        if (compatCb && typeof compatCb === 'function') {
            
            defaultValue = compatCb.call(null, result, epTarget, path, defaultOpts);
        } else {
            defaultValue = compatCb;
        }
    } else if (nativeToString.call(path) === '[object Array]') {
        pResult = [];
        path.forEach(function (singlePath, idx) {
            if (typeof singlePath === 'string') {
                result = getValueByPath({ path: singlePath, target: target });
                executePlugins({ plugins: plugins, value: result, name: cbParams[idx] });
                pResult.push(result);
            }
            result = null;
        });
        pResult.push(epTarget, path, defaultOpts);
        if (compatCb && typeof compatCb === 'function') {
            defaultValue = compatCb.apply(null, pResult);
        } else {
            defaultValue = compatCb;
        }
    }
    if (typeof callback === 'function' || typeof success === 'function') {
        return getReturnedVal(defaultValue, result, pResult.slice(0, -3));
    }
    return new JscalpelCore({
        target: epTarget,
        error: error
    });
};

return jscalpel;

})));
//# sourceMappingURL=jscalpel.dev.js.map
