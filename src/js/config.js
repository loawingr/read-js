var readJSConfig = window.readJSConfig || {};
if (!readJSConfig.el){ readJSConfig.el = ".story-body"; }
if (!readJSConfig.cb){ readJSConfig.cb = function(){
    "use strict";
    alert("The article has been read");
}; }
readJSConfig.debug = {
	overlay: true,
	console: true
};