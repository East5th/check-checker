"use strict";

module.exports = function(context) {

  var collections = [];

  function trackCollection(node) {
    //console.log(node);

    if (node.parent.type == 'AssignmentExpression') {
      collections.push(node.parent.left.name);
    }

    // var methods = {};
    // node.arguments[0].properties.map(function(method) {
    //   methods[method.key.name] = method.value;
    // });
    // console.log(Object.keys(methods).join(', '));
  }

  function getArguments(node) {
    return node.arguments.filter(function(argument) {
      return argument.type == 'Identifier';
    }).map(function(argument) {
      return argument.name;
    });
  }

  function checkArguments(node) {
    var names = getArguments(node);
    console.log(names);
    while(node.parent) {
      node = node.parent;
      console.log(node.type);
    }
  }

  return {
    'NewExpression': function(node) {
      if (node.callee.object.name == 'Mongo' &&
          node.callee.property.name == 'Collection') {
        trackCollection(node);
      }
    },
    'CallExpression': function(node) {
      var methodOnCollection = collections.indexOf(node.callee.object.name) > -1;
      if (methodOnCollection &&
          node.callee.property.name == 'find') {
        checkArguments(node);
      }
    }
  }
};

module.exports.schema = [
];