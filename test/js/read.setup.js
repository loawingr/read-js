window.readJSConfig = {
    el: "#paragraph",
    cb: function(){
        console.log("Article has been read.");
    }
};

//insert all html templates into the DOM
if (!window.htmlLoaded) {
	window.htmlLoaded = true;
	var prop;
	for (prop in window.__html__){
	    $("body").append(window.__html__[prop]);
	}
}