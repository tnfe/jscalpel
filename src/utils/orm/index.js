import jscalpel from '../../index';

export const isObject = obj => Object.prototype.toString.call(obj) === '[Object object]';

const jscalpelORM = (source = {}, rules, defaultValue) => {
  if (!isObject(source)) {
    console.error(`source为${source},不是对象`);
    return defaultValue;
  }
  if (!isObject(rules)) {
    console.error(`rules为${rules},不是对象`);
    return defaultValue;
  }
  try {
    const targetPath = Object.keys(rules);
    const _extraInfo = rules._extraInfo || {};
    const target = {};
    const jscalpelIns = jscalpel({
      target,
    });
    const jscalpelSourceIns = jscalpel({
      target: source,
    });
    targetPath.forEach((path, index) => {
      jscalpelIns.set(path, typeof jscalpelSourceIns.get(path) === 'undefined' ? jscalpelSourceIns.get(rules[path]) : jscalpelSourceIns.get(path));
    });
    return Object.assign(source, target, _extraInfo);
  } catch (e) {
    console.error('请检查source和rules配置，两者都必须为对象!');
    return defaultValue;
  }
};

export default jscalpelORM;
