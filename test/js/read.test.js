describe("read-js-tests", function(){
    
    //custom timeout instead of 5 seconds
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    //turn on console logging
    readJS.status.debug.console = true;

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
        expect(window.readJS.status.timeInterval).toBeGreaterThan(1); //for performance reasons
        expect(window.readJS.status.thresholds.readingPoint).toBeGreaterThan(window.readJS.status.activity.increment);
        expect(window.readJS.status.thresholds.domPolling).toBe(window.readJS.status.activity.increment);
        expect(1 < window.readJS.status.thresholds.viewport && window.readJS.status.thresholds.viewport <= 100).toBeTruthy();
        expect(1 < window.readJS.status.thresholds.domNode && window.readJS.status.thresholds.domNode <= 100).toBeTruthy();
    
        expect(readJS.initialize().toBeFalsy);
        expect(readJS.hasRead()).toBeFalsy();
        expect(readJS.status.activity.readingPoints).toBeLessThan(readJS.status.thresholds.readingPoint);
        expect(readJS.status.activity.timeInView).toBe(0);
    });

    it("should-update", function(){
        
        readJS.status.activity.timeInUnknownState = 0;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.status.activity.timeInUnknownState = 1.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 3;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.status.activity.timeInUnknownState = 4.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();
        
        readJS.status.activity.timeInUnknownState = 6;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.status.activity.timeInUnknownState = 7.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 9;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 10.5;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.status.activity.timeInUnknownState = 12;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 13.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 15;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 16.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 18;
        expect(readJS.isUpdateRequired()).toBeTruthy();

        readJS.status.activity.timeInUnknownState = 19.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 21;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 22.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 24;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 25.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 27;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 28.5;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 30;
        expect(readJS.isUpdateRequired()).toBeFalsy();

        readJS.status.activity.timeInUnknownState = 0;
        readJS.status.activity.pollingPoints = 0;
    });

    

    it("in-view", function(){
        console.log(readJS.domNode);
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        var iv = readJS.inView(readJS.domNode);
        expect(iv.dom_node_inview_percent).toBe(100);
        expect(readJS.status.activity.dnp).toBe(100);

        expect(iv.dom_node_viewport_percent).toBeGreaterThan(25);
        expect(readJS.status.activity.vpp).toBeGreaterThan(25);
        
    });

    it("add-double-points", function(){ //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.status.activity.readingPoints = 0;
        readJS.addPoints();
        expect(readJS.status.activity.dnp).toBeGreaterThan(readJS.status.thresholds.domNode);
        expect(readJS.status.activity.vpp).toBeGreaterThan(readJS.status.thresholds.viewport);
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.activity.increment*2);
    });

    it("add-viewport-points", function(){ //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.status.activity.readingPoints = 0;
        readJS.status.activity.vpp = 26; // 1 more than threshold
        readJS.status.activity.dnp = 29; // 1 less than threshold
        readJS.addPoints();
        expect(readJS.status.activity.dnp).toBeLessThan(readJS.status.thresholds.domNode);
        expect(readJS.status.activity.vpp).toBeGreaterThan(readJS.status.thresholds.viewport);
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.activity.increment);
    });

    it("add-viewport-points", function(){ //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.status.activity.readingPoints = 0;
        readJS.status.activity.vpp = 24; // 1 less than threshold
        readJS.status.activity.dnp = 31; // 1 more than threshold
        readJS.addPoints();
        expect(readJS.status.activity.dnp).toBeGreaterThan(readJS.status.thresholds.domNode);
        expect(readJS.status.activity.vpp).toBeLessThan(readJS.status.thresholds.viewport);
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.activity.increment);
    });

    it("reactivate", function(){
        readJS.status.activity.pollingPoints = 0;
        readJS.reactivate();
        expect(readJS.status.activity.pollingPoints).toBe(readJS.status.thresholds.domPolling);
    });

    it("time-in-view-threshold", function(){
        var dn = readJS.domNode;
        readJS.setTimeInViewThreshold();
        expect(readJS.status.thresholds.timeInView).toBe(readJS.status.thresholds.minTimeInView); //less than 3 seconds to read enough of a small paragraph

        readJS.domNode = document.getElementById("anthem");
        readJS.domNode.style.display = "block";
        delete(readJS.status.thresholds.timeInView);
        readJS.setTimeInViewThreshold();
        expect(readJS.status.thresholds.timeInView).toBe(readJS.status.thresholds.minTimeInView); //read through a very short paragraph
        readJS.domNode.style.display = "none";

        readJS.domNode = document.getElementById("story-body");
        readJS.domNode.style.display = "block";
        delete(readJS.status.thresholds.timeInView);
        readJS.setTimeInViewThreshold();
        expect(readJS.status.thresholds.timeInView).toBe(readJS.status.thresholds.maxTimeInView); //less than 10 seconds to read enough of a lengthy article
        readJS.domNode.style.display = "none";

        readJS.status.thresholds.timeInView = 4;
        expect(readJS.setTimeInViewThreshold()).toBeFalsy();

        readJS.domNode = dn;
    });

    it("has-read", function(){ //this test relies on the time in view threshold test to be before it
        //fake the lock
        readJS.status.activity.read = true;
        expect(readJS.hasRead()).toBeTruthy();

        //setup not read conditions
        readJS.status.activity.read = false;
        console.log("readingPoints: "+ readJS.status.activity.readingPoints);
        console.log("timeInView: "+ readJS.status.activity.timeInView);
        expect(readJS.hasRead()).toBeFalsy();        

        //setup read conditions
        readJS.status.activity.readingPoints = 401; // 1 more than threshold
        readJS.status.activity.timeInView = readJS.status.thresholds.timeInView;

        readJS.callback = function(){
            console.log("The article has been read.");
        }

        spyOn(readJS, "removeListeners");
        spyOn(readJS, "stopPolling");
        expect(readJS.hasRead()).toBeTruthy();
        expect(readJS.removeListeners).toHaveBeenCalled();
        expect(readJS.stopPolling).toHaveBeenCalled();


    });

    it("check-activity", function(){

        readJS.status.activity.timeOnPage = 0;
        readJS.status.activity.timeInUnknownState = 0;
        readJS.status.activity.readingPoints = 0;

        spyOn(readJS, "detectForScroll");
        spyOn(readJS, "endConditionsChecked");
        
        readJS.checkActivity();

        expect(readJS.detectForScroll).toHaveBeenCalled();
        expect(readJS.endConditionsChecked).toHaveBeenCalled();

        expect(readJS.status.activity.timeOnPage).toBe(readJS.status.timeInterval);
        expect(readJS.status.activity.timeInUnknownState).toBe(readJS.status.timeInterval);
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.timeInterval);
    });

    it("will-check-for-required-update", function(){
        spyOn(readJS, "isUpdateRequired");
        readJS.endConditionsChecked();
        expect(readJS.isUpdateRequired).toHaveBeenCalled();
    });

    it("does-not-check-end-conditions", function(){
        readJS.status.activity.timeInUnknownState = 1;
        readJS.status.activity.pollingPoints = 0;
        expect(readJS.endConditionsChecked()).toBeFalsy();
    });

    it("does-check-end-conditions", function(){
        readJS.status.activity.timeInUnknownState = 0;
        readJS.status.activity.pollingPoints = 0;

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
        readJS.status.activity.scrolled = false;
        expect(readJS.detectForScroll()).toBeFalsy();

        readJS.status.activity.scrolled = true;
        expect(readJS.detectForScroll()).toBeTruthy();

        readJS.status.activity.scrolled = true;
        spyOn(readJS, "reactivate");
        readJS.detectForScroll();
        expect(readJS.reactivate).toHaveBeenCalled();
        expect(readJS.status.activity.scrolled).toBeFalsy();
    });

    it("will-handle-clicks", function(){
        readJS.status.activity.readingPoints = 0;
        spyOn(readJS, "reactivate");
        readJS.handleClick();
        expect(readJS.reactivate).toHaveBeenCalled();
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.activity.increment);
    });

    it("will-handle-scrolls", function(){
        spyOn(readJS, "showScrollInfo");
        readJS.handleScroll();
        expect(readJS.status.activity.scrolled).toBeTruthy();
        expect(readJS.showScrollInfo).toHaveBeenCalled();
    });

    it("console", function(){
        readJS.status.debug.console = true;
        expect(readJS.console("hello Richard!")).toBeTruthy();
        expect(readJS.console("apple", "orange")).toBeTruthy();

        readJS.status.debug.console = false;
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

    it("prevents-scroll-info", function(){
        readJS.status.debug.overlay = false;
        expect(readJS.showScrollInfo()).toBeFalsy();
    });

    it("returns default config", function(){
        var cfg = readJS.getConfig();
        expect(cfg.spa).toBeFalsy();
        expect(cfg.timeInterval).toBe(1.5);
        expect(cfg.activity.averageReadSpeed).toBe(5);
        expect(cfg.activity.increment).toBe(100);
        expect(cfg.debug.console).toBeFalsy();
        expect(cfg.debug.overlay).toBeFalsy();
        expect(cfg.thresholds.viewport).toBe(25);
        expect(cfg.thresholds.domNode).toBe(30);
        expect(cfg.thresholds.readingPoint).toBe(400);
        expect(cfg.thresholds.domPolling).toBe(100);
        expect(cfg.thresholds.minTimeInView).toBe(3);
        expect(cfg.thresholds.maxTimeInView).toBe(20);
    });

    it("should know check reading conditions/behaviours or indicators", function(){
        readJS.status.strict = true;
        readJS.status.activity.read = false;
        readJS.status.activity.scrollDepth = 30;
        readJS.status.thresholds.scrollDepth = 40;
        expect(readJS.hasRead()).toBeFalsy();

        readJS.status.activity.scrollDepth = 50;
        readJS.status.thresholds.scrollDepth = 40;
        readJS.status.activity.dnp = 10;
        readJS.status.thresholds.domNode = 20;
        expect(readJS.hasRead()).toBeFalsy();

        readJS.status.strict = false;
        readJS.status.activity.readingPoints = 500;
        readJS.status.thresholds.readingPoint = 300;
        readJS.status.activity.timeInView = 3;
        readJS.status.thresholds.timeInView = 5;
        expect(readJS.hasRead()).toBeFalsy();

    });

    //reset after all test cases
    afterAll(function() {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});