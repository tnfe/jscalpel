const jscalpelLogic = (logicMap) => ({
    value,
    name
}) => {
    if (logicMap[name]) {
        jscalpel({
            target: logicMap,
            prefix: `${name}`,
            path: ['match', 'success'],
            callback: (match, success) => {
                match({value, name}) && success({value, name});
                return value;
            }
        });
    }
    return value;
};
export default jscalpelLogic;
