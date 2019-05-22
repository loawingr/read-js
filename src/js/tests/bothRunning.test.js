//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment, mockGetBoundingClientRect } from "./setup.js";
setupTestEnvironment();
mockGetBoundingClientRect();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js and scanned-js are running simultaneously together", function(){

	//turn on console logging
    readJS.status.debug.console = true;
    readJS.domNode = document.querySelector("#paragraph");

    scannedJS.status.debug.console = true;
    scannedJS.domNode = document.querySelector("#paragraph");

    it("has read for readJS but not scannedJS", function() { //this test relies on the time in view threshold test to be before it
        //setup not read conditions
        expect(readJS.hasRead()).toBeFalsy();
        expect(scannedJS.hasRead()).toBeFalsy();

        //setup read conditions
        readJS.scannableTargets = ["target"];
        readJS.visibleElementsMap = [0];
        readJS.status.activity.readingPoints = 401; // 1 more than threshold
        readJS.status.activity.timeInView = readJS.status.thresholds.timeInView;
        readJS.status.activity.scrollDepth = readJS.status.thresholds.scrollDepth

        readJS.callback = function() {
            console.log("The article has been read.");
        }

        spyOn(readJS, "removeListeners");
        spyOn(scannedJS, "removeListeners");
        spyOn(readJS, "stopPolling");
        spyOn(scannedJS, "stopPolling");
        expect(readJS.status.activity.numberOfCalls).toBe(0);
        expect(readJS.hasRead()).toBeTruthy();
        expect(scannedJS.hasRead()).toBeFalsy();
        expect(readJS.status.activity.numberOfCalls).toBe(1);
        expect(readJS.removeListeners).toHaveBeenCalled();
        expect(readJS.stopPolling).toHaveBeenCalled();
        expect(scannedJS.removeListeners).not.toHaveBeenCalled();
        expect(scannedJS.stopPolling).not.toHaveBeenCalled();
    });

    afterAll(function() {
    	scannedJS.turnOff();
        scannedJS.resetConfigStatus();
        readJS.turnOff();
        readJS.resetConfigStatus();
    });

});