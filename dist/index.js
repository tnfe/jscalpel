(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jscalpel = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var jscalpelType = function jscalpelType(_ref) {
    var value = _ref.value,
        name = _ref.name;
    var simpleTypes = ['string', 'undefined', 'function', 'number', 'boolean'];

    if (simpleTypes.indexOf(_typeof(value)) !== -1) {
      return {
        value: value,
        type: _typeof(value)
      };
    }

    if (value + '' === 'null') {
      return {
        value: value,
        type: 'null'
      };
    }

    if (Array.isArray(value)) {
      return {
        value: value,
        type: 'array',
        length: value.length
      };
    }

    if (Object.prototype.toString.call(value) === '[object Object]') {
      return {
        value: value,
        name: name,
        type: 'object',
        keys: Object.keys(value),
        values: Object.values(value)
      };
    }
  };

  var jscalpelLogic = function jscalpelLogic(logicMap) {
    return function (_ref) {
      var value = _ref.value,
          name = _ref.name;

      if (logicMap[name]) {
        jscalpel({
          target: logicMap,
          prefix: "".concat(name),
          path: ['match', 'success'],
          callback: function callback(match, success) {
            match({
              value: value,
              name: name
            }) && success({
              value: value,
              name: name
            });
            return value;
          }
        });
      }

      return value;
    };
  };

  var jscalpelORM = function jscalpelORM() {
    var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var rules = arguments.length > 1 ? arguments[1] : undefined;
    var defaultValue = arguments.length > 2 ? arguments[2] : undefined;

    if (!isObject(source)) {
      console.error("source\u4E3A".concat(source, ",\u4E0D\u662F\u5BF9\u8C61"));
      return defaultValue;
    }

    if (!isObject(rules)) {
      console.error("rules\u4E3A".concat(rules, ",\u4E0D\u662F\u5BF9\u8C61"));
      return defaultValue;
    }

    try {
      var targetPath = Object.keys(rules);

      var _extraInfo = rules._extraInfo || {};

      var target = {};
      var jscalpelIns = jscalpel({
        target: target
      });
      var jscalpelSourceIns = jscalpel({
        target: source
      });
      targetPath.forEach(function (path, index) {
        if (path !== '_extraInfo') {
          jscalpelIns.set(path, typeof jscalpelSourceIns.get(path) === 'undefined' ? jscalpelSourceIns.get(rules[path]) : jscalpelSourceIns.get(path));
        }
      });
      return Object.assign(target, _extraInfo);
    } catch (e) {
      console.error('请检查source和rules配置，两者都必须为对象!');
      return defaultValue;
    }
  };

  var nativeToString = Object.prototype.toString;

  var isObject = function isObject(obj) {
    return nativeToString.call(obj) === '[object Object]';
  };

  var toCopy = function toCopy(obj) {
    var returnObj = {};
    var tempArr = [];

    if (nativeToString.call(obj) === "[object Object]") {
      Object.keys(obj).forEach(function (path, index) {
        if (Array.isArray(obj[path])) {
          obj[path].forEach(function (value, index) {
            tempArr.push(value);
          });
          returnObj[path] = tempArr;
          tempArr = [];
        } else if (nativeToString.call(obj[path] === "[object Object]")) {
          returnObj[path] = toCopy(obj[path]);
        }
      });
      return returnObj;
    } else {
      return obj;
    }
  };

  var JscalpelCore = /*#__PURE__*/function () {
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
      key: "_getValueByPath",
      value: function _getValueByPath(path) {
        var result = void 0;
        var epTarget = this._target;

        var keyPaths = this._fallbackpath(path).split(".");

        for (var i = 0, len = keyPaths.length; i < len; i++) {
          try {
            result = result ? result[keyPaths[i]] : epTarget[keyPaths[i]];
          } catch (err) {
            return void 0;
          }
        }

        return result;
      }
    }, {
      key: "_getValue",
      value: function _getValue(path) {
        var result = void 0;
        this._target;
        var pResult = [];
        var self = this;

        if (typeof path === "string" && path.length > 0) {
          return this._getValueByPath(path);
        } else if (nativeToString.call(path) === "[object Array]") {
          path.forEach(function (singlePath, idx) {
            if (typeof singlePath === "string") {
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
      key: "get",
      value: function get(path) {
        return path ? this._getValueByPath(path) : this._returnedValue;
      }
    }, {
      key: "_fallbackpath",
      value: function _fallbackpath(path) {
        if (typeof path !== "string") {
          return "";
        }

        return path.replace(/\s/g, "");
      } // 扩展和设置值

    }, {
      key: "_extend",
      value: function _extend(ns, ns_string) {
        if (isObject(ns)) {
          var current = ns;
          var parts = ns_string.split(".");
          var pl = parts.length;

          for (var i = 0; i < pl; i++) {
            if (typeof current[parts[i]] === "undefined") {
              current[parts[i]] = {};
            }

            if ((arguments.length <= 2 ? 0 : arguments.length - 2) > 0 && i === pl - 1) {
              current = current[parts[i]] = arguments.length <= 2 ? undefined : arguments[2];
            } else {
              current = current[parts[i]];
            }
          }
        }
      }
    }, {
      key: "_setOrDel",
      value: function _setOrDel(path, value) {
        var fallbackPath = this._fallbackpath(path);

        if (fallbackPath === "") {
          if (typeof this._error === "function") {
            this._error(this._target, path);
          }

          return;
        }

        this._extend(this._target, fallbackPath, value);
      }
    }, {
      key: "set",
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
      key: "has",
      value: function has(path) {
        var returnedValue = this._getValueByPath(path);

        if (!returnedValue) {
          return false;
        }

        return true;
      }
    }, {
      key: "del",
      value: function del(path) {
        var self = this;

        if (!path) {
          return;
        }

        if (Array.isArray(path)) {
          path.forEach(function (ph, index) {
            self._setOrDel(ph, void 0);
          });
        } else {
          self._setOrDel(path, void 0);
        }
      }
    }]);

    return JscalpelCore;
  }();

  var jscalpel = function jscalpel(_ref2, defaultOpts) {
    var target = _ref2.target,
        path = _ref2.path,
        keys = _ref2.keys,
        dynamicKeys = _ref2.dynamicKeys,
        prefix = _ref2.prefix,
        callback = _ref2.callback,
        success = _ref2.success,
        deep = _ref2.deep,
        plugins = _ref2.plugins,
        error = _ref2.error;
    var compatCb = success || callback;
    var enablePrefix = prefix ? true : false;

    var autoCompletePath = function autoCompletePath(path) {
      return "".concat(prefix && enablePrefix ? "".concat(prefix, ".").concat(path) : "".concat(path));
    };

    var getValueByPath = function getValueByPath(_ref3) {
      var path = _ref3.path,
          target = _ref3.target;
          _ref3.plugins;
          _ref3.index;
      var result = target;
      var parseingPaths = autoCompletePath(path).split(".");

      for (var i = 0, len = parseingPaths.length; i < len; i++) {
        try {
          result = result[parseingPaths[i]];
        } catch (err) {
          return void 0;
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
      var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
      var DEFAULT_PARAMS = /=[^,]+/gm;
      var FAT_ARROWS = /=>.*$/gm;
      var code = fn.toString().replace(COMMENTS, "").replace(FAT_ARROWS, "").replace(DEFAULT_PARAMS, "");
      var result = code.slice(code.indexOf("(") + 1, code.indexOf(")")).match(/([^\s,]+)/g);
      return result === null ? [] : result;
    };


    var transformAnyToObj = function transformAnyToObj(target) {
      var epTarget = null;

      try {
        epTarget = typeof target === "string" ? JSON.parse(target) : target;

        if (deep) {
          epTarget = toCopy(epTarget);
        }

        if (nativeToString.call(epTarget) !== "[object Object]" && !Array.isArray(epTarget)) {
          typeof error === "function" && error(epTarget);
          return;
        }
      } catch (err) {
        typeof error === "function" && error(epTarget, err);
        return;
      }

      return epTarget;
    };

    var getPaths = function getPaths(_ref5) {
      var _ref5$path = _ref5.path,
          path = _ref5$path === void 0 ? "" : _ref5$path,
          keys = _ref5.keys,
          dynamicKeys = _ref5.dynamicKeys;

      if (keys || typeof dynamicKeys === "function") {
        path = keys || dynamicKeys(prefix);
      } else if (typeof path === "function") {
        path = path(prefix);
      }

      return path;
    };

    var defaultValue = void 0;
    var result = void 0;
    var epTarget = transformAnyToObj(target);
    var pResult = [];
    var cbParams = compatCb ? getParameterNames(compatCb) : [];
    path = getPaths({
      path: path,
      keys: keys,
      dynamicKeys: dynamicKeys
    });

    if (typeof path === "string" && path.length > 0) {
      result = getValueByPath({
        path: path,
        target: target
      });
      executePlugins({
        plugins: plugins,
        name: cbParams[0],
        value: result
      });

      if (compatCb && typeof compatCb === "function") {
        defaultValue = compatCb.call(null, result, epTarget, path, defaultOpts);
      } else {
        defaultValue = compatCb;
      }
    } else if (nativeToString.call(path) === "[object Array]") {
      path.forEach(function (singlePath, idx) {
        if (typeof singlePath === "string") {
          result = getValueByPath({
            path: singlePath,
            target: target
          });
          executePlugins({
            plugins: plugins,
            value: result,
            name: cbParams[idx]
          });
          pResult.push(result);
        }

        result = void 0;
      });
      pResult.push(epTarget, path, defaultOpts);

      if (compatCb && typeof compatCb === "function") {
        defaultValue = compatCb.apply(null, pResult);
      } else {
        defaultValue = compatCb;
      }
    }

    if (typeof callback === "function" || typeof success === "function") {
      return defaultValue;
    }

    return new JscalpelCore({
      target: epTarget,
      error: error
    });
  };

  var get = function get(target, path, defaultValue) {
    var returnedValue = jscalpel({
      target: target
    }).get(path);

    if (typeof returnedValue === "undefined") {
      return defaultValue;
    }

    return returnedValue;
  };

  var set = function set(target, path, value) {
    return jscalpel({
      target: target
    }).set(path, value);
  };

  exports['default'] = jscalpel;
  exports.get = get;
  exports.jscalpelLogic = jscalpelLogic;
  exports.jscalpelORM = jscalpelORM;
  exports.jscalpelType = jscalpelType;
  exports.set = set;
  exports.toCopy = toCopy;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
