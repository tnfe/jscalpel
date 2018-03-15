
![](./logo/logox3.png)

A small feature library that makes it easier to manipulate objects
## Overview

It is tiny but very useful and can help you handle javascript native objects. Data-driven interface development is very common today, we are in the [angular](https://github.com/angular/angular), [react](http://www.github.com/facebook/react), [vue](http://www.github.com/vuejs/vue) will encounter a lot of object processing, including set the default value, query, assignment, etc., [jscalpel](http://www.github.com/ihtml5/jscalpel) is born for this scene.

jscalpel is little poor, gzip less than **3k**, so a library you can use it anytime, anywhere without worrying about anything.

## Document

#### View the document please visit [https://ihtml5.github.io/jscalpel/](https://ihtml5.github.io/jscalpel/)

## Installation

#### Install using npm 
[![jscalpel](https://nodei.co/npm/jscalpel.png)](https://npmjs.org/package/jscalpel)
``` 
npm install jscalpel --save
yarn add jscalpel --save
```

## Useage

#### Es6
```javascript
  import Jscalpel from 'jscalpel'
```
#### Include in html
```javascript
  <script charset="utf-8" src="https://unpkg.com/jscalpel@1.2.0/dist/index.js"></script>
```
```javascript
var data = {
  status: '0',
  data: {
    response: {
      code: 1,
      msg: 'response msg'
    }
  }
}

// bind data
var jscalpelIns = jscalpel({
  target: data
})
jscalpelIns.get('data.response.code') // returned 1;
jscalpelIns.set('data.response.code', 12);
jscalpelIns.set({
  'status': '1'
})
jscalpelIns.get('data.response.code') // returned 12
jscalpelIns.get('status') // returned 1
jscalpelIns.has('data.response.code') // returned true

jscalpelIns.del('data.reponse.code') 

jscalpelIns.get('data.reponse.code') // returned undefined;
jscalpelIns.has('data.reponse.code') // returned false;

// advanced

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
const logicMap = {
  'code': {
    match: ({value, name}) => value === '0',
    success: ({value, name}) => {
      console.log('logicPlugin', value, name);
    }
  }
}

/*
	path为数组时
  output: {articleId: 0, title: "jscalpel"} success
*/
jscalpel.default({
	target: res,
  path: ['data.article.0', 'response.msg'],
  success:  (article, msg) => {
  	console.log('keys=>array=>output:', article, msg);
  }
})
/*
	path为字符串时
  output: 'keys=>string=>output:' success
*/
jscalpel.default({
	target: res,
  path: 'response.msg',
  success:  (msg) => {
  	console.log('keys=>string=>output:',msg);
  }
})
/*
	prefix
  output: 'prefix=>output:' '0' 'success'
*/

jscalpel.default({
	target: res,
  prefix: 'response',
  path: ['code', 'msg'],
  success:  (code, msg) => {
  	console.log('prefix=>output:', code, msg);
  }
})
//

/*
	path为函数时
  output: dynamic=>output: '0' 'success'
*/

jscalpel.default({
	target: res,
  path: () => ['code', 'msg'].map((key) => `response.${key}`),
  success:  (code, msg) => {
  	console.log('dynamic=>output:', code, msg);
  }
})
/*
  deep 是否深度拷贝目标对象
*/

jscalpel.default({
	target: res,
  deep: true,
  prefix: 'response',
  path: ['code', 'msg'],
  success:  (code, msg, finalRes, keys) => {
    /*
    	finalRes 指的是目标对象或者是目标对象的深度拷贝版
      keys指的是最终生成的访问路径
    */
    console.log( finalRes === res);
  	console.log('deep into callback:', code, msg, finalRes, keys);
  }
})

/*
 内置类型检测插件和逻辑分流插件
*/

jscalpel.default({
	target: res,
  deep: true,
  prefix: 'response',
  path: ['code', 'msg'],
  plugins: [jscalpel.jscalpelType, jscalpel.jscalpelLogic(logicMap)],
  success: (code, msg, finalRes, keys) => {
    /*
    	finalRes 指的是目标对象或者是目标对象的深度拷贝版
      keys指的是最终生成的访问路径
    */
    console.log( finalRes === res);
  	console.log('deep into callback:', code, msg, finalRes, keys);
  }
})


```
## Changelog

#### 2017.9.14

Add jscalpelLogic plugin, reduce ifelse, make run logic configurable

#### 2018.3.08

add orm 
