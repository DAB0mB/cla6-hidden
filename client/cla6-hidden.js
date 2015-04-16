(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Cla6 = require('cla6');
var Cla6Hidden = require('..');

Cla6.use(Cla6Hidden);
},{"..":2,"cla6":4}],2:[function(require,module,exports){
var _ = require('./utils');

var hiddenField = _.createArr(10).reduce(function(result) {
  return result + _.randomDigit();
}, '__cla6Hidden__');

function Hidden(props) {
  var _props = {};

  props[hiddenField] = {
    value: _props
  };

  Object.keys(props).filter(function(k) {
    if (k[0] == '_' && k != hiddenField) {
      _.move(props, _props, k);
      _props[k].enumerable = true;
    } else {
      return true;
    }
  })
  .forEach(function(k) {
    if (k == 'constructor')
      props.constructor.value = wrapCtor(props.constructor.value);
    else
      wrapDescriptor(props[k]);
  });
}

wrapDescriptor = function(descriptor) {
  ['value', 'get', 'set'].filter(function(k) {
    return typeof descriptor[k] == 'function';
  })
  .forEach(function(k) {
    descriptor[k] = wrapMethod(descriptor[k]);
  });
};

wrapCtor = function(ctor) {
  return function() {
    if (!this.hasOwnProperty(hiddenField)) {
      var ancestors = _.getAncestors(this);

      var _props = ancestors.map(function(ancestor) {
        return ancestor.prototype[hiddenField];
      })
      .reduce(function(result, hidden) {
        _.copy(hidden, result);
        return result;
      }, {});

      var hidden = Object.defineProperties({}, _props);
      Object.defineProperty(this, hiddenField, {value: hidden});
    }

    return wrapMethod(ctor).apply(this, arguments);
  };
};

wrapMethod = function(method) {
  return function() {
    swapHidden(this);
    var result = method.apply(this, arguments);
    swapHidden(this);
    return result;
  };
};

swapHidden = function(obj) {
  var hidden = obj[hiddenField];
  _.swap(hidden, obj);

  Object.keys(hidden).filter(function(k) {
    return k[0] != '_';
  })
  .forEach(function(k) {
    _.move(hidden, obj, k);
  });
};

module.exports = Hidden;
},{"./utils":3}],3:[function(require,module,exports){
var createArr = function(length) {
  return Array.apply(null, {length: length});
};

var copy = function(src, dst, k) {
  if (k == null) {
    Object.keys(src).forEach(function(k) {
      copy(src, dst, k);
    });
  } else {
    var descriptor = Object.getOwnPropertyDescriptor(src, k);
    Object.defineProperty(dst, k, descriptor);
  }
};

getAncestors = function(obj) {
  var ancestor = Object.getPrototypeOf(obj).constructor;

  if (ancestor === Object)
    return [];
  else
    return getAncestors(ancestor.prototype).concat(ancestor);
};

var move = function(src, dst, k) {
  if (k == null) {
    Object.keys(src).forEach(function(k) {
      move(src, dst, k);
    });
  } else {
    copy(src, dst, k);
    delete src[k];
  }
};

var randomDigit = function() {
  return parseInt(Math.random() * 10);
};

var swap = function(src, dst) {
  var temp = {};
  move(src, temp);
  move(dst, src);
  copy(temp, dst);
};

module.exports = {
  createArr: createArr,
  copy: copy,
  getAncestors: getAncestors,
  move: move,
  randomDigit: randomDigit,
  swap: swap
};
},{}],4:[function(require,module,exports){
var ClassFactory = require('./classFactory');
var Extender = require('./extender');

function Cla6(name, props) {
  if (name == null)
    throwErr('a name must be provided');

  if (typeof name != 'string')
    throwErr('name must be a string');

  if (props != null) {
    if (typeof props != 'object')
      throwErr('properties must be defined using an object');
    
    if (props.hasOwnProperty('constructor') &&
        typeof props.constructor != 'function')
      throwErr('constructor must be a function');
  }

  if (props == null)
    return new Extender(name);
  else
    return ClassFactory.create(name, props);
}

Cla6.use = function(plugin) {
  if (plugin == null)
    throwErr('a plugin must be provided');

  if (typeof plugin != 'function')
    throwErr('plugin must be a function');

  ClassFactory.use(plugin);
};

var throwErr = function(msg) {
  throw Error('Cla6 error - ' + msg);
};

module.exports = Cla6;
},{"./classFactory":5,"./extender":6}],5:[function(require,module,exports){
var _ = require('./utils');

var plugins = [];

var createClass = function(name, props, Parent) {
  props = _.clone(props);

  if (typeof Parent != 'function')
    Parent = Object;

  if (!props.hasOwnProperty('constructor'))
    props.constructor = function() {
      Parent.apply(this, arguments);
    };

  var fixedProps = getFixedProps(props);
  applyPlugins(fixedProps);

  var Child = _.nameFn(fixedProps.constructor.value, name);
  fixedProps.constructor.value = Child;

  Child.prototype = Object.create(Parent.prototype, fixedProps);
  return Child;
};

var getFixedProps = function(props) {
  return Object.keys(props).reduce(function(result, k) {
    var descriptor = Object.getOwnPropertyDescriptor(props, k);
    delete descriptor.enumerable;

    if (descriptor.value == null)
      delete descriptor.writable;

    result[k] = descriptor;
    return result;
  }, {});
};

var addPlugin = function(plugin) {
  plugins.push(plugin);
};

var applyPlugins = function(props) {
  plugins.forEach(function(plugin) {
    plugin(props);
  });
};

module.exports = {
  create: createClass,
  use: addPlugin
};
},{"./utils":7}],6:[function(require,module,exports){
var ClassFactory = require('./classFactory');

var Extender = ClassFactory.create('Extender', {
  constructor: function(name) {
    this.name = name;
  },

  extend: function(Parent, props) {
    if (Parent == null)
      throwErr('a parent must be provided');

    if (typeof Parent != 'function')
      throwErr('parent must be a function');

    if (props == null)
      throwErr('properties must be provided');

    if (typeof props != 'object')
      throwErr('properties must be defined using an object');

    if (props.hasOwnProperty('constructor') &&
        typeof props.constructor != 'function')
      throwErr('constructor must be a function');

    return ClassFactory.create(this.name, props, Parent);
  }
});

var throwErr = function(msg) {
  throw Error('Cla6 extension error - ' + msg);
};

module.exports = Extender;
},{"./classFactory":5}],7:[function(require,module,exports){
var clone = function(obj) {
  return Object.keys(obj).reduce(function(result, k) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, k);
    return Object.defineProperty(result, k, descriptor);
  }, {});
};

var nameFn = function(fn, name) {
  return eval('(function ' + name + '() {return fn.apply(this, arguments);})');
};

module.exports = {
  clone: clone,
  nameFn: nameFn
};
},{}]},{},[1]);