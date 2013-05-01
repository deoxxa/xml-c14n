#!/usr/bin/env node

var xmldom = require("xmldom");

var c14n = require("./"),
    algorithm = c14n.exc_c14n;

var withComments = true;

var xml = '<?xml version="1.0"?>\n\n<?xml-stylesheet   href="doc.xsl"\n   type="text/xsl"   ?>\n\n<!DOCTYPE doc SYSTEM "doc.dtd">\n\n<doc>Hello, world!<!-- Comment 1 --></doc>\n\n<?pi-without-data     ?>\n\n<!-- Comment 2 -->\n\n<!-- Comment 3 -->',
    doc = (new xmldom.DOMParser()).parseFromString(xml),
    res = algorithm.canonicalise(doc, withComments);

console.log("canonicalising with algorithm: " + algorithm.algorithmName(withComments));
console.log("");

console.log("INPUT");
console.log("");
console.log(xml);

console.log("");

console.log("RESULT");
console.log("");
console.log(res);
