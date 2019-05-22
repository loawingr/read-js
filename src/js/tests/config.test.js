//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment } from "./setup.js";
setupTestEnvironment();

//pull in the readJS library
import defaultExport from "../read.js";
describe("read-js-config-tests", () => {
    
    //do something before each test
    beforeEach(() => {
        readJS.turnOff(); //making sure that readJS is off before initializing readJS in the tests
    });

    it("returns default config", () => {
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

    it(" should have expected config settings before turning on and starting", () => {
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

    it("allows overriding default configuration", () => {
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
                maxCalls: 5,
                percentagePoint:30 //30% vertical scroll threshold
            },
            el : "#paragraph",
            cb : () => { alert("Yay! They read it!"); }
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

    it("tests if window.readJSConfig exists", ()=>{
        delete(window.readJSConfig);
        expect(readJS.setConfig()).toBeFalsy();
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
    
});