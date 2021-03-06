(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Cla6Hidden = require('..');

Cla6.use(Cla6Hidden);
},{"..":2}],2:[function(require,module,exports){
var _ = require('./utils');

var hiddenField = _.createArr(10).reduce(function(result) {
  return result + _.randomDigit();
}, '__cla6Hidden__');

var manipulate = function(descriptors) {
  var _descriptors = {};

  descriptors[hiddenField] = {
    value: _descriptors
  };

  Object.keys(descriptors).filter(function(k) {
    if (k[0] == '_' && k != hiddenField) {
      _.move(descriptors, _descriptors, k);
      _descriptors[k].enumerable = true;
    } else {
      return true;
    }
  })
  .forEach(function(k) {
    if (k == 'constructor')
      descriptors.constructor.value = wrapCtor(descriptors.constructor.value);
    else
      wrapDescriptor(descriptors[k]);
  });
}

var wrapDescriptor = function(descriptor) {
  ['value', 'get', 'set'].filter(function(k) {
    return typeof descriptor[k] == 'function';
  })
  .forEach(function(k) {
    descriptor[k] = wrapMethod(descriptor[k]);
  });
};

var wrapCtor = function(ctor) {
  return function() {
    if (!this.hasOwnProperty(hiddenField)) {
      var ancestors = _.getAncestors(this);

      var _descriptors = ancestors.map(function(ancestor) {
        return ancestor.prototype[hiddenField];
      })
      .reduce(function(result, hidden) {
        _.copy(hidden, result);
        return result;
      }, {});

      var hidden = Object.defineProperties({}, _descriptors);
      Object.defineProperty(this, hiddenField, {value: hidden});
    }

    return wrapMethod(ctor).apply(this, arguments);
  };
};

var wrapMethod = function(method) {
  return function() {
    var result;

    swapHidden(this);

    try {
      result = method.apply(this, arguments);
    } finally {
      swapHidden(this);
    }

    return result;
  };
};

var swapHidden = function(obj) {
  var hidden = obj[hiddenField];
  _.swap(hidden, obj);

  Object.keys(hidden).filter(function(k) {
    return k[0] != '_';
  })
  .forEach(function(k) {
    _.move(hidden, obj, k);
  });
};

module.exports = {
  manipulate: manipulate
};
},{"./utils":3}],3:[function(require,module,exports){
var createArr = function(length) {
  return Array.apply(null, {length: length});
};

var randomDigit = function() {
  return parseInt(Math.random() * 10);
};

var getAncestors = function(obj) {
  var ancestor = Object.getPrototypeOf(obj).constructor;

  if (ancestor === Object)
    return [];
  else
    return getAncestors(ancestor.prototype).concat(ancestor);
};

var swap = function(src, dst) {
  var temp = {};
  move(src, temp);
  move(dst, src);
  copy(temp, dst);
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

module.exports = {
  createArr: createArr,
  randomDigit: randomDigit,
  getAncestors: getAncestors,
  swap: swap,
  move: move,
  copy: copy
};
},{}]},{},[1]);
