var _ = require('./utils');

var hiddenField = _.createArr(10).reduce(function(result) {
  return result + _.randomDigit();
}, '__cla6Hidden__');

function Hidden(descriptors) {
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
    swapHidden(this);
    var result = method.apply(this, arguments);
    swapHidden(this);
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

module.exports = Hidden;