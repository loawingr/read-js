describe("read-js-tests", function(){
    
    //custom timeout instead of 5 seconds
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    //turn on console logging
    readJS.debug.console = true;

    readJS.domNode = document.querySelector("#paragraph");

    //do something before each test
    beforeEach(function() {
    });

    it("get-text", function(){
        
        var el = document.getElementById("get-simple-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should be returned");

        el = document.getElementById("get-nested-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should be returned");

        el = document.getElementById("avoid-image-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should be returned");

        el = document.getElementById("text-input");
        
        expect(window.readJS.getText(el)).toBe("");

        expect(readJS.getText()).toBeFalsy();        
    });

    it("config", function(){
        expect(window.readJS.timeInterval).toBeGreaterThan(1); //for performance reasons
        expect(window.readJS.thresholds.readingPoint).toBeGreaterThan(window.readJS.activity.increment);
        expect(window.readJS.thresholds.domPolling).toBe(window.readJS.activity.increment);
        expect(1 < window.readJS.thresholds.viewport && window.readJS.thresholds.viewport <= 100).toBeTruthy();
        expect(1 < window.readJS.thresholds.domNode && window.readJS.thresholds.domNode <= 100).toBeTruthy();
    
        expect(readJS.initialize().toBeFalsy);
        expect(readJS.hasRead()).toBeFalsy();
        expect(readJS.activity.readingPoints).toBeLessThan(readJS.thresholds.readingPoint);
        expect(readJS.activity.timeInView).toBe(0);
    });

    it("should-update", function(){
        
        readJS.activity.timeInUnknownState = 0;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.activity.timeInUnknownState = 1.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 3;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.activity.timeInUnknownState = 4.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();
        
        readJS.activity.timeInUnknownState = 6;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.activity.timeInUnknownState = 7.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 9;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 10.5;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.activity.timeInUnknownState = 12;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 13.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 15;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 16.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 18;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.activity.timeInUnknownState = 19.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 21;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 22.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 24;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 25.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 27;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 28.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 30;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.activity.timeInUnknownState = 0;
        readJS.activity.pollingPoints = 0;
    });

    

    it("in-view", function(){
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        var iv = readJS.inView(readJS.domNode);
        expect(iv.dom_node_inview_percent).toBe(100);
        expect(readJS.activity.dnp).toBe(100);

        expect(iv.dom_node_viewport_percent).toBeGreaterThan(25);
        expect(readJS.activity.vpp).toBeGreaterThan(25);
        
    });

    it("add-double-points", function(){ //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.activity.readingPoints = 0;
        readJS.addPoints();
        expect(readJS.activity.dnp).toBeGreaterThan(readJS.thresholds.domNode);
        expect(readJS.activity.vpp).toBeGreaterThan(readJS.thresholds.viewport);
        expect(readJS.activity.readingPoints).toBe(readJS.activity.increment*2);
    });

    it("add-viewport-points", function(){ //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.activity.readingPoints = 0;
        readJS.activity.vpp = 26; // 1 more than threshold
        readJS.activity.dnp = 29; // 1 less than threshold
        readJS.addPoints();
        expect(readJS.activity.dnp).toBeLessThan(readJS.thresholds.domNode);
        expect(readJS.activity.vpp).toBeGreaterThan(readJS.thresholds.viewport);
        expect(readJS.activity.readingPoints).toBe(readJS.activity.increment);
    });

    it("add-viewport-points", function(){ //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.activity.readingPoints = 0;
        readJS.activity.vpp = 24; // 1 less than threshold
        readJS.activity.dnp = 31; // 1 more than threshold
        readJS.addPoints();
        expect(readJS.activity.dnp).toBeGreaterThan(readJS.thresholds.domNode);
        expect(readJS.activity.vpp).toBeLessThan(readJS.thresholds.viewport);
        expect(readJS.activity.readingPoints).toBe(readJS.activity.increment);
    });

    it("reactivate", function(){
        readJS.activity.pollingPoints = 0;
        readJS.reactivate();
        expect(readJS.activity.pollingPoints).toBe(readJS.thresholds.domPolling);
    });

    it("time-in-view-threshold", function(){
        readJS.setTimeInViewThreshold();
        expect(readJS.thresholds.timeInView).toBeLessThan(6); //less than 6 seconds to read a small paragraph
    });

    it("has-read", function(){ //this test relies on the time in view threshold test to be before it
        //fake the lock
        readJS.activity.read = true;
        expect(readJS.hasRead()).toBeTruthy();

        //setup not read conditions
        readJS.activity.read = false;
        console.log("readingPoints: "+ readJS.activity.readingPoints);
        console.log("timeInView: "+ readJS.activity.timeInView);
        expect(readJS.hasRead()).toBeFalsy();        

        //setup read conditions
        readJS.activity.readingPoints = 401; // 1 more than threshold
        readJS.activity.timeInView = readJS.thresholds.timeInView;

        readJS.callback = function(){
            console.log("The article has been read.");
        }

        spyOn(readJS, "removeListeners");
        spyOn(window, "clearInterval");
        expect(readJS.hasRead()).toBeTruthy();
        expect(readJS.removeListeners).toHaveBeenCalled();
        expect(window.clearInterval).toHaveBeenCalled();


    });

    it("check-activity", function(){

        readJS.activity.timeOnPage = 0;
        readJS.activity.timeInUnknownState = 0;
        readJS.activity.readingPoints = 0;

        spyOn(readJS, "detectForScroll");
        spyOn(readJS, "endConditionsChecked");
        
        readJS.checkActivity();

        expect(readJS.detectForScroll).toHaveBeenCalled();
        expect(readJS.endConditionsChecked).toHaveBeenCalled();

        expect(readJS.activity.timeOnPage).toBe(readJS.timeInterval);
        expect(readJS.activity.timeInUnknownState).toBe(readJS.timeInterval);
        expect(readJS.activity.readingPoints).toBe(readJS.timeInterval);
    });

    it("will-check-for-required-update", function(){
        spyOn(readJS, "isUpdateRequired");
        readJS.endConditionsChecked();
        expect(readJS.isUpdateRequired).toHaveBeenCalled();
    });

    it("does-not-check-end-conditions", function(){
        readJS.activity.timeInUnknownState = 1;
        readJS.activity.pollingPoints = 0;
        expect(readJS.endConditionsChecked()).toBeFalsy();
    });

    it("does-check-end-conditions", function(){
        readJS.activity.timeInUnknownState = 0;
        readJS.activity.pollingPoints = 0;

        expect(readJS.endConditionsChecked()).toBeTruthy();
    });

    it("does-ask-for-end-condition-help", function(){
        
        spyOn(readJS, "calculateCoordinates");
        spyOn(readJS, "addPoints");
        spyOn(readJS, "hasRead");

        readJS.endConditionsChecked();
        
        expect(readJS.calculateCoordinates).toHaveBeenCalled();
        expect(readJS.addPoints).toHaveBeenCalled();
        expect(readJS.hasRead).toHaveBeenCalled();
    });

    it("will-reactivate-on-delay-upon-scroll", function(){
        readJS.activity.scrolled = false;
        expect(readJS.detectForScroll()).toBeFalsy();

        readJS.activity.scrolled = true;
        expect(readJS.detectForScroll()).toBeTruthy();

        readJS.activity.scrolled = true;
        spyOn(readJS, "reactivate");
        readJS.detectForScroll();
        expect(readJS.reactivate).toHaveBeenCalled();
        expect(readJS.activity.scrolled).toBeFalsy();
    });

    it("will-handle-clicks", function(){
        readJS.activity.readingPoints = 0;
        spyOn(readJS, "reactivate");
        readJS.handleClick();
        expect(readJS.reactivate).toHaveBeenCalled();
        expect(readJS.activity.readingPoints).toBe(readJS.activity.increment);
    });

    it("will-handle-scrolls", function(){
        spyOn(readJS, "showScrollInfo");
        readJS.handleScroll();
        expect(readJS.activity.scrolled).toBeTruthy();
        expect(readJS.showScrollInfo).toHaveBeenCalled();
    });

    it("console", function(){
        readJS.debug.console = true;
        expect(readJS.console("hello Richard!")).toBeTruthy();
        expect(readJS.console("apple", "orange")).toBeTruthy();

        readJS.debug.console = false;
        expect(readJS.console("hello Richard!")).toBeFalsy();
    });

    it("initialize", function(){
        var el = readJSConfig.el;
        delete readJSConfig.el;
        expect(readJS.initialize(function(){ alert(1); })).toBeFalsy();

        readJSConfig.el = el;
        readJS.handleLoad();
        spyOn(window, "setInterval");
        expect(readJS.initialize(readJSConfig.cb)).toBeTruthy();
        expect(window.setInterval).toHaveBeenCalled();
    });

    it("calculates-coordinates", function(){
        var el = readJS.domNode;
        delete readJS.domNode; 
        expect(readJS.calculateCoordinates()).toBeFalsy();

        readJS.domNode = el;
        expect(readJS.calculateCoordinates()).toBeTruthy();
        
    });

    //do something after each test
    afterEach(function() {
    });
});