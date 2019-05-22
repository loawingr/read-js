//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment } from "./setup.js";
setupTestEnvironment();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-time-based-tests", () => {
    //do something before each test
    beforeAll(() => {
        readJS.turnOn();
    });

    it("should return an array of set interval timers", () => {
        expect(readJS.getIntervals().length).toBeGreaterThan(0);
    });

    it("should set the initial time", () => {
        readJS.status.activity.initialTime = 0;
        readJS.setInitialTime();
        expect(readJS.status.activity.initialTime).not.toEqual(0);
    });

    it("should calculate the total time", () => {
        var time = 10;
        spyOn(readJS, "calculateTotalTime").and.returnValue(time);
        readJS.status.activity.totalTime = 0;
        expect(readJS.calculateTotalTime()).toEqual(time);
    });

    it("should calculate totalTime since initial time is set", () => {
        readJS.setInitialTime();
        readJS.calculateTotalTime();
        expect(readJS.status.activity.totalTime).toBeDefined();
    });

    it("should return false if no total time or initial time is set", () => {
        readJS.status.activity.totalTime = 0;
        readJS.status.activity.initialTime = 0;
        readJS.calculateTotalTime();
        expect(readJS.status.activity.totalTime).toBeFalsy();
    });

    it("should return totalTime if totalTime is greater than 0", () => {
        readJS.status.activity.totalTime = 30;
        readJS.calculateTotalTime();
        expect(readJS.status.activity.totalTime).toBe(30);
    });

    //https://codewithhugo.com/mocking-the-current-date-in-jest-tests/
    it("should return the current time from initialTime", () => {
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 1530518207007);
        global.Date.now = dateNowStub;
        const baseTime = new Date();

        readJS.setInitialTime();
        expect(readJS.status.activity.initialTime).toBe(baseTime.getTime());
        
        global.Date.now = realDateNow;
    });

    it("should set totalTime in activity object", () => {
        readJS.resetConfigStatus();
        expect(readJS.status.activity.totalTime).toBe(0);
        readJS.status.activity.totalTime = 30;
        readJS.calculateTotalTime();
        expect(readJS.status.activity.totalTime).toBe(30);
    });

    //https://codewithhugo.com/mocking-the-current-date-in-jest-tests/
    it("should reset initialTime to 0", () => {
        
        const baseTime = new Date();
        
        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 1530518207007);
        global.Date.now = dateNowStub;

        readJS.setInitialTime();
        expect(readJS.status.activity.initialTime).toBe(baseTime.getTime());
        readJS.resetConfigStatus();
        expect(readJS.status.activity.initialTime).toBe(0);

        global.Date.now = realDateNow;
    });

    it("should call calculateTotalTime in callback", () => {
        spyOn(readJS, "calculateTotalTime").and.returnValue(timeElapsed);
        //setup read conditions
        readJS.status.activity.readingPoints = 401; // 1 more than threshold
        readJS.status.activity.timeInView = readJS.status.thresholds.timeInView;
        readJS.status.activity.scrollDepth = readJS.status.thresholds.scrollDepth;
        const timeElapsed = 45;
        readJS.callback = function(time) {
            expect(time).toBe(timeElapsed);
        };
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
        //setup default configuration assumptions
        readJS.status.thresholds.percentagePoint = 25;
        readJS.status.activity.averageReadSpeed = 300/60; //300 words/minute
        readJS.status.thresholds.minTimeInView = 3;
        readJS.status.thresholds.maxTimeInView = 20;
        delete(readJS.status.thresholds.timeInView);

        readJS.turnOn();
    });

    it("time-in-view-threshold", () => {
        var dn = readJS.domNode;

        //word count the paragraph and predict how long it should take the reader to read enough of the paragraph
        //the paragraph has 91 words in it
        readJS.setTimeInViewThreshold();
        expect(readJS.status.thresholds.timeInView).toBe(5); //around 5 seconds to read enough of a small paragraph

        document.body.innerHTML = `<div id="anthem">O Canada! Our home and native land! <br/> True patriot love in all thy sons command. <br/> With glowing hearts we see thee rise, <br/> The True North strong and free! From far and wide, <br/>O Canada, we stand on guard for thee. <br/> God keep our land glorious and free! <br/> O Canada, we stand on guard for thee. <br/> O Canada, we stand on guard for thee.</div>`;
        readJS.domNode = document.getElementById("anthem");
        delete(readJS.status.thresholds.timeInView);
        readJS.setTimeInViewThreshold();
        expect(readJS.status.thresholds.timeInView).toBe(readJS.status.thresholds.minTimeInView); //read through a very short paragraph

        document.body.innerHTML = `<div id="breaking-news">All 6 big banks report large net losses due to too little loan loss provisioning!</div>`;
        readJS.domNode = document.getElementById("breaking-news");
        delete(readJS.status.thresholds.timeInView);
        readJS.setTimeInViewThreshold();
        expect(readJS.status.thresholds.timeInView).toBe(readJS.status.thresholds.minTimeInView);

        document.body.innerHTML = `<div id="story-body">
        <p>To Sherlock Holmes she is always THE woman. I have seldom
        heard him mention her under any other name. In his eyes she
        eclipses and predominates the whole of her sex. It was not that
        he felt any emotion akin to love for Irene Adler. All emotions,
        and that one particularly, were abhorrent to his cold, precise
        but admirably balanced mind. He was, I take it, the most perfect
        reasoning and observing machine that the world has seen,
        but as a lover he would have placed himself in a false position.
        He never spoke of the softer passions, save with a gibe and a
        sneer. They were admirable things for the observer—excellent
        for drawing the veil from mens motives and actions. But for
        the trained reasoner to admit such intrusions into his own delicate
        and finely adjusted temperament was to introduce a distracting
        factor which might throw a doubt upon all his mental
        results. Grit in a sensitive instrument, or a crack in one of his
        own high-power lenses, would not be more disturbing than a
        strong emotion in a nature such as his. And yet there was but
        one woman to him, and that woman was the late Irene Adler, of
        dubious and questionable memory.</p>
        <p>I had seen little of Holmes lately. My marriage had drifted us
        away from each other. My own complete happiness, and the
        home-centred interests which rise up around the man who first
        finds himself master of his own establishment, were sufficient
        to absorb all my attention, while Holmes, who loathed every
        form of society with his whole Bohemian soul, remained in our
        lodgings in Baker Street, buried among his old books, and alternating
        from week to week between cocaine and ambition,
        the drowsiness of the drug, and the fierce energy of his own
        keen nature. He was still, as ever, deeply attracted by the
        study of crime, and occupied his immense faculties and extraordinary
        powers of observation in following out those clues,
        and clearing up those mysteries which had been abandoned as 
        hopeless by the official police. From time to time I heard some
        vague account of his doings: of his summons to Odessa in the
        case of the Trepoff murder, of his clearing up of the singular
        tragedy of the Atkinson brothers at Trincomalee, and finally of
        the mission which he had accomplished so delicately and successfully
        for the reigning family of Holland. Beyond these signs
        of his activity, however, which I merely shared with all the
        readers of the daily press, I knew little of my former friend and
        companion.</p></div>`;

        readJS.domNode = document.getElementById("story-body");
        delete(readJS.status.thresholds.timeInView);
        readJS.setTimeInViewThreshold();
        expect(readJS.status.thresholds.timeInView).toBe(readJS.status.thresholds.maxTimeInView); //less than 10 seconds to read enough of a lengthy article

        readJS.status.thresholds.timeInView = 4;
        expect(readJS.setTimeInViewThreshold()).toBeFalsy();

        readJS.domNode = dn;
    });

    it("has-read", () => { //this test relies on the time in view threshold test to be before it
        //setup not read conditions
        expect(readJS.hasRead()).toBeFalsy();

        //setup read conditions
        readJS.scannableTargets = ["target"];
        readJS.visibleElementsMap = [0];
        readJS.status.activity.readingPoints = 401; // 1 more than threshold
        readJS.status.activity.timeInView = readJS.status.thresholds.timeInView;
        readJS.status.activity.scrollDepth = readJS.status.thresholds.scrollDepth

        readJS.callback = () => {
            console.log("The article has been read.");
        }

        spyOn(readJS, "removeListeners");
        spyOn(readJS, "stopPolling");
        expect(readJS.status.activity.numberOfCalls).toBe(0);
        expect(readJS.hasRead()).toBeTruthy();
        expect(readJS.status.activity.numberOfCalls).toBe(1);
        expect(readJS.removeListeners).toHaveBeenCalled();
        expect(readJS.stopPolling).toHaveBeenCalled();
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});