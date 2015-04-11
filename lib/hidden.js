var _ = require('./utils');

var hiddenField = _.createArr(10).reduce(function(result) {
  return result + _.randomDigit();
}, '__cla6Hidden__');

function Hidden(props) {
  var _props = {};

  Object.keys(props).filter(function(k) {
    if (k[0] == '_') {
      _.move(props, _props, k);
      _props[k].enumerable = true;
    } else {
      return true;
    }
  })
  .forEach(function(k) {
    wrapDescriptor(props[k], _props);
  });
}

wrapDescriptor = function(descriptor, _props) {
  ['value', 'get', 'set'].filter(function(k) {
    return typeof descriptor[k] == 'function';
  })
  .forEach(function(k) {
    descriptor[k] = wrapMethod(descriptor[k], _props);
  });
};

wrapMethod = function(method, _props) {
  return function() {
    if (this[hiddenField] == null) {
      var hidden = Object.defineProperties({}, _props);
      Object.defineProperty(this, hiddenField, {value: hidden});
    }

    unzipHidden(this);
    var result = method.apply(this, arguments);
    zipHidden(this);
    return result;
  };
};

zipHidden = function(obj) {
  var hidden = obj[hiddenField];

  Object.keys(obj).filter(function(k) {
    return k[0] == '_';
  })
  .forEach(function(k) {
    _.move(obj, hidden, k);
  });
};

unzipHidden = function(obj) {
  var hidden = obj[hiddenField];

  Object.keys(hidden).forEach(function(k) {
    _.move(hidden, obj, k);
  });
};

module.exports = Hidden;