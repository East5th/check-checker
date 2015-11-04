var eslint = Npm.require("eslint");

Plugin.registerLinter({
  extensions: ["js"],
  archMatching: "os"
}, function() {
  return new CheckChecker();
});

function CheckChecker() {
  eslint.linter.defineRule('checks', checks);
};

CheckChecker.prototype.processFilesForPackage = function(files, options) {
  var config = {
    rules: {
      checks: 1
    }
  };
  files.forEach(function(file) {
    var source = file.getContentsAsString();
    var path = file.getPathInPackage();
    var results = eslint.linter.verify(source, config, path);
    results.forEach(function(result) {
      file.error({
        message: result.message,
        line: result.line,
        column: result.column
      });
    });
  });
};
