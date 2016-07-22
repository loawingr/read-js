describe("read-js-tests", function(){
    
    //insert all html templates into the DOM
    var prop;
    for (prop in window.__html__){
        $("body").append(window.__html__[prop]);
    }

    //turn on console logging
    readJS.debug.console = false;

    //do something before each test
    beforeEach(function() {
    });

    it("get-text", function(){
        var el = document.getElementById("get-simple-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should be returned");
    });

    //do something after each test
    afterEach(function() {
    });
});