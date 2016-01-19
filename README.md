# read-js
Detects reading behaviour on a web page.

## Getting started
Run the following commands at the root directory of read-js
```sh
$ npm install
$ grunt
```

Open the test file in a web browser of your choosing
```sh
./build/test/reading.html
```

There are 2 pieces of information that need to be defined for:

  - The DOM node contains the article text
  - The callback function to invoke when the library has detected the user has read the article

```js
var readJSConfig = window.readingJSConfig || {};
if (!readJSConfig.el){ readJSConfig.el = ".story-body"; } //DOM node
if (!readJSConfig.cb){ readJSConfig.cb = function(){ //callback
    "use strict";
    alert("The article has been read");
}; }
```

The custom callback allows the developer to do whatever they want with the detection of the reading custom event. Maybe it sends data to Google Analytics or Adobe Analytics. This library is not tied to any backend services. Purely front end code.

## Version
1.0.0

## License

MIT