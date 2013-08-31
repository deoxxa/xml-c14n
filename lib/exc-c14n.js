var escape = require("./escape");

var canonicaliseXml = exports.canonicalise = function canonicaliseXml(node, includeComments, inclusiveNamespaces) {
  return processInner([], "", !!includeComments, inclusiveNamespaces || [], node);
};

var algorithmName = exports.algorithmName = function algorithmName(includeComments) {
  return "http://www.w3.org/2001/10/xml-exc-c14n#" + (includeComments ? "WithComments" : "");
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

var renderNamespace = function renderNamespace(prefixesInScope, defaultNamespace, inclusiveNamespaces, node) {
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
    newDefaultNamespace = currentNamespace;
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
      } else if (inclusiveNamespaces && attr.prefix && attr.prefix === "xmlns" && inclusiveNamespaces.indexOf(attr.localName) !== -1) {
          nsListToRender.push({
              prefix: attr.localName,
              namespaceURI: attr.nodeValue
          });
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

var renderComment = function renderComment(node) {
  var isOutsideDocument = (node.ownerDocument === node.parentNode),
      isBeforeDocument = null,
      isAfterDocument = null;

  if (isOutsideDocument) {
    var nextNode = node,
        previousNode = node;

    while (nextNode !== null) {
      if (nextNode === node.ownerDocument.documentElement) {
        isBeforeDocument = true;
        break;
      }

      nextNode = nextNode.nextSibling;
    }

    while (previousNode !== null) {
      if (previousNode === node.ownerDocument.documentElement) {
        isAfterDocument = true;
        break;
      }

      previousNode = previousNode.previousSibling;
    }
  }

  return (isAfterDocument ? "\n" : "") + "<!--" + escape.textEntities(node.data) + "-->" + (isBeforeDocument ? "\n" : "");
};

var renderProcessingInstruction = function renderProcessingInstruction(node) {
  if (node.tagName === "xml") {
    return "";
  }

  var isOutsideDocument = (node.ownerDocument === node.parentNode),
      isBeforeDocument = null,
      isAfterDocument = null;

  if (isOutsideDocument) {
    var nextNode = node,
        previousNode = node;

    while (nextNode !== null) {
      if (nextNode === node.ownerDocument.documentElement) {
        isBeforeDocument = true;
        break;
      }

      nextNode = nextNode.nextSibling;
    }

    while (previousNode !== null) {
      if (previousNode === node.ownerDocument.documentElement) {
        isAfterDocument = true;
        break;
      }

      previousNode = previousNode.previousSibling;
    }
  }

  return (isAfterDocument ? "\n" : "") + "<?" + node.tagName + (node.data ? " " + escape.textEntities(node.data) : "") + "?>" + (isBeforeDocument ? "\n" : "");
};

var processInner = function processInner(prefixesInScope, defaultNamespace, includeComments, inclusiveNamespaces, node) {
  if (node.nodeType === 3) {
    return (node.ownerDocument === node.parentNode) ? escape.textEntities(node.data.trim()) : escape.textEntities(node.data);
  }

  if (node.nodeType === 7) {
    return renderProcessingInstruction(node);
  }

  if (node.nodeType === 8) {
    return includeComments ? renderComment(node) : "";
  }

  if (node.nodeType === 10) {
    return "";
  }

  prefixesInScope = prefixesInScope.slice();

  var ns = renderNamespace(prefixesInScope, defaultNamespace, inclusiveNamespaces, node);

  return [
    node.tagName ? "<" + node.tagName + ns.rendered + renderAttributes(node) + ">" : "",
    [].slice.call(node.childNodes).map(function(e) { return processInner(prefixesInScope, ns.newDefaultNamespace, includeComments, inclusiveNamespaces, e); }).join(""),
    node.tagName ? "</" + node.tagName + ">" : "",
  ].join("");
};
