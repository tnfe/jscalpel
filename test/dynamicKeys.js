var jscalpel = require('../dist/jscalpel.min')
// var jscalpel = require('../index')

import jscalpelType from '../plugins/jscalpeltype'
console.log('is plugin loaded: ', jscalpelType)

const res = {
  data: {
    article: [{
      articleId: 0,
        title: 'jscalpel'
    }]
  },
  response: {
    code: 0,
    msg: 'success'
  }
}


// TODO: 使用dynamicKyes时，callback的keys会带上前缀。而使用prefix时不会带上前缀，这里需要统一下。
var finalRel = jscalpel({
  target: res,
  prefix: 'response',
  keys: ['code'],
  plugins: [jscalpelType],
  // callback: undefined,
  // dynamicKeys: (keys) => {
  //   // keys指的是配置的keys['code', 'msg']
  //   return keys.map((key) => `response.${key}`)
  // },
  callback:  (code, ...rest) => {
    // 这是个注释
    console.log('dynamic=>output:', code);
    console.log('rest: ', rest)
    /* 
      我是一个多行注释
      我是第二行
    */ 
  }
}, {test: 'haha'})

console.log('finalRel: ', finalRel)