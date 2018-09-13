var readJSConfig = window.readJSConfig || {};

//insert all html templates into the DOM
if (!window.htmlLoaded) {
    window.htmlLoaded = true;
    var prop;
    for (prop in window.__html__) {
        $("body").append(window.__html__[prop]);
    }
}