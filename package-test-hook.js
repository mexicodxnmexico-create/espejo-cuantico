const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(request) {
  if (request.endsWith('.css')) {
    return {};
  }
  return originalRequire.apply(this, arguments);
};
