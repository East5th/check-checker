Package.describe({
  name: 'east5th:check-checker',
  version: '0.0.5',
  summary: 'An eslint based check checker.',
  git: 'https://github.com/East5th/space-lint',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('east5th:eslint@0.0.2');

  api.addFiles('lib/rules/checks.js', 'server');
  api.addFiles('lib/check-checker.js', 'server');
});