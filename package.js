Package.describe({
  name: 'east5th:space-lint',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'An static analysis based check checker.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/East5th/space-lint',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('east5th:eslint');
  api.addFiles('lib/space-lint.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('space-lint');
  api.addFiles('lib/space-lint-tests.js');
});