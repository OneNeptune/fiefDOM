# fiefDOM

fiefDOM is a lightweight and fast JavaScript library for HTML document traversal & manipulation, handling events, and dispatching asynchronous javascript and XML (AJAX) requests.

```
                  ███████╗██╗███████╗███████╗██████╗  ██████╗ ███╗   ███╗
                  ██╔════╝██║██╔════╝██╔════╝██╔══██╗██╔═══██╗████╗ ████║
                  █████╗  ██║█████╗  █████╗  ██║  ██║██║   ██║██╔████╔██║
                  ██╔══╝  ██║██╔══╝  ██╔══╝  ██║  ██║██║   ██║██║╚██╔╝██║
                  ██║     ██║███████╗██║     ██████╔╝╚██████╔╝██║ ╚═╝ ██║
                  ╚═╝     ╚═╝╚══════╝╚═╝     ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
```

## HTML document manipulation & traversal

### Traversal

#### Selecting elements and traversing selections

`$f(selectors)`
Conducts a depth-first search of the document's nodes to return a `fiefDOMCollection` of all elements matching the provided selector. Where *selectors* should be a string providing one or more [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).


`$f(HTMLElement)`
Will return a `fiefDOMCollection` containing the *HTMLElement* argument. This is useful when generating elements and using fiefDOM to place them on the page.

E.g.

``` JavaScript
const element = document.createElement('li');
const fiefElement = $f(element);
const fiefUL = $f('ul:first-of-type');
fiefUL.append(fiefElement);
```

`.find(selectors)`

A depth-first search of the elements contained within the `fiefDOMCollection` matching the provided selectors.

`.children()`

Returns a new `fiefDOMCollection` of the previously selected collection's child nodes.

`.parent()`

Returns a new `fiefDOMCollection` of the previously selected collection's parent nodes.

`.remove(selectors)`

Will remove the selectors matching the provided selector from the collection.

### Manipulation

`.html(string)`

String is an optional input, if no argument is provided `.html` will return the innerHTML of the first item in the collection. If a string is provided, it will iterate through each node in the selection and set the innerHTML to the provided string.

`.empty()`

Will clear the innerHTML for all nodes in the selection.


`.append(arg)`

Accepted argument types for `arg`: `string`, `HTMLElement`, `fiefDOMCollection`
Will append the argument to each node in the selection.

`.attr(attribute, value)`

Will add the supplied attribute and value to all nodes in the selection. Both values should be strings. If no argument is provided, will provide the innerHTML for the first node in the selection.

`.addClass(newClass)`

Will add the `newClass` (provided as a string) to all the nodes in the selection. If the node already has the `newClass`, no change will occur (node unique classes only).

`.removeClass(class)`

Will remove the `class` (provided as a string) to all the nodes in the selection. No change will occur if the node does not have the provided class.


## Event handling
`.on(eventType, callback)`

Will add an event listener to the selected nodes. Every time the `eventType` occurs the provided callback will be invoked. The `eventType` parameter should be a string representing the expected event type. A list of available events is [here](https://developer.mozilla.org/en-US/docs/Web/Events).

`.off(eventType)`

Will clear all event listeners with the associated eventType from selected nodes.

`$f(function)`

When provided with a function, will wait for document to load and then invoke the provided function.

E.g.
`$f(() => $('body').append('Loaded!'));` Will append the text 'Loaded!' to the body element when the document finishes loading.

## Asynchronous javascript and xml (AJAX) requests

`$f.ajax(options)`

Builds an `XMLHttpRequest` from the provided options and returns a `Promise` object.

The default parameters are:
```
{
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  method: 'GET',
  url: '',
  success: () => {},
    error: () => {},
      data: {}
}
```

Example usage:

``` JavaScript
const targetUrl = 'https://jsonplaceholder.typicode.com/posts';
$f.ajax({type: 'GET', url: targetUrl})
  .then((response) => console.log(response))
  .catch((error) => console.log(error.status, error.statusText))
```
