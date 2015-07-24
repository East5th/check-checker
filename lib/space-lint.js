// http://eslint.org/docs/developer-guide/nodejs-api.html
// http://eslint.org/docs/developer-guide/working-with-rules.html

var eslint = Npm.require('eslint');
var linter = eslint.linter;
var CLIEngine = eslint.CLIEngine;

linter.defineRules(Rules);

var cli = new CLIEngine({
  envs: ['meteor'],
  baseConfig: {},
  rulePaths: [process.env.PWD + '/packages/space-lint/lib/rules'],
  rules: {
    checks: 1
  }
});

var files = [
  process.env.PWD + '/'
];

Meteor.startup(function() {
  var report = cli.executeOnFiles(files);
  //var formatter = cli.getFormatter('tap');
  //console.log(formatter(report.results));
  console.log(report);
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
