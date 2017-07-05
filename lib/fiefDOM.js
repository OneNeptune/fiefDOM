/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom_node_collection_js__ = __webpack_require__(1);


const callbackQueue = [];

const callQueueOnReady = () => {
  document.addEventListener('DOMContentLoaded', () => {
    callbackQueue.forEach(callback => callback());
  });
};

const collectionFromElement = (element) => (
  new __WEBPACK_IMPORTED_MODULE_0__dom_node_collection_js__["a" /* default */]([element])
);

const collectionFromArray = (array) => (
  new __WEBPACK_IMPORTED_MODULE_0__dom_node_collection_js__["a" /* default */](array)
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class fiefDOMCollection {
  constructor(HTMLelements) {
    this.HTMLelements = HTMLelements;
  }

  each(callback) {
    this.HTMLelements.forEach(callback);
  }

  on(eventType, callback) {
    this.each(el => {
      if (typeof el[eventType] === 'undefined') {
        el[eventType] = [];
      }
      el[eventType].push(callback);
      el.addEventListener(eventType, callback);
    });
  }

  off(eventType) {
    this.each(el => {
      if (el[eventType]) {
        el[eventType].forEach((callback) => {
          el.removeEventListener(eventType, callback);
        });
      }
    });
  }

  html(string) {
    if (string !== undefined) {
      this.each(el => { el.innerHTML = string; });
    } else {
      return this.HTMLelements[0].innerHTML;
    }
  }

  empty() {
    this.html("");
  }

  append(potpurri) {
    if (typeof potpurri === "string") {
      this.appendAttach(potpurri);
    } else if (potpurri instanceof HTMLElement) {
      this.appendAttach(potpurri.outerHTML);
    } else if (potpurri instanceof fiefDOMCollection) {
      potpurri.each(newEl => this.appendAttach(newEl.outerHTML));
    }
  }

  appendAttach(content) {
    this.each(el => el.insertAdjacentHTML('beforeend', content));
  }

  attr(attribute, value) {
    if (typeof value === 'string') {
      this.each(el => el.setAttribute(attribute, value));
    } else {
      return this.HTMLelements[0].innerHTML;
    }
  }

  addClass(newClass) {
    this.each((el) => {
      if (!el.classList.contains(newClass)) {
        el.classList.add(newClass);
      }
    });
  }

  removeClass(targetClass) {
    this.each((el) => el.classList.remove(targetClass));
  }

  children() {
    let childrenElements = [];

    this.each(el => {
      const elChildren = Array.from(el.children);
      childrenElements = childrenElements.concat(elChildren);
    });

    return new fiefDOMCollection(childrenElements);
  }

  parent() {
    let parentsArray = [];
    this.each(el => {
      let parentEl = el.parentElement;
      if (!parentsArray.includes(parentEl)) {
        parentsArray.push(el.parentElement);
      }
    });

    return new fiefDOMCollection(parentsArray);
  }

  find(selector) {
    let foundNodes = [];

    this.each(el => {
      let elFoundNodes = Array.from(el.querySelectorAll(selector));

      elFoundNodes.each((node) => {
        if (!foundNodes.includes(node)) {
          foundNodes.push(node);
        }
      });
    });

    return new fiefDOMCollection(foundNodes);
  }

  remove(selector) {
    let targetNodes = this.find(selector);

    targetNodes.each(el => {
      let targetParent = el.parentElement;
      targetParent.removeChild(el);
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = (fiefDOMCollection);


/***/ })
/******/ ]);
//# sourceMappingURL=fiefDOM.js.map