var Algorithm = module.exports = function Algorithm(options) {
};

Algorithm.prototype.name = function name() {
  return null;
};

Algorithm.prototype.canonicalise = function canonicalise(node, cb) {
  setImmediate(function() {
    return cb(Error("not implemented"));
  });
};
