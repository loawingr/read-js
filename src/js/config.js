var readJSConfig = window.readJSConfig || {};
if (!readJSConfig.el){ readJSConfig.el = ".story-body"; }
if (!readJSConfig.cb){ readJSConfig.cb = function(){
    "use strict";
    alert("The article has been read");
}; }
if (!readJSConfig.debug){
	readJSConfig.debug = {};
	if (typeof(readJSConfig.debug.overlay)==="undefined"){
		readJSConfig.debug.overlay = true;
	}
	if (typeof(readJSConfig.debug.console)==="undefined"){
		readJSConfig.debug.console = true;
	}
}