"use strict";

module.exports = function(context) {

  var methods = {};
  var publications = {};

  function addMethod(node) {
    if (node.arguments.length >= 1) {
      node.arguments[0].properties.map(function(methodNode) {
        methods[methodNode.key.name] = methodNode.value;
      });
    }
  }

  function addPublication(node) {
    if (node.arguments.length >= 1) {
      node.arguments[0].properties.map(function(publishNode) {
        publications[publishNode.key.name] = publishNode.value;
      });
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
        if (node.type == 'ExpressionStatement') {
          if (node.expression.type == 'CallExpression' &&
              node.expression.callee.name == 'check') {
            checkMap[node.expression.arguments[0].name] = true;
          return checkMap;
          }
        }
        else if (node.hasOwnProperty('body')) {
          if (!(node.body instanceof Array)) {
            nody.body = [node.body];
          }
          node.body.reduce(check, checkMap);
          return checkMap;
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