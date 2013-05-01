#!/usr/bin/env node

var xmldom = require("xmldom");

var c14n = require("./"),
    algorithm = c14n.exc_c14n;

var xml = '<!-- this is a test --><x:a xmlns:y ="002"    xmlns:x="001" y:b="what\r\n&amp;" ><!-- lol what --><z:c xmlns:z   = "003"/> lol here is some "text" &amp; "data"</x:a><!-- trailing comment! -->',
    doc = (new xmldom.DOMParser()).parseFromString(xml);
    res = algorithm.canonicalise(doc, true);

console.log("canonicalising with algorithm: " + algorithm.algorithmName());
console.log("");

console.log("INPUT");
console.log("");
console.log(xml);

console.log("");

console.log("RESULT");
console.log("");
console.log(res);
