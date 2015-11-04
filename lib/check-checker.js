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
  files.forEach(function(file) {
//    console.log("file.getBasename(): "+file.getBasename(), file.getPathInPackage(), file.getArch(), file.getSourceHash());
//    console.log(file.getContentsAsString());
    var results = eslint.linter.verify(file.getContentsAsString(), {
      rules: {
        checks: 1
      }
    }, file.getPathInPackage());
    results.forEach(function(result) {
      file.error({
        message: result.message,
        line: result.line,
        column: result.column
      });
    });
  });
};

var checks = function(context) {

  var methods = {};
  var publications = {};

  function addMethod(node) {
    if (node.arguments.length && node.arguments[0].properties) {
      node.arguments[0].properties.map(function(methodNode) {
        methods[methodNode.key.name] = methodNode.value;
      });
    }
  }

  function addPublication(node) {
    if (node.arguments.length) {
      publications[node.arguments[0].value] = node.arguments[1];
    }
  }

  function getFunctionParams(func) {
    return (func.params || []).filter(function(param) {
        return param.type == 'Identifier';
      }).map(function(param) {
        return param.name;
      });
  }

  function checkChecks(type, map) {
    for (var name in map) {
      var node = map[name];
      var params = getFunctionParams(node);

      var body = node.body ? node.body.body : {};
      var checkMap = (body || []).reduce(function check(checkMap, node) {
        if (!node) {
          return checkMap;
        }
        switch (node.type) {
          case 'CallExpression':
            if (node.callee &&
                node.callee.name == 'check' &&
                node.arguments &&
                node.arguments.length) {
              checkMap[node.arguments[0].name] = true;
            }
            break;
          case 'ExpressionStatement':
            check(checkMap, node.expression);
            break;
          case 'BlockStatement':
            (node.body || []).reduce(check, checkMap);
            break;
          case 'IfStatement':
            check(checkMap, node.test)
            break;
          case 'SequenceExpression':
            (node.expressions || []).reduce(check, checkMap);
            break;
          case 'BinaryExpression':
            // Should we do this?
            // Short circuiting can produce false negatives
            // e.g.:
            //   true || check(foo, String)
            check(checkMap, node.left);
            check(checkMap, node.right);
            break;
          case 'VariableDeclaration':
            (node.declarations || []).reduce(check, checkMap);
            break;
          case 'VariableDeclarator':
            check(checkMap, node.init);
            break;
        }
        return checkMap;
      }, {});

      params.map(function(param) {
        if (!checkMap[param]) {
          context.report(node.parent, type + ' \'' + name + '\' has an unchecked argument: ' + param);
        }
      });
    }
  }

  return {
    'CallExpression': function(node) {
      if (node.callee && node.callee.object && node.callee.object.name == 'Meteor') {
        if (!node.callee || !node.callee.property || !node.callee.property.name) {
          return;
        }
        switch (node.callee.property.name) {
          case 'methods': addMethod(node); break;
          case 'publish': addPublication(node); break;
        }
      }
    },
    'Program:exit': function() {
      checkChecks('Publication', publications);
      checkChecks('Method', methods);
    }
  };
};
// // http://eslint.org/docs/developer-guide/nodejs-api.html
// // http://eslint.org/docs/developer-guide/working-with-rules.html
// 
// var eslint = Package['east5th:eslint'].eslint;
// var linter = eslint.linter;
// var CLIEngine = eslint.CLIEngine;
// 
// var cli = new CLIEngine({
//   envs: ['meteor'],
//   baseConfig: {},
//   rules: {
//     checks: 1
//   }
// });
// 
// var files = [process.env.PWD || process.cwd()];
// 
// Meteor.startup(function() {
//   var report = cli.executeOnFiles(files);
//   //var formatter = cli.getFormatter('tap');
//   //console.log(formatter(report.results));
//   report.results.map(function(result) {
//     if (result.messages.length) {
//       var filename = result.filePath.replace(process.env.PWD, '');
//       console.log(filename + ':');
//     }
//     result.messages.map(function(message) {
//       console.log('  ' + message.message);
//     });
//   });
// });
