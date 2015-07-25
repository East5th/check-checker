#space-lint

*A static analysis check checker for your Meteor apps!*

Using the static analysis features of [eslint](http://eslint.org/), this package will dig through all of your Meteor methods and publications looking for arguments that are not [checked](http://docs.meteor.com/#/full/check).

Unlike [audit-arguments-check](https://github.com/meteor/meteor/tree/devel/packages/audit-argument-checks), space-lint will present you with a report of unchecked method and publication arguments as soon as your application is started, rather than when the method or publication is called.

## Installation

~~`meteor add east5th:space-lint`~~

This package is still being developed. It'll be published soon!

## Usage

space-lint will crawl your entire Meteor application looking for JavaScript files to parse. Given an example input file, `example.js` in the root of your project:

```
if (Meteor.isServer) {
  Meteor.methods({
    foo: function(bar) {
      return MyCollection.find();
    }
  });

  Meteor.publish({
    test: function(rab, oof) {
      SensitiveDocuments.update(rab, oof);
    }
  });
}
```

space-lint would produce the following output in your server logs:
```
/example.js:
   Method 'foo' has an unchecked argument: bar
   Publication 'baz' has an unchecked argument: rab
   Publication 'baz' has an unchecked argument: oof
```
