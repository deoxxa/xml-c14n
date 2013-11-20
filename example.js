#!/usr/bin/env node

var xmldom = require("xmldom");

var c14n = require("./")();

var xmlData = require("fs").readFileSync("./example.xml", "utf8"),
    document = (new xmldom.DOMParser()).parseFromString(xmlData);

var algorithm = c14n.createAlgorithm("http://www.w3.org/2001/10/xml-exc-c14n#WithComments");

console.log("canonicalising with algorithm: " + algorithm.name());
console.log("");

console.log("INPUT");
console.log("");
console.log(xmlData);

console.log("");

console.log(document + "");

algorithm.canonicalise(document.documentElement, function(err, res) {
  if (err) {
    return console.warn(err.stack);
  }

  console.log("RESULT");
  console.log("");
  console.log(res);
});
