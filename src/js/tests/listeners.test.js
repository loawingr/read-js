//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment } from "./setup.js";
setupTestEnvironment();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-listeners-tests", () => { 

    //do something before each test
    beforeEach(() => {
        readJS.turnOn();
    });

    it("will-handle-clicks", () => {
        readJS.status.activity.readingPoints = 0;
        spyOn(readJS, "reactivate");
        readJS.handleClick();
        expect(readJS.reactivate).toHaveBeenCalled();
        expect(readJS.status.activity.readingPoints).toBe(readJS.status.activity.increment);
    });

    it("will-handle-scrolls", () => {
        readJS.handleScroll();
        expect(readJS.status.activity.scrolled).toBeTruthy();
    });

    it("check-activity", () => {

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

    it("will-reactivate-on-delay-upon-scroll", () => {
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

    it("reactivate", () => {
        readJS.status.activity.pollingPoints = 0;
        readJS.reactivate();
        expect(readJS.status.activity.pollingPoints).toBe(readJS.status.thresholds.domPolling);
    });

    //reset after all test cases
    afterEach(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });

});