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

module.exports = {
  createArr: createArr,
  copy: copy,
  getAncestors: getAncestors,
  move: move,
  randomDigit: randomDigit
};