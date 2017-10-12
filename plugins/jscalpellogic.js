const jscalpelLogic = (logicMap) => ({
    value,
    name
}) => {
    if (logicMap[name]) {
        jscalpel({
            target: logicMap,
            prefix: `${name}`,
            keys: ['match', 'success'],
            callback: (match, success) => {
                match(value) && success(value);
                return value;
            }
        });
    }
    return value;
};
export default jscalpelLogic;
