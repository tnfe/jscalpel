const jscalpel = require('../dist').default;
const jscalpelGet = require('../dist').get;
const res = {
    response: {
        msg: 'ok',
        code: null,
    },
    data: {
        articles: [{
            id: 1,
            text: 'react',
        }],
        total: 1,
    }
}
describe('jscalpel test', () => {
    beforeAll(() => {});
    test('test path is string', () => {
        jscalpel({
            target: res,
            path: 'response.msg',
            success: msg => {
                expect(msg).toBe('ok');
            }
        })
    });
    test('test jscalpel get', () => {
        const returnVal = jscalpelGet(res, 'response.msg', 'get');
        const returnVal1 = jscalpelGet(res, 'response.code.msg', 'get');
        expect(returnVal).toBe('ok');
        expect(returnVal1).toBe('get');
    });
    test('test jscalpel get null', () => {
        const returnVal1 = jscalpelGet(res, 'response.code.msg', 'get');
        expect(returnVal1).toBe('get');
    });
    test('test path is array', () => {
        jscalpel({
            target: res,
            path: ['response.msg', 'data.articles.0.id'],
            success: (msg, id) => {
                expect(msg).toBe('ok');
                expect(id).toBe(1);
            }
        })
    });
    test('test path is function', () => {
        jscalpel({
            target: res,
            path: () => ['response.msg', 'data.articles.0.id'],
            success: (msg, id) => {
                expect(msg).toBe('ok');
                expect(id).toBe(1);
            }
        }) 
    })
    test('test prefix', () => {
        jscalpel({
            target: res,
            prefix: 'response',
            path: ['msg', 'code.status'],
            success: (msg, code) => {
                expect(msg).toBe('ok');
                expect(code).toBe(void 0);
            }
        });
        jscalpel({
            target: res,
            prefix: 'data',
            path: ['articles.0.text', 'total'],
            success: (text, total) => {
                expect(text).toBe('react');
                expect(total).toBe(1);
            }
        });
    });
    test('test is undefined', () => {
        jscalpel({
            target: res,
            prefix: 'data',
            path: ['no'],
            success: no => {
                expect(no).toBeUndefined();
            }
        }); 
    })
    test('test return value', () => {
        const no = jscalpel({
            target: res,
            prefix: 'data',
            path: ['no'],
            success: no => no,
        });
        const returnVal = jscalpel({
            target: res,
            prefix: 'data',
            path: ['articles.0.text', 'total'],
            success: (text, total) => {
                return {
                    text,
                    total
                }
            }
        });
        expect(returnVal).toEqual({
            text: 'react',
            total: 1
        });
    })
})