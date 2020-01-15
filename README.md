
![](./logo/logox3.png)

A small feature library that makes it easier to manipulate objects

[![npm package](https://img.shields.io/npm/v/jscalpel.svg)](https://www.npmjs.org/package/jscalpel)
[![NPM downloads](http://img.shields.io/npm/dm/jscalpel.svg)](https://npmjs.org/package/jscalpel)
## Overview

It is tiny but very useful and can help you handle javascript native objects. Data-driven interface development is very common today, we are in the [angular](https://github.com/angular/angular), [react](http://www.github.com/facebook/react), [vue](http://www.github.com/vuejs/vue) will encounter a lot of object processing, including set the default value, query, assignment, etc., [jscalpel](http://www.github.com/tnfe/jscalpel) is born for this scene.

jscalpel is little poor, gzip less than **3k**, so a library you can use it anytime, anywhere without worrying about anything.

## Document

#### View the document please visit [https://tnfe.github.io/jscalpel/](https://tnfe.github.io/jscalpel/)
[中文文档](https://tnfe.github.io/jscalpel/index_zh.html)

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
## APIS
<table class="scalpel-table">
                <thead>
                    <tr>
                        <th>parameter</th>
                        <th>type</th>
                        <th>default value</th>
                        <th>use</th>
                        <th>isRequired</th>
                        <th>required version</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>target</td>
                        <td>string/object</td>
                        <td>{}</td>
                        <td>target</td>
                        <td>true</td>
                        <td>all</td>
                    </tr>
                    <tr>
                        <td>deep</td>
                        <td>boolean</td>
                        <td>false</td>
                        <td>whether or not to copy the target object in depth</td>
                        <td>false</td>
                        <td>all</td>
                    </tr>
                    <tr>
                        <td>prefix</td>
                        <td>string</td>
                        <td>undefined</td>
                        <td>public prefix, automatically added for the keys</td>
                        <td>false</td>
                        <td>all</td>
                    </tr>
                    <tr>
                        <td>success</td>
                        <td>function</td>
                        <td>function () {}</td>
                        <td>The function that was called when the analysis was successful</td>
                        <td>true</td>
                        <td>^0.6.2</td>
                    </tr>
                    <tr>
                        <td>error</td>
                        <td>function</td>
                        <td>function () {}</td>
                        <td>The function that is called when the analysis fails.</td>
                        <td>false</td>
                        <td>^0.6.2</td>
                    </tr>
                    <tr>
                        <td>path</td>
                        <td>string/array/function</td>
                        <td>[]</td>
                        <td>path</td>
                        <td>false</td>
                        <td>^0.6.2</td>
                    </tr>
                    <tr>
                        <td>plugins</td>
                        <td>array</td>
                        <td>[]</td>
                        <td>A plug-in set, similar to the webpack plugins.</td>
                        <td>false</td>
                        <td>^0.6.2</td>
                    </tr>
                </tbody>
            </table>
            
## [Online Demos](https://jsfiddle.net/as3tLkdy/27/?utm_source=website&utm_medium=embed&utm_campaign=as3tLkdy)

## Code
#### 1. simple pattern
```javascript
// mock data
var data = {
  status: '0',
  data: {
    response: {
      code: 1,
      msg: 'response msg'
    }
  }
}
// super easy
jscalpel.get(data, 'data.response.code'); // return 1
// deep copy object
jscalpel.toCopy(data) !== data; // return true;
jscalpel.set(data, 'data.response.code', 0);
jscalpel.get(data, 'data.response.code') // return 0;
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
```
#### 2.advanced patterns
```
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
jscalpel({
	target: res,
  path: ['data.article.0', 'response.msg'],
  success:  (article, msg) => {
  	console.log('keys=>array=>output:', article, msg);
  }
})

jscalpel({
	target: res,
  path: 'response.msg',
  success:  (msg) => {
  	console.log('keys=>string=>output:',msg);
  }
});
```
#### 3.use prefix
```
jscalpel({
	target: res,
  prefix: 'response',
  path: ['code', 'msg'],
  success:  (code, msg) => {
  	console.log('prefix=>output:', code, msg);
  }
})
```
#### 4.dynamic path

```
jscalpel({
  target: res,
  path: () => ['code', 'msg'].map((key) => `response.${key}`),
  success:  (code, msg) => {
  	console.log('dynamic=>output:', code, msg);
  }
})

jscalpel({
	target: res,
  deep: true,
  prefix: 'response',
  path: ['code', 'msg'],
  success:  (code, msg, finalRes, keys) => {
    console.log( finalRes === res);
  	console.log('deep into callback:', code, msg, finalRes, keys);
  }
});
```

#### 5.use plugins
```
const logicMap = {
  'code': {
    match: ({value, name}) => value === '0',
    success: ({value, name}) => {
      console.log('logicPlugin', value, name);
    }
  }
}
jscalpel({
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
[jscalpel-orm](https://github.com/tnfe/jscalpel-orm)

It is convenient for you to extract the required fields from one object to generate another object.

## Changelog

#### 2017.9.14

Add jscalpelLogic plugin, reduce ifelse, make run logic configurable

#### 2018.3.08

add orm 
#### 2018.9.04

add get method
```javascript
import { get } from 'jscalpel';
// get(data, path ,defaultValue);
```
#### 2018.12.30
```javascript
import { set, get, toCopy } from 'jscalpel';
// deep copy object
toCopy(data) !== data; // return true;
// set path value
set(data, 'data.response.code', 0);
get(data, 'data.response.code') // return 0;
```
## License

[The MIT License](https://opensource.org/licenses/MIT).
