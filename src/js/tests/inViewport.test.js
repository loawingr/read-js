//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment, mockGetBoundingClientRect } from "./setup.js";
setupTestEnvironment();
mockGetBoundingClientRect();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-viewport-tests", () => {
    //do something before each test
    beforeAll(() => {
        readJS.turnOn();
    });

    it("in-view", () => {
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        var iv = readJS.inView(readJS.domNode);
        expect(iv.dom_node_inview_percent).toBe(100);
        expect(readJS.status.activity.dnp).toBe(100);

        expect(iv.dom_node_viewport_percent).toBeGreaterThan(25);
        expect(readJS.status.activity.vpp).toBeGreaterThan(25);

    });

    it("add-double-points", () => { //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.status.activity.readingPoints = 0;
        readJS.addPoints();
        expect(readJS.status.activity.dnp).toBeGreaterThan(readJS.status.thresholds.domNode);
        expect(readJS.status.activity.vpp).toBeGreaterThan(readJS.status.thresholds.viewport);
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.activity.increment * 2);
    });

    it("add-viewport-points", () => { //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.status.activity.readingPoints = 0;
        readJS.status.activity.vpp = 26; // 1 more than threshold
        readJS.status.activity.dnp = 29; // 1 less than threshold
        readJS.addPoints();
        expect(readJS.status.activity.dnp).toBeLessThan(readJS.status.thresholds.domNode);
        expect(readJS.status.activity.vpp).toBeGreaterThan(readJS.status.thresholds.viewport);
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.activity.increment);
    });

    it("add-viewport-points", () => { //this test always needs to be right after the "in-view" test
        expect(readJS.inViewport(readJS.domNode)).toBeTruthy();
        readJS.status.activity.readingPoints = 0;
        readJS.status.activity.vpp = 24; // 1 less than threshold
        readJS.status.activity.dnp = 31; // 1 more than threshold
        readJS.addPoints();
        expect(readJS.status.activity.dnp).toBeGreaterThan(readJS.status.thresholds.domNode);
        expect(readJS.status.activity.vpp).toBeLessThan(readJS.status.thresholds.viewport);
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.activity.increment);
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});

describe("read-js-time-in-view-tests", () => {
    //do something before each test
    beforeAll(() => {
        readJS.turnOn();
    });

    it("should return visible targets from the scannableTargets list", () => {
        expect(readJS.visibleScannableTargets(readJS.scannableTargets).length).toEqual(1);
        expect(readJS.visibleElementsMap.length).toEqual(1);
        readJS.scannableTargets.splice(readJS.visibleElementsMap[0], 1);
        expect(readJS.scannableTargets.length).toEqual(0);
    });

    it("should return false if scannableTargets is undefined or 0 length", () => {
        delete readJS.scannableTargets;
        expect(readJS.visibleScannableTargets(readJS.scannableTargets)).toEqual(false);
        readJS.scannableTargets = [];
        expect(readJS.visibleScannableTargets(readJS.scannableTargets)).toEqual(false);
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});