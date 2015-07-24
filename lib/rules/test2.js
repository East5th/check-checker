"use strict";

module.exports = function(context) {
  return {
    'Identifier': function(node) {
      if (node.name == 'snobgobber') {
        context.report(node, "This is the snobgobber!");
      }
    }
  };
};

module.exports.schema = [
];