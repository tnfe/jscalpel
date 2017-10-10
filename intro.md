## Jscalpel 一个从需求中提炼出来的javascript对象操作库
> 数据驱动界面开发(MDV)已经是当前web开发的主流思想。react，vue，angular就是典型代表。数据驱动界面开发的基本思想是界面是有一堆数据表示，通过修改数据来驱动界面更新。数据表示中，大量使用对象比如server对返回的数据，react中的state，vue中的data等都是对象，围绕对象的操作包括增删改查成了数据驱动界面开发中的重要操作。本文提到的jscalpel就是一个辅助你快捷操作对象的库。

![](https://github.com/ihtml5/jscalpel/raw/master/logo/logox3.png)

[jscalpel](http://www.github.com/ihtml5/jscalpel) 取名类似于jquery，寓意为js手术刀，帮助你快速简洁操作对象

它带来的好处有：
1. 不用声明过多变量
2. 安全操作对象，即使访问的值为空
3. 灵活强大的路径生成和分析机制

以前
```javascript
const data = {
      status: '0',
      test: {
          article: [{
            id: 1,
            content: 'article'
          }]
      }
}
// 要获取article的值
if (data.test && data.test.article) {
  const article = data.test.article;
  if (Array.isArray(article)) {
    // do something
  }
}
```

之后
```javascript
jscalpel({
    target: data,
    keys: 'data.test.article',
    callback: function (article) {
      if (Array.isArray(article)) {
           console.log('article', article);
      }
    }
});
```

## 文档

#### 访问文档[https://ihtml5.github.io/jscalpel/](https://ihtml5.github.io/jscalpel/)

## Installation

#### Install using npm 
[![jscalpel](https://nodei.co/npm/jscalpel.png)](https://npmjs.org/package/jscalpel)
``` 
npm install jscalpel --save
yarn add jscalpel --save
```

## 使用

#### Es6
```javascript
npm i jscalpel --save

import jscalpel from 'jscalpel'
```

Es5

1. 下载[jscalpel.min.js](https://unpkg.com/jscalpel@0.5.1/dist/jscalpel.min.js)

2. 在srcipt标签中直接引入

## 使用

#### 参数说明

<table class="scalpel-table">
    <thead>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>默认值</th>
            <th>用途</th>
            <th>是否必须</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>target</td>
            <td>string/object</td>
            <td>{}</td>
            <td>目标对象</td>
            <td>是</td>
        </tr>
        <tr>
            <td>deep</td>
            <td>boolean</td>
            <td>false</td>
            <td>是否深度拷贝目标对象</td>
            <td>否</td>
        </tr>
        <tr>
            <td>keys</td>
            <td>string/array</td>
            <td>''</td>
            <td>需要访问的一系列路径，可以是单个字符串或者路径数组</td>
            <td>否</td>
        </tr>
        <tr>
            <td>prefix</td>
            <td>string</td>
            <td>undefined</td>
            <td>公共前缀，自动为keys加前缀</td>
            <td>否</td>
        </tr>
        <tr>
            <td>dynamicKeys</td>
            <td>string/object</td>
            <td>undefined</td>
            <td>常用在react, angular,vue中根据状态的变化生成不同的keys; 使用该项时会忽略prefix配置</td>
            <td>否</td>
        </tr>
        <tr>
            <td>callback</td>
            <td>function</td>
            <td>function (@value, ..., @finalTarget, @keys) {}</td>
            <td>分析成功时调用的函数; @value表示对应要获取key的value值, @finalTarget表示目标对象或目标对象的深度拷贝, @keys表示最终生成的访问路径数组</td>
            <td>是</td>
        </tr>
    </tbody>
</table>

#### demos

[demos](https://jsfiddle.net/ihtml5/as3tLkdy/)


### 相关类库

[ppo](https://github.com/a-jie/ppo)