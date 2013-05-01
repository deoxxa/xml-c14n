#!/usr/bin/env node

var xmldom = require("xmldom");

var c14n = require("./"),
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
