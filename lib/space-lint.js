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
    test: 1,
    test2: 1
  }
});

var files = [
  process.env.PWD + '/packages/space-lint/lib/space-lint.js'
];

var report = cli.executeOnFiles(files);
var formatter = cli.getFormatter();
console.log(formatter(report.results));

var flabbergarben = 5;
var snobgobber = 7;