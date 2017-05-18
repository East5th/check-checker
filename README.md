# check-checker

*A static analysis check checker for your Meteor applications!*

Using the static analysis features of [eslint](http://eslint.org/), this package will dig through all of your Meteor methods and publications looking for arguments that are not [checked](http://docs.meteor.com/#/full/check).

Unlike [audit-arguments-check](https://github.com/meteor/meteor/tree/devel/packages/audit-argument-checks), check-checker will present you with a report of unchecked method and publication arguments as soon as your application is started, rather than at runtime when the method or publication is called.

## Installation

`meteor add east5th:check-checker`

## Usage

check-checker will crawl your entire Meteor application looking for JavaScript files to parse. Given an example input file, `example.js` in the root of your project:

```
if (Meteor.isServer) {
  Meteor.methods({
    foo: function(bar) {
      return MyCollection.find();
    }
  });

  Meteor.publish("test", function(rab, oof) {
    SensitiveDocuments.update(rab, oof);
  });
}
```

check-checker would produce the following output in your server logs:
```
example.js:3:4: Method 'foo' has an unchecked argument: bar
example.js:8:2: Publication 'test' has an unchecked argument: rab
example.js:8:2: Publication 'test' has an unchecked argument: oof
```

check-checker is implemented as a Meteor linter, so it can also be run using the `meteor list` command.

## Use with audit-argument-checks

It can be useful to use `check-checker` alongside `audit-argument-checks`. For example, if you have a publication that accepts no arguments, like:
```
Meteor.publish('fooPub', function(){
  return Foo.find();
});
```
`audit-argument-checks` will detect and alert you if you pass any *extra* arguments into this publication:
```
Meteor.subscribe('fooPub', 'foo');
```
```
Exception from sub fooPub id xxxxxxxxx Error: Did not check() all arguments during publisher 'fooPub'
```



## TODO
- [X] Improve project directory detection (replace `process.env.PWD`)
- [X] Add ES6 support
