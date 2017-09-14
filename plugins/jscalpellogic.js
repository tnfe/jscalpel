const logicMap = {
    'code': {
        match: (value) => value === -1,
        success: (value) => {
            alert('code');
        }
    }
}
const jscalpelLogic = ({
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
            }
        })
    }
};
export default jscalpelLogic;
