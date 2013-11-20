xml-c14n
========

XML canonicalisation (xml-c14n)

Overview
--------

This module performs XML canonicalisation as specified in [xml-c14n](http://www.w3.org/TR/xml-exc-c14n/).

To operate, a preconstructed DOM object is required. Any object that implements
the [DOM Level 1](http://www.w3.org/TR/REC-DOM-Level-1/) API will suffice. I
recommend [xmldom](https://github.com/jindw/xmldom) if you're working with node,
or your browser's native DOM implementation if you're not.

This module was originally adapted from some code in [xml-crypto](https://github.com/yaronn/xml-crypto)
by Yaron Naveh, and as such is also covered by any additional conditions in the
license of that codebase (which just so happens to be the MIT license).

Apology
-------

Look, I know the API feels like Java. It pains me as much to work on it as it
will pain you to use it. This whole XML thing is a crock of shit, and is so
over-engineered that a factory (yeah, you heard me right) was the best way to
implement it. So yeah... Sorry.

No Apology
----------

I spell canonicalise with an "s". Deal with it.

Super Quickstart
----------------

Also see [example.js](https://github.com/deoxxa/xml-c14n/blob/master/example.js).

```javascript
#!/usr/bin/env node

var xmldom = require("xmldom");

var c14n = require("xml-c14n")();

var xmlData = require("fs").readFileSync(process.argv[2], "utf8"),
    document = (new xmldom.DOMParser()).parseFromString(xmlData);

var canonicaliser = c14n.createCanonicaliser("http://www.w3.org/2001/10/xml-exc-c14n#WithComments");

console.log("canonicalising with algorithm: " + canonicaliser.name());
console.log("");

console.log("INPUT");
console.log("");
console.log(xmlData);

console.log("");

canonicaliser.canonicalise(document.documentElement, function(err, res) {
  if (err) {
    return console.warn(err.stack);
  }

  console.log("RESULT");
  console.log("");
  console.log(res);
});
```

```
➜  xml-c14n git:(master) ./example.js small.xml
canonicalising with algorithm: http://www.w3.org/2001/10/xml-exc-c14n#WithComments

INPUT

<?xml version="1.0"?>

<?xml-stylesheet   href="doc.xsl"
   type="text/xsl"   ?>

<!DOCTYPE doc SYSTEM "doc.dtd">

<doc>Hello, world!<!-- Comment 1 --></doc>

<?pi-without-data     ?>

<!-- Comment 2 -->

<!-- Comment 3 -->


RESULT

<doc>Hello, world!<!-- Comment 1 --></doc>
```

Installation
------------

Available via [npm](http://npmjs.org/):

> $ npm install xml-c14n

Or via git:

> $ git clone git://github.com/deoxxa/xml-c14n.git node_modules/xml-c14n

API
---

**CanonicalisationFactory**

This is what you get when you `require("xml-c14n")`. It's a factory for getting
canonicaliser implementation instances.

```javascript
CanonicalisationFactory(options)
```

```javascript
var c14n = new CanonicalisationFactory();
// OR
var c14n = CanonicalisationFactory();
// THUS
var c14n = require("xml-c14n")();
```

**CanonicalisationFactory.registerAlgorithm**

This is how you get a specific canonicalisation algorithm implementation into a
factory so that it can be instantiated within and returned to callers. You give
it a URI and a factory function (sup dog) and it'll shove it into an object
internally so it can be retrieved later on.

```javascript
c14n.registerAlgorithm(uri, factoryFunction)
```

```javascript
c14n.registerAlgorithm("http://herp.derp/", function(options) {
  return new HerpDerp(options);
});
```

Arguments

* _uri_ - a URI to identify the algorithm
* _factoryFunction_ - a function that creates instances of the algorithm's
  implementation

**CanonicalisationFactory.getAlgorithm**

This lets you get the factory function for an algorithm. Not incredibly useful,
but here for completeness.

```javascript
c14n.getAlgorithm(uri)
```

```javascript
var herpDerpFactory = c14n.getAlgorithm("http://herp.derp/");
```

Arguments

* _uri_ - the URI identifying the algorithm to fetch the factory function for

**CanonicalisationFactory.createCanonicaliser**

Creates an instance of a canonicaliser, referenced by its URI, and optionally
passing along something for the new instance.

```javascript
c14n.createCanonicaliser(uri, [options]);
```

```javascript
// creates an xml-exc-c14n canonicaliser
var canonicaliser = c14n.createCanonicaliser("http://www.w3.org/2001/10/xml-exc-c14n#");
```

**Algorithm**

This is the abstract "class" that all specific algorithms (should) extend. It
provides some stubbed out methods that do nothing useful aside from serving as
documentation. These methods should be overridden by specific implementations.
What you get back from `CanonicalisationFactory.createCanonicaliser` will be
an extension of this class.

**Algorithm.name**

This gives you the name (URI) that the algorithm *instance* goes by.

```javascript
algorithm.name();
```

```javascript
var uri = algorithm.name();
```

**Algorithm.canonicalise**

This is what does the meat of the work in most implementations.

```javascript
algorithm.canonicalise(node, cb);
```

```javascript
algorithm.canonicalise(node, function(err, data) {
  if (err) {
    return console.warn(err);
  }

  console.log(data);
});
```

Included Canonicalisation Algorithms
------------------------------------

There are two included algorithms, one of which is a specialisation of the
other.

**http://www.w3.org/2001/10/xml-exc-c14n#**

* _uri_ - `http://www.w3.org/2001/10/xml-exc-c14n#`
* _options_
  * _includeComments_
  * _inclusiveNamespaces_

For a description of this algorithm and its options, see the [xml-exc-c14n specification](http://www.w3.org/TR/xml-exc-c14n/).

**http://www.w3.org/2001/10/xml-exc-c14n#WithComments**

* _uri_ - `http://www.w3.org/2001/10/xml-exc-c14n#WithComments`
* _options_
  * _inclusiveNamespaces_

This is just a special version of `http://www.w3.org/2001/10/xml-exc-c14n#`
with `includeComments` enabled.

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
