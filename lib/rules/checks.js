"use strict";

module.exports = function(context) {

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
    return func.params.filter(function(param) {
        return param.type == 'Identifier';
      }).map(function(param) {
        return param.name;
      });
  }

  function checkChecks(type, map) {
    for (var name in map) {
      var node = map[name];
      var params = getFunctionParams(node);

      var checkMap = node.body.body.reduce(function check(checkMap, node) {
        switch (node.type) {
          case 'CallExpression':
            if (node.callee &&
                node.callee.name == 'check' &&
                node.arguments &&
                node.arguments[0]) {
              checkMap[node.arguments[0].name] = true;
            }
            break;
          case 'ExpressionStatement':
            check(checkMap, node.expression);
            break;
          case 'BlockStatement':
            node.body.reduce(check, checkMap);
            break;
          case 'IfStatement':
            check(checkMap, node.test)
            break;
          case 'SequenceExpression':
            node.expressions.reduce(check, checkMap);
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
            node.declarations.reduce(check, checkMap);
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

module.exports.schema = [
];