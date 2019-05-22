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

    
});

//describe("read-js-time-in-view-tests", () => {
//    //do something before each test
//    beforeAll(() => {
//        readJS.turnOn();
//    });
//
//    it("should return visible targets from the scannableTargets list", () => {
//        expect(readJS.visibleScannableTargets(readJS.scannableTargets).length).toEqual(1);
//        expect(readJS.visibleElementsMap.length).toEqual(1);
//        readJS.scannableTargets.splice(readJS.visibleElementsMap[0], 1);
//        expect(readJS.scannableTargets.length).toEqual(0);
//    });
//
//    it("should return false if scannableTargets is undefined or 0 length", () => {
//        delete readJS.scannableTargets;
//        expect(readJS.visibleScannableTargets(readJS.scannableTargets)).toEqual(false);
//        readJS.scannableTargets = [];
//        expect(readJS.visibleScannableTargets(readJS.scannableTargets)).toEqual(false);
//    });
//
//    it("should not return targets that are not visible from the scannableTargets list", () => {
//        document.body.innerHTML = `<a class="card cardRegular sclt-featuredcard1" style="display:none;" data-contentid="1.4722411" href="https://www.cbc.ca/news/technology/antarctica-coldest-place-earth-1.4722411"><span class="imageMedia image full"><div class="placeholder"><div class="placeholderImage aspect-56"></div><img alt="" src="https://i.cbc.ca/1.4162948.1530142122!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/antarctic-ice-melt-field-camp.jpg" class="loaded largeImage"></div></span><div class="contentWrapper"><div class="card-content"><div class="card-content-top"><h3 class="non-display-headline readjsscanned" id="h-card-1.4722411">Scientists weren't satisfied with a –93 C Antarctica. Now they say it's –98 C</h3></div><div class="card-content-bottom"><div id="m-card-1.4722411" class="metadata"><div class="authorInfo"><span class="imageMedia author-image full"><div class="placeholder"><div class="placeholderImage aspect-56"></div><img alt="" src="https://i.cbc.ca/1.3853652.1489432400!/fileImage/httpImage/image.jpg_gen/derivatives/square_140/nicole-mortillaro.jpg" class="loaded largeImage"></div></span><div class="authorName" aria-label="Author: Nicole Mortillaro">Nicole Mortillaro</div></div><div class="metadataText"><span class="departmentItem deptItem-news">News <span class="metaSeparator" aria-hidden="true">-</span></span><span class="departmentItem deptItem-technology-science">Technology &amp; Science </span><span class="metaSeparator" aria-hidden="true">|</span><time class="timeStamp" datetime="2018-06-28T13:19:37.888Z">42 minutes ago</time></div></div></div></div></div></a>`;
//        const target = readJS.getScannableTargets(".non-display-headline");
//        expect(target.length).toEqual(1);
//        expect(readJS.visibleScannableTargets(readJS.scannableTargets).length).toEqual(0);
//    });
//
//    //reset after all test cases
//    afterAll(() => {
//        readJS.turnOff();
//        readJS.resetConfigStatus();
//    });
//});//