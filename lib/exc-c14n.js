var escape = require("./escape");

var canonicaliseXml = exports.canonicalise = function canonicaliseXml(node) {
  return processInner([], "", node.documentElement);
};

var algorithmName = exports.algorithmName = function algorithmName() {
  return "http://www.w3.org/2001/10/xml-exc-c14n#";
};

var compareAttributes = function compareAttributes(a, b) {
  if (!a.prefix && b.prefix) {
    return -1;
  }

  if (!b.prefix && a.prefix) {
    return 1;
  }

  return a.name.localeCompare(b.name);
};

var compareNamespaces = function compareNamespaces(a, b) {
  var attr1 = a.prefix + a.namespaceURI,
      attr2 = b.prefix + b.namespaceURI;

  if (attr1 === attr2) {
    return 0;
  }

  return attr1.localeCompare(attr2);
};

var renderAttributes = function renderAttributes(node) {
  return (node.attributes ? [].slice.call(node.attributes) : []).filter(function(e) {
    return e.name.indexOf("xmlns") !== 0;
  }).sort(compareAttributes).map(function(e) {
    return " " + e.name + "=\"" + escape.attributeEntities(e.value) + "\"";
  }).join("");
};

var renderNamespace = function renderNamespace(prefixesInScope, defaultNamespace, node) {
  var res = "",
      newDefaultNamespace = defaultNamespace,
      nsListToRender = [];

  var currentNamespace = node.namespaceURI || "";

  if (node.prefix) {
    if (prefixesInScope.indexOf(node.prefix) === -1) {
      nsListToRender.push({
        prefix: node.prefix,
        namespaceURI: node.namespaceURI,
      });

      prefixesInScope.push(node.prefix);
    }
  } else if (defaultNamespace !== currentNamespace) {
    newDefaultNamespace = node.namespaceURI;
    res += " xmlns=\"" + escape.attributeEntities(newDefaultNamespace) + "\"";
  }

  if (node.attributes) {
    for (var i=0;i<node.attributes.length;i++) {
      var attr = node.attributes[i];

      if (attr.prefix && prefixesInScope.indexOf(attr.prefix) === -1 && attr.prefix !== "xmlns") {
        nsListToRender.push({
          prefix: attr.prefix,
          namespaceURI: attr.namespaceURI,
        });

        prefixesInScope.push(attr.prefix);
      }
    }
  }

  nsListToRender.sort(compareNamespaces);

  for (var a in nsListToRender) {
    var p = nsListToRender[a];

    res += " xmlns:" + p.prefix + "=\"" + escape.attributeEntities(p.namespaceURI) + "\"";
  }

  return {
    rendered: res,
    newDefaultNamespace: newDefaultNamespace,
  };
};

var processInner = function processInner(prefixesInScope, defaultNamespace, node) {
  if (node.data) {
    return escape.textEntities(node.data);
  }

  prefixesInScope = prefixesInScope.slice();

  var ns = renderNamespace(prefixesInScope, defaultNamespace, node);

  return [
    "<" + node.tagName + ns.rendered + renderAttributes(node) + ">",
    [].slice.call(node.childNodes).map(function(e) { return processInner(prefixesInScope, ns.newDefaultNamespace, e); }).join(""),
    "</" + node.tagName + ">",
  ].join("");
};
