"use strict";

module.exports = function(context) {

  function getMethods(node) {
    var methods = {};
    node.arguments[0].properties.map(function(method) {
      methods[method.key.name] = method.value;
    });
    console.log(Object.keys(methods).join(', '));
  }

  return {
    'CallExpression': function(node) {
      if (node.callee.object.name == 'Meteor' &&
        node.callee.property.name == 'methods') {
        getMethods(node);
        //context.report(node, "methods!");
    }
  }
};
};

module.exports.schema = [
];