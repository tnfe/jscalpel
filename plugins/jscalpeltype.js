const jscalpelType = ({
    value,
    name
}) => {
    console.log('value:::', value, name);
    const simpleTypes = ['string', 'undefined', 'function', 'number', 'boolean'];
    if (simpleTypes.indexOf(typeof value)!== -1 ) {
        return {
            value,
            type: typeof value
        }
    }
    if (value + '' === 'null') {
        return {
            value,
            type: 'null'
        }
    }
    if (Array.isArray(value)) {
        return {
            value,
            type: 'array',
            length: value.length
        }
    }
    if (Object.prototype.toString.call(value) === '[object Object]') {
        return {
            value,
            type: 'object',
            keys: Object.keys(value),
            values: Object.values(value)
        }
    }
}

export default jscalpelType;