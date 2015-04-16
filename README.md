# Cla6 Hidden 

This is an addon plugin for [Cla6.js](https://github.com/DAB0mB/cla6) class system library. It provides the ability to hide some of the instance's properties and therefore make some of your api's logic private without exposing it. Although originally designed for use with [Node.js](http://nodejs.org) and installable via `npm install cla6-hidden`, it can also be used directly in the browser.

Cla6 Hidden is also installable via:

- [bower](http://bower.io/): `bower install cla6-hidden`

## Basic Examples

```js
var Klass = Cla6('Klass', {
  constructor: function() {
    this._hidden = 'hidden';
  },

  get hidden() {
    return this._hidden;
  }
});

var obj = new Klass();
console.log(obj.hidden); // hidden
console.log(obj._hidden); // undefined
```

You may also define hidden properties on the prototype. Don't worry, Cla6-Hidden also knows how to handle the inheritance process:

```js
var Parent = Cla6('Parent', {
  _foo: 'parent',
  _bar: 'parent'
});

var Child = Cla6('Child').extend(Parent, {
  _bar: 'child',

  log: function() {
    console.log(this._foo); // parent
    console.log(this._bar); // child
  }
});

obj = new Child();
obj.log();
```

## How To Use

```js
var Cla6 = require('cla6');
var Cla6Hidden = require('cla6-hidden');

Cla6.use(Cla6Hidden);
```

## Download

The source is available for download from
[GitHub](http://github.com/DAB0mB/cla6-hidden).
Alternatively, you can install using Node Package Manager (`npm`):

    npm install cla6-hidden
