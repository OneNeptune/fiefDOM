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

export default fiefDOMCollection;
