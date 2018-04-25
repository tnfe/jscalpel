
![](./logo/logox3.png)

A small feature library that makes it easier to manipulate objects
## Overview

It is tiny but very useful and can help you handle javascript native objects. Data-driven interface development is very common today, we are in the [angular](https://github.com/angular/angular), [react](http://www.github.com/facebook/react), [vue](http://www.github.com/vuejs/vue) will encounter a lot of object processing, including set the default value, query, assignment, etc., [jscalpel](http://www.github.com/ihtml5/jscalpel) is born for this scene.

jscalpel is little poor, gzip less than **3k**, so a library you can use it anytime, anywhere without worrying about anything.

## Document

#### View the document please visit [https://ihtml5.github.io/jscalpel/](https://ihtml5.github.io/jscalpel/)
[中文文档](https://ihtml5.github.io/jscalpel/index_zh.html)

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
  <script charset="utf-8" src="https://unpkg.com/jscalpel@latest/dist/index.js"></script>
```
#### [Demos](https://jsfiddle.net/as3tLkdy/27/?utm_source=website&utm_medium=embed&utm_campaign=as3tLkdy)

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
jscalpel.default({
	target: res,
  path: ['data.article.0', 'response.msg'],
  success:  (article, msg) => {
  	console.log('keys=>array=>output:', article, msg);
  }
})

jscalpel.default({
	target: res,
  path: 'response.msg',
  success:  (msg) => {
  	console.log('keys=>string=>output:',msg);
  }
})

jscalpel.default({
	target: res,
  prefix: 'response',
  path: ['code', 'msg'],
  success:  (code, msg) => {
  	console.log('prefix=>output:', code, msg);
  }
})
//

jscalpel.default({
	target: res,
  path: () => ['code', 'msg'].map((key) => `response.${key}`),
  success:  (code, msg) => {
  	console.log('dynamic=>output:', code, msg);
  }
})

jscalpel.default({
	target: res,
  deep: true,
  prefix: 'response',
  path: ['code', 'msg'],
  success:  (code, msg, finalRes, keys) => {
    console.log( finalRes === res);
  	console.log('deep into callback:', code, msg, finalRes, keys);
  }
});

jscalpel.default({
	target: res,
  deep: true,
  prefix: 'response',
  path: ['code', 'msg'],
  plugins: [jscalpel.jscalpelType, jscalpel.jscalpelLogic(logicMap)],
  success: (code, msg, finalRes, keys) => {
    console.log( finalRes === res);
  	console.log('deep into callback:', code, msg, finalRes, keys);
  }
})


```
## Related projects
[jscalpel-orm](https://github.com/ihtml5/jscalpel-orm)

It is convenient for you to extract the required fields from one object to generate another object.

## Changelog

#### 2017.9.14

Add jscalpelLogic plugin, reduce ifelse, make run logic configurable

#### 2018.3.08

add orm 
