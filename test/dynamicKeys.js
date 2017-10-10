var jscalpel = require('../dist/jscalpel.min')
// var jscalpel = require('../index')

const res = {
  data: {
    article: [{
      articleId: 0,
        title: 'jscalpel'
    }]
  },
  response: {
    code: '0',
    msg: 'success'
  }
}


// TODO: 使用dynamicKyes时，callback的keys会带上前缀。而使用prefix时不会带上前缀，这里需要统一下。
jscalpel({
  target: res,
  // prefix: 'response2',
  keys: 'response.code',
  plugins: [],
  // dynamicKeys: (keys) => {
  //   // keys指的是配置的keys['code', 'msg']
  //   return keys.map((key) => `response.${key}`)
  // },
  // TODO: 这里用rest语法的时候，rest会多一个undefined。
  callback:  (code) => {
    // 这是个注释
    console.log('dynamic=>output:', code);
    /* 
      我是一个多行注释
      我是第二行
    */ 
  }
})