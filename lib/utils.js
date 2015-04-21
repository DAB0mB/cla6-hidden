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