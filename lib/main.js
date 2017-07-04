import DOMNodeCollection from './dom_node_collection.js';

const collectionFromElement = (element) => (
  new DOMNodeCollection([element])
);

const collectionFromArray = (array) => (
  new DOMNodeCollection(array)
);

const collectionFromSelector = (selector) => {
  const selection = document.querySelectorAll(selector);
  const nodeList = Array.from(selection);
  return collectionFromArray(nodeList);
};


const $l = (arg) => {
  if (arg instanceof HTMLElement) {
    return collectionFromElement(arg);
  } else if (arg instanceof Array) {
    return collectionFromArray(arg);
  } else {
    return collectionFromSelector(arg);
  }
};

window.$l = $l;
