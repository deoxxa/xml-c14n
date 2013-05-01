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

This module was primarily adapted from some code in [xml-crypto](https://github.com/yaronn/xml-crypto)
by Yaron Naveh, and as such is also covered by any additional conditions in the
license of that codebase (which just so happens to be the MIT license).

Super Quickstart
----------------

Also see [example.js](https://github.com/deoxxa/xml-c14n/blob/master/example.js).

```javascript
#!/usr/bin/env node

var c14n = require("xml-c14n"),
    xmldom = require("xmldom");

var c14n = require("xml-c14n"),
    algorithm = c14n.exc_c14n;

var xml = '<x:a xmlns:y ="002"    xmlns:x="001" y:b="what\r\n&amp;" ><z:c xmlns:z   = "003"/> lol here is some "text" &amp; "data"</x:a>',
    doc = (new xmldom.DOMParser()).parseFromString(xml);
    res = algorithm.canonicalise(doc);

console.log("canonicalising with algorithm: " + algorithm.algorithmName());
console.log("");

console.log("INPUT");
console.log("");
console.log(xml);

console.log("");

console.log("RESULT");
console.log("");
console.log(res);
```

```
canonicalising with algorithm: http://www.w3.org/2001/10/xml-exc-c14n#

INPUT

<x:a xmlns:y ="002"    xmlns:x="001" y:b="what
&amp;" ><z:c xmlns:z   = "003"/> lol here is some "text" &amp; "data"</x:a>

RESULT

<x:a xmlns:x="001" xmlns:y="002" y:b="what&#xD;&#xA;&amp;"><z:c xmlns:z="003"></z:c> lol here is some "text" &amp; "data"</x:a>
```

Installation
------------

Available via [npm](http://npmjs.org/):

> $ npm install xml-c14n

Or via git:

> $ git clone git://github.com/deoxxa/xml-c14n.git node_modules/xml-c14n

API
---

**exc_c14n.canonicalise**

Creates a canonical serialised representation of a DOM object according to the
rules laid out in [xml-exc-c14n](http://www.w3.org/TR/xml-exc-c14n/).

```javascript
c14n.exc_c14n.canonicalise(doc);
```

```javascript
// outputs a string of XML
console.log(c14n.exc_c14n.canonicalise(doc));
```

Arguments

* _doc_ - a DOM object implementing [DOM Level 1](http://www.w3.org/TR/REC-DOM-Level-1/)

**exc_c14n.algorithmName**

Returns the name of the canonicalisation algorithm. This will be more useful if
there is ever more than one algorithm implemented.

```javascript
c14n.exc_c14n.algorithmName()
```

```javascript
// outputs "http://www.w3.org/2001/10/xml-exc-c14n#"
console.log(c14n.exc_c14n.algorithmName());
```

**escape.attributeEntities**

Escapes special entities in an attribute's value according to [xml-c14n#2.3](http://www.w3.org/TR/xml-c14n#ProcessingModel).

```javascript
c14n.escape.attributeEntities(string);
```

```javascript
// outputs "&amp;&lt;&quot;&#x9;&#xD;&#xA;"
console.log(c14n.escape.attributeEntities("&<\"\t\r\n"));
```

Arguments

* _string_ - a string with unescaped entities in it

**escape.textEntities**

Escapes special entities in a text node's data according to [xml-c14n#2.3](http://www.w3.org/TR/xml-c14n#ProcessingModel).

```javascript
c14n.escape.textEntities(string);
```

```javascript
// outputs "&amp;&lt;&gt;&#xD;"
console.log(c14n.escape.textEntities("&<>\r"));
```

Arguments

* _string_ - a string with unescaped entities in it

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* ADN ([@deoxxa](https://alpha.app.net/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
