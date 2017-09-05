
![](./logo/logox3.png)

A small feature library that makes it easier to manipulate objects
## Overview

It is tiny but very useful and can help you handle javascript native objects. Data-driven interface development is very common today, we are in the [angular](https://github.com/angular/angular), [react](http://www.github.com/facebook/react), [vue](http://www.github.com/vuejs/vue) will encounter a lot of object processing, including set the default value, query, assignment, etc., scalpel is born for this scene.

jscalpel is little poor, gzip less than **3k**, so a library you can use it anytime, anywhere without worrying about anything.

## Useage

```javascript
  import Jscalpel from 'jscalpel'
```

## Example

#### before:

```javascript
 const data = {
   test: {
     id: 1000,
     content: [
       {
         status: '0',
         articles: []
       }
     ]
   }
 }
 // for safe to get articles;
 if (data.test && data.test.content && data.content.articles) {
   const articles = data.content.articles;
   if (Array.isArray(content) && content.length>0) {
     // 对content进行操作
   }
 }
  if (data.test && data.test.content && data.content.status) {
   const status = data.content.status;
   if (typeof status === '0') {
     // 执行某个操作
   }
 }
```

#### after

```javascript
import Scalpel from 'jscalpel';
const data = {
   test: {
     id: 1000,
     content: [
       {
         status: '0',
         articles: []
       }
     ]
   }
 }
const doSomethingByStatus = (status) => {} 
const returnValue = Scalpel({
  target: data,
  prefix: 'test.content',
  keys: ［'articles', 'status']
  callback: (articles, status='') => {
    if (Array.isArray(articles) && articles.length>0) {
      console.log('articles', articles);
    }
    status === '0' && doSomethingByStatus(status);
  }
})
```
