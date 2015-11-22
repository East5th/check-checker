var eslint = Npm.require("eslint");

Plugin.registerLinter({
  extensions: ["js"],
  archMatching: "os"
}, function() {
  return new CheckChecker();
});

function CheckChecker() {
  this._cache = {};
  eslint.linter.defineRule('checks', checks);
};

CheckChecker.prototype.processFilesForPackage = function(files, options) {
  var packageName = files[0].getPackageName();
  if (!this._cache[packageName]) {
    this._cache[packageName] = {};
  }
  var cache = this._cache[packageName];
  var config = {
    env: {
      es6: true
    },
    rules: {
      checks: 1
    }
  };
  files.forEach(function(file) {
    var source = file.getContentsAsString();
    var path = file.getPathInPackage();
    var results;
    if (cache[path] && cache[path].hash === file.getSourceHash()) {
      results = cache[path].results;
    }
    else {
      results = eslint.linter.verify(source, config, path);
      cache[path] = {
        results: results,
        hash: file.getSourceHash()
      };
    }
    results.forEach(function(result) {
      file.error({
        message: result.message,
        line: result.line,
        column: result.column
      });
    });
  });
};
