import jscalpelType from "./plugins/jscalpeltype";
import jscalpelLogic from "./plugins/jscalpellogic";
import { jscalpelORM, isObject, nativeToString } from "./utils";
class JscalpelCore {
  constructor({ target, returnedValue, error }) {
    this._target = target;
    this._error = error;
    this._returnedValue = returnedValue;
  }

  _getValueByPath(path) {
    let result = void 0;
    let epTarget = this._target;
    let keyPaths = this._fallbackpath(path).split(".");
    for (let i = 0, len = keyPaths.length; i < len; i++) {
      result = result ? result[keyPaths[i]] : epTarget[keyPaths[i]];
      if (typeof result === undefined) {
        return result;
      }
    }
    return result;
  }
  _getValue(path) {
    let result = void 0;
    let epTarget = this._target;
    let pResult = [];
    let self = this;
    if (typeof path === "string" && path.length > 0) {
      return this._getValueByPath(path);
    } else if (nativeToString.call(path) === "[object Array]") {
      path.forEach((singlePath, idx) => {
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

  get(path) {
    return path ? this._getValueByPath(path) : this._returnedValue;
  }
  _fallbackpath(path) {
    if (typeof path !== "string") {
      return "";
    }
    return path;
  }

  // 扩展和设置值
  _extend(ns, ns_string, ...rest) {
    if (isObject(ns)) {
      var current = ns;
      var parts = ns_string.split(".");
      var pl = parts.length;
      for (let i = 0; i < pl; i++) {
        if (typeof current[parts[i]] === "undefined") {
          current[parts[i]] = {};
        }
        if (rest.length > 0 && i === pl - 1) {
          current = current[parts[i]] = rest[0];
        } else {
          current = current[parts[i]];
        }
      }
    }
  }
  _setOrDel(path, value) {
    let fallbackPath = this._fallbackpath(path);
    if (fallbackPath === "") {
      if (typeof this._error === "function") {
        this._error(this._target, path);
      }
      return;
    }
    this._extend(this._target, fallbackPath, value);
  }
  set(path, value) {
    if (isObject(path)) {
      Object.keys(path).forEach((key, index) => {
        this._setOrDel(key, path[key]);
      });
    } else {
      this._setOrDel(path, value);
    }
  }

  has(path) {
    let returnedValue = this._getValueByPath(path);
    if (!returnedValue) {
      return false;
    }
    return true;
  }

  del(path) {
    let self = this;
    if (!path) {
      return;
    }
    if (Array.isArray(path)) {
      path.forEach((ph, index) => {
        self._setOrDel(path, void 0);
      });
    } else {
      self._setOrDel(path, void 0);
    }
  }
}

const jscalpel = (
  {
    target,
    path,
    keys,
    dynamicKeys,
    prefix,
    callback,
    success,
    deep,
    plugins,
    error
  },
  defaultOpts
) => {
  const compatCb = success || callback;
  const enablePrefix = prefix ? true : false;
  const deepCopy = obj => {
    const returnObj = {};
    let tempArr = [];
    if (nativeToString.call(obj) === "[object Object]") {
      Object.keys(obj).forEach((path, index) => {
        if (Array.isArray(obj[path])) {
          obj[path].forEach((value, index) => {
            tempArr.push(value);
          });
          returnObj[path] = tempArr;
          tempArr = [];
        } else if (nativeToString.call(obj[path] === "[object Object]")) {
          returnObj[path] = deepCopy(obj[path]);
        }
      });
      return returnObj;
    } else {
      return obj;
    }
  };

  const autoCompletePath = path => {
    return `${prefix && enablePrefix ? `${prefix}.${path}` : `${path}`}`;
  };

  const getValueByPath = function({ path, target, plugins, index }) {
    let result = target;
    let parseingPaths = autoCompletePath(path).split(".");
    for (let i = 0, len = parseingPaths.length; i < len; i++) {
      result = result[parseingPaths[i]];
      if (result === undefined) {
        return result;
      }
    }
    return result;
  };

  const executePlugins = ({ plugins, name, value }) => {
    let willPluginInfo = {
      value,
      name
    };
    if (plugins && Array.isArray(plugins) && plugins.length) {
      plugins.forEach((plugin, index) => {
        plugin(willPluginInfo);
      });
    }
  };
  const getParameterNames = fn => {
    const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const DEFAULT_PARAMS = /=[^,]+/mg;
    const FAT_ARROWS = /=>.*$/mg;
    const code = fn
      .toString()
      .replace(COMMENTS, "")
      .replace(FAT_ARROWS, "")
      .replace(DEFAULT_PARAMS, "");

    const result = code
      .slice(code.indexOf("(") + 1, code.indexOf(")"))
      .match(/([^\s,]+)/g);

    return result === null ? [] : result;
  };

  const getReturnedVal = (defaultValue, result, pResult) => {
    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    } else {
      return result;
    }
  };
  //  try transform anything to object
  const transformAnyToObj = target => {
    let epTarget = null;
    try {
      epTarget = typeof target === "string" ? JSON.parse(target) : target;
      if (deep) {
        epTarget = deepCopy(epTarget);
      }

      if (
        nativeToString.call(epTarget) !== "[object Object]" &&
        !Array.isArray(epTarget)
      ) {
        typeof error === "function" && error(epTarget);
        return;
      }
    } catch (err) {
      typeof error === "function" && error(epTarget, err);
      return;
    }
    return epTarget;
  };

  const getPaths = ({ path = "", keys, dynamicKeys }) => {
    if (keys || typeof dynamicKeys === "function") {
      path = keys || dynamicKeys(prefix);
    } else if (typeof path === "function") {
      path = path(prefix);
    }
    return path;
  };
  let defaultValue = void 0;
  let result = void 0;
  let willPluginInfo = {};
  let epTarget = transformAnyToObj(target);
  let pResult = [];
  let cbParams = compatCb ? getParameterNames(compatCb) : [];
  path = getPaths({
    path,
    keys,
    dynamicKeys
  });
  if (typeof path === "string" && path.length > 0) {
    result = getValueByPath({ path, target });
    executePlugins({ plugins, name: cbParams[0], value: result });
    if (compatCb && typeof compatCb === "function") {
      defaultValue = compatCb.call(null, result, epTarget, path, defaultOpts);
    } else {
      defaultValue = compatCb;
    }
  } else if (nativeToString.call(path) === "[object Array]") {
    path.forEach((singlePath, idx) => {
      if (typeof singlePath === "string") {
        result = getValueByPath({ path: singlePath, target });
        executePlugins({ plugins, value: result, name: cbParams[idx] });
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
    error
  });
};

export default jscalpel;

export { jscalpelType, jscalpelLogic, jscalpelORM };
