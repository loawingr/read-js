var readJSConfig = window.readingJSConfig || {};
if (!readJSConfig.el){ readJSConfig.el = ".story-body"; }
if (!readJSConfig.cb){ readJSConfig.cb = function(){
    "use strict";
    alert("The article has been read");
}; }