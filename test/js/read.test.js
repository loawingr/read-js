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

        el = document.getElementById("get-nested-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should be returned");

        el = document.getElementById("avoid-image-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should  be returned");
    });

    it("config", function(){
        expect(window.readJS.timeInterval).toBeGreaterThan(1); //for performance reasons
        expect(window.readJS.thresholds.readingPoint).toBeGreaterThan(window.readJS.activity.increment);
        expect(window.readJS.thresholds.domPolling).toBe(window.readJS.activity.increment);
        expect(1 < window.readJS.thresholds.viewport && window.readJS.thresholds.viewport <= 100).toBeTruthy();
        expect(1 < window.readJS.thresholds.domNode && window.readJS.thresholds.domNode <= 100).toBeTruthy();
    });

    //do something after each test
    afterEach(function() {
    });
});