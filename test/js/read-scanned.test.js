describe("read-js and scanned-js tests together", function(){

	//turn on console logging
    readJS.status.debug.console = true;
    readJS.domNode = document.querySelector("#paragraph");

    scannedJS.status.debug.console = true;
    scannedJS.domNode = document.querySelector("#paragraph");

    it("has read for readJS but not scannedJS", function() { //this test relies on the time in view threshold test to be before it
        //fake the lock
        console.log("scannedJS",scannedJS.isOn());
        console.log("readJS",readJS.isOn());
        readJS.status.activity.read = true;
        expect(readJS.hasRead()).toBeTruthy();

        expect(scannedJS.hasRead()).toBeFalsy();

        //setup not read conditions
        readJS.status.activity.read = false;
        console.log("readingPoints: " + readJS.status.activity.readingPoints);
        console.log("timeInView: " + readJS.status.activity.timeInView);
        expect(readJS.hasRead()).toBeFalsy();
        expect(scannedJS.hasRead()).toBeFalsy();

        //setup read conditions
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
        expect(readJS.hasRead()).toBeTruthy();
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