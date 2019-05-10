describe("spa tests of readJS", function(){

    //custom timeout instead of 5 seconds
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    //do something before each test
    beforeAll(function() {
        delete(window.readJSConfig.el);
        delete(window.readJSConfig.cb);
    });

    it("should not be on already", function(){
        expect(readJS.isOn()).toBeFalsy();
    });

    it("should return false if the user agent contains \"Googlebot\"", function() {
        expect(readJS.checkGooglebot("Googlebot-Image/1.0")).toBeFalsy();
        expect(readJS.checkGooglebot("Googlebot-News")).toBeFalsy();
        expect(readJS.checkGooglebot("Googlebot-Video/1.0")).toBeFalsy();
        expect(readJS.checkGooglebot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBeFalsy();
        expect(readJS.checkGooglebot("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36")).toBeFalsy();
        expect(readJS.checkGooglebot("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBeFalsy();
        expect(readJS.checkGooglebot("Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBeFalsy();
        expect(readJS.checkGooglebot("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36")).toBeTruthy();
    });

    it("should not be turned on", function(){
        //can't turn on because missing el and cb
        expect(readJS.turnOn()).toBeFalsy();
        expect(readJS.isOn()).toBeFalsy();
    });

    it("should not be turned off yet", function(){
        //can't turn off because isn't on yet
        expect(readJS.turnOff()).toBeFalsy();
        expect(readJS.isOn()).toBeFalsy();
    });

    it("prevents execution without minimum configuration", function(){

        expect(readJS.isOn()).toBeFalsy();
        expect(readJS.setConfig()).toBeFalsy();
        expect(readJS.turnOn()).toBeFalsy();

        window.readJSConfig.el = "#paragraph";

        expect(readJS.setConfig()).toBeFalsy();
        expect(readJS.turnOn()).toBeFalsy();

        window.readJSConfig.cb = function(){
            console.log("user scanned paragraph");
        }

        window.readJSConfig.spa = true;

        //use bare minimum config
        expect(readJS.setConfig()).toBeTruthy();
        expect(readJS.turnOn()).toBeTruthy();
        expect(readJS.isOn()).toBeTruthy();
        expect(readJS.turnOn()).toBeFalsy();
    });

    it("prevents setting config while on", function(){
        expect(readJS.setConfig()).toBeFalsy();
    });

    it("turns off if already on", function(){
        expect(readJS.isOn()).toBeTruthy();
        expect(readJS.turnOff()).toBeTruthy();
        expect(readJS.isOn()).toBeFalsy();
    });

    it("allows overriding default configuration", function(){
        window.readJSConfig = {
            strict: false,
            spa: true,
            ignoreScrollDepth: true,
            timeInterval: 3,
            activity: {
                averageReadSpeed : 6,
                increment : 150
            },
            debug: {
                console : true,
                overlay : true
            },
            thresholds: {
                timeInView : 8,
                viewport : 30,
                domNode : 40,
                readingPoint : 500,
                domPolling : 90,
                minTimeInView : 1,
                maxTimeInView: 10,
                minVertical:20,
                maxCalls: 5
            },
            el : "#paragraph",
            cb : function(){ alert("Yay! They read it!"); }
        };

        //add overrides
        expect(readJS.setConfig()).toBeTruthy();

        var cfg = readJS.getConfig();

        //expect certain config values that have been overridden
        expect(cfg.strict).toBeFalsy();
        expect(cfg.spa).toBeTruthy();
        expect(cfg.ignoreScrollDepth).toBeTruthy();
        expect(cfg.timeInterval).toBe(3);
        expect(cfg.activity.averageReadSpeed).toBe(6);
        expect(cfg.activity.increment).toBe(150);
        expect(cfg.debug.console).toBeTruthy();
        expect(cfg.debug.overlay).toBeTruthy();
        expect(cfg.thresholds.timeInView).toBe(8);
        expect(cfg.thresholds.viewport).toBe(30);
        expect(cfg.thresholds.domNode).toBe(40);
        expect(cfg.thresholds.readingPoint).toBe(500);
        expect(cfg.thresholds.domPolling).toBe(90);
        expect(cfg.thresholds.minTimeInView).toBe(1);
        expect(cfg.thresholds.maxTimeInView).toBe(10);
        expect(cfg.thresholds.minVertical).toBe(20);
        expect(cfg.thresholds.maxCalls).toBe(5);
    });

    it("should now be ready to turn on", function(){
        readJS.domNode = document.getElementById("paragraph");
        expect(readJS.turnOn()).toBeTruthy();
    });

    it("should be able to remove debugging overlay dom nodes", function(){
        readJS.inView(readJS.domNode);
        expect(readJS.removeDomNode("viewport_inview")).toBeTruthy();
        expect(readJS.removeDomNode("overlap_inview")).toBeTruthy();
        expect(readJS.removeDomNode("dummy_overlay")).toBeFalsy();
        expect(document.getElementById("viewport_inview")).toBeNull();
        expect(document.getElementById("overlap_inview")).toBeNull();
    });

    it("should now be ready to turn off", function(){
        expect(readJS.turnOff()).toBeTruthy();
    });

    it("not turn on more than once if not a spa", function(){
        readJSConfig.spa = false;
        expect(readJS.turnOn()).toBeFalsy();
    });

    //reset after all test cases
    afterAll(function() {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});
