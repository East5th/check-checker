Package.describe({
  name: 'east5th:check-checker',
  version: '0.0.9',
  summary: 'An eslint based check checker.',
  git: 'https://github.com/East5th/check-checker',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "check-checker",
  sources: [
    "lib/rules/checks.js",
    "lib/check-checker.js"
  ],
  npmDependencies: {
    eslint: "0.24.1"
  }
});

Package.onUse(function(api) {
  api.use("isobuild:linter-plugin@1.0.0");
});
