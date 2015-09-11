// http://eslint.org/docs/developer-guide/nodejs-api.html
// http://eslint.org/docs/developer-guide/working-with-rules.html

var eslint = Package['east5th:eslint'].eslint;
var linter = eslint.linter;
var CLIEngine = eslint.CLIEngine;

var cli = new CLIEngine({
  envs: ['meteor'],
  baseConfig: {},
  rules: {
    checks: 1
  }
});

var files = [process.env.PWD || process.cwd()];

Meteor.startup(function() {
  var report = cli.executeOnFiles(files);
  //var formatter = cli.getFormatter('tap');
  //console.log(formatter(report.results));
  report.results.map(function(result) {
    if (result.messages.length) {
      var filename = result.filePath.replace(process.env.PWD, '');
      console.log(filename + ':');
    }
    result.messages.map(function(message) {
      console.log('  ' + message.message);
    });
  });
});
