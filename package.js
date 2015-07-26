Package.describe({
  name: 'east5th:check-checker',
  version: '0.0.1',
  summary: 'An eslint based check checker.',
  git: 'https://github.com/East5th/space-lint',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('east5th:eslint');
  api.addFiles('lib/check-checker.js');
});