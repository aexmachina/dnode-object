function DnodeObject() {}

DnodeObject.prototype.wrap = function(object, options) {
  var api = {}, 
      proto = object.constructor.prototype,
      prop;
  for (prop in proto) {
    if (typeof object[prop] === 'function' && this.include(object, prop, options)) {
      // console.log('DnodeObject include', prop); /* debug */
      api[prop] = this.wrapFunction(object, prop, options);
    }
  }
  return api;
};

DnodeObject.prototype.include = function(object, prop, options) {
  var _ref;
  if (prop.substring(0, 1) === '_' || prop === 'constructor') {
    return false;
  }
  if (options) {
    if (options.exclude && options.exclude.indexOf(prop) !== -1 ) {
      return false;
    }
    if (options.include) {
      if (typeof options.include === 'function') {
        if (!options.include(prop)) {
          return false;
        }
      }
      if (options.include.indexOf(prop) === -1) {
        return false;
      }
    }
  }
  return true;
};

DnodeObject.prototype.wrapFunction = function(object, prop) {
  return function() {
    var args, cb, rv;
    args = Array.prototype.slice.call(arguments);
    cb = args.pop();
    rv = object[prop].apply(object, args);
    return cb(rv);
  };
};

module.exports = new DnodeObject;
