import jscalpelORM from './orm';
const nativeToString = Object.prototype.toString;
const isObject = obj => nativeToString.call(obj) === '[object Object]';
export {
    jscalpelORM,
    isObject,
    nativeToString,
}