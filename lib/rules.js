Rules = {
  test: function(context) {
    return {
      'Identifier': function(node) {
        if (node.name == 'flabbergarben') {
          //console.log('got linter', node);
          context.report(node, "This is the flabbergarben!");
        }
      }
    };
  }
};