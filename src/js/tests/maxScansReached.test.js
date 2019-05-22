//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment } from "./setup.js";
setupTestEnvironment();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-max-scans-tests", () => {
    //do something before each test
    beforeAll(() => {
        readJS.turnOn();
    });

    it("should remove listeners after max calls have been reached", () => {
        //setup read conditions
        readJS.scannableTargets = [0,1,2,3];
        readJS.visibleElementsMap = [0,1,2,3];
        readJS.status.activity.readingPoints = 401; // 1 more than threshold
        readJS.status.activity.timeInView = readJS.status.thresholds.timeInView;
        readJS.status.ignoreScrollDepth = true;
        readJS.status.thresholds.maxCalls = 3;

        readJS.callback = () => {
            console.log("Scanned and popped element out of scannableTargets");
        }

        spyOn(readJS, "removeListeners");
        spyOn(readJS, "stopPolling");
        expect(readJS.status.thresholds.maxCalls).toBe(3);
        expect(readJS.status.activity.numberOfCalls).toBe(0);
        expect(readJS.hasRead()).toBeTruthy();
        expect(readJS.removeListeners).not.toHaveBeenCalled();
        expect(readJS.stopPolling).not.toHaveBeenCalled();
        expect(readJS.scannableTargets).toEqual([1,2,3]);
        expect(readJS.status.activity.numberOfCalls).toBe(1);
        expect(readJS.hasRead()).toBeTruthy();
        expect(readJS.removeListeners).not.toHaveBeenCalled();
        expect(readJS.stopPolling).not.toHaveBeenCalled();
        expect(readJS.scannableTargets).toEqual([2,3]);
        expect(readJS.status.activity.numberOfCalls).toBe(2);
        expect(readJS.hasRead()).toBeTruthy();
        expect(readJS.status.activity.numberOfCalls).toBe(3);
        expect(readJS.removeListeners).toHaveBeenCalled();
        expect(readJS.stopPolling).toHaveBeenCalled();
        expect(readJS.scannableTargets).toEqual([3]);
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});