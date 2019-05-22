//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment } from "./setup.js";
setupTestEnvironment();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-update-model-tests", () => {

    //do something before each test
    beforeAll(() => {
        readJS.turnOn();
    });

    it("should-update", () => {

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

    it("will-check-for-required-update", () => {
        spyOn(readJS, "isUpdateRequired");
        readJS.endConditionsChecked();
        expect(readJS.isUpdateRequired).toHaveBeenCalled();
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});