
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
  <script charset="utf-8" src="https://unpkg.com/jscalpel@latest/dist/jscalpel.min.js"></script>
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

jscalpel({
  target: data,
  path: ['status', 'data.response.code'],
  success: function (status, code, target, keys) {

  },
  error: function (target, keys) {

  }
})

// use plugin
import { jscalpelType, jscalpelLogic } from 'jscalpel';

jscalpel({
  target: data,
  path: ['status', 'data.response.code'],
  plugins: [jscalpelType, jscalpelLogic],
  success: function (status, code, target, keys) {

  },
  error: function (target, keys) {

  }
})

```
## Changelog

#### 2017.9.14

Add jscalpelLogic plugin, reduce ifelse, make run logic configurable

#### 2018.3.08

add orm 
