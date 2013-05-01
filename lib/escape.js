var entities = exports.entities = {
  "&":  "&amp;",
  "\"": "&quot;",
  "<":  "&lt;",
  ">":  "&gt;",
  "\t": "&#x9;",
  "\n": "&#xA;",
  "\r": "&#xD;",
};

var attributeEntities = exports.attributeEntities = function escapeAttributeEntities(string) {
  return string.replace(/([\&<"\t\n\r])/g, function(character) {
    return entities[character];
  });
};

var textEntities = exports.textEntities = function escapeTextEntities(string) {
  return string.replace(/([\&<>\r])/g, function(character) {
    return entities[character];
  });
};
