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
    if (k != hiddenField && k[0] == '_') {
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
    revealHidden(this);
    var result = method.apply(this, arguments);
    hideHidden(this);
    return result;
  };
};

revealHidden = function(obj) {
  _.move(obj[hiddenField], obj);
};

hideHidden = function(obj) {
  var hidden = obj[hiddenField];

  Object.keys(obj).filter(function(k) {
    return k[0] == '_';
  })
  .forEach(function(k) {
    _.move(obj, hidden, k);
  });
};

module.exports = Hidden;