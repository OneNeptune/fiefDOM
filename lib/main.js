import DOMNodeCollection from './dom_node_collection.js';

const callbackQueue = [];

const callQueueOnReady = () => {
  document.addEventListener('DOMContentLoaded', () => {
    callbackQueue.forEach(callback => callback());
  });
};

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

const $f = (arg) => {
  switch (typeof(arg)) {
    case 'function':
      callbackQueue.push(arg);
      return callQueueOnReady();
    case 'object':
      if (arg instanceof HTMLElement) {
        return collectionFromElement(arg);
      }
      break;
    case 'string':
      return collectionFromSelector(arg);
  }
};

$f.extend = (base, ...otherObjects) => {
  otherObjects.forEach(obj => {
    for(let attr in obj){
      base[attr] = obj[attr];
    }
  });
  return base;
};

$f.ajax = options => {
  return new Promise((resolve, reject) => {
    const resolvePresent = typeof(resolve) ==='function';
    const rejectPresent = typeof(reject) ==='function';
    const request = new XMLHttpRequest();
    const defaults = {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      method: 'GET',
      url: '',
      success: () => {},
      error: () => {},
      data: {}
    };

    options = $f.extend(defaults, options);

    options.method = options.method.toUpperCase();

    request.open(options.method, options.url, true);
    request.onload = (e) => {
      if (request.status >= 200 && request.status < 300) {
        if (resolvePresent) {
          resolve(request.response);
        } else {
          options.success(request.response);
        }
      } else {
        if (rejectPresent) {
          reject(request.response);
          reject({
            status: request.status,
            statusText: request.response
          });
        } else {
          options.error(request.response);
        }
      }
    };

    request.send(JSON.stringify(options.data));
  });
};

window.$f = $f;
