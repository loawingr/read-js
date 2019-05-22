//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment, mockGetBoundingClientRect } from "./setup.js";
setupTestEnvironment();
mockGetBoundingClientRect();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-end-conditions-tests", () => {
    
    //do something before each test
    beforeAll(() => {
        readJS.turnOn(); 
    });

    it("should know check reading conditions/behaviours or indicators", () => {
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

    it("does-not-check-end-conditions", () => {
        //setup environment where isUpdateRequired() == false
        readJS.status.activity.timeInUnknownState = 1;
        readJS.status.activity.pollingPoints = 0;

        expect(readJS.endConditionsChecked()).toBeFalsy();
    });

    it("does-check-end-conditions", () => {

        //setup environment where isUpdateRequired() == true
        readJS.status.activity.timeInUnknownState = 0;
        readJS.status.activity.pollingPoints = 0;
        
        expect(readJS.endConditionsChecked()).toBeTruthy();

    });

    it("does-ask-for-end-condition-help", () => {

        //setup environment where isUpdateRequired() == true
        readJS.status.activity.timeInUnknownState = 0;
        readJS.status.activity.pollingPoints = 0;

        //setup spies
        spyOn(readJS, "addPoints");
        spyOn(readJS, "hasRead");

        //run test
        readJS.endConditionsChecked();

        //assert
        expect(readJS.hasRead).toHaveBeenCalled();
        expect(readJS.addPoints).toHaveBeenCalled();
        
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});