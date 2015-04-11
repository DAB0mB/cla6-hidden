var createArr = function(length) {
  return Array.apply(null, {length: length});
};

var move = function(src, dst, k) {
  if (k == null) {
    Object.keys(src).forEach(function(k) {
      _.move(src, dst, k);
    });
  } else {
    var descriptor = Object.getOwnPropertyDescriptor(src, k);
    Object.defineProperty(dst, k, descriptor);
    delete src[k];
  }
};

var randomDigit = function() {
  return parseInt(Math.random() * 10);
};

module.exports = {
  createArr: createArr,
  move: move,
  randomDigit: randomDigit
};