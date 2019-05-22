//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment, mockGetBoundingClientRect } from "./setup.js";
setupTestEnvironment();
mockGetBoundingClientRect({width:500, height:500, top:2000, bottom:0, left:50, right:0, x:50, y:-1242});

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-viewport-tests", () => {
    //do something before each test
    beforeAll(() => {
        readJS.turnOn();
    });

    it("don't add points if not in the viewport", () => {
        expect(readJS.inViewport(readJS.domNode)).toBeFalsy();
        expect(readJS.addPoints()).toBeFalsy();
    });

    it("should not return targets that are not visible from the scannableTargets list", () => {
        document.body.innerHTML = `<a class="card cardRegular sclt-featuredcard1" style="display:none;" data-contentid="1.4722411" href="https://www.cbc.ca/news/technology/antarctica-coldest-place-earth-1.4722411"><span class="imageMedia image full"><div class="placeholder"><div class="placeholderImage aspect-56"></div><img alt="" src="https://i.cbc.ca/1.4162948.1530142122!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/antarctic-ice-melt-field-camp.jpg" class="loaded largeImage"></div></span><div class="contentWrapper"><div class="card-content"><div class="card-content-top"><h3 class="non-display-headline readjsscanned" id="h-card-1.4722411">Scientists weren't satisfied with a –93 C Antarctica. Now they say it's –98 C</h3></div><div class="card-content-bottom"><div id="m-card-1.4722411" class="metadata"><div class="authorInfo"><span class="imageMedia author-image full"><div class="placeholder"><div class="placeholderImage aspect-56"></div><img alt="" src="https://i.cbc.ca/1.3853652.1489432400!/fileImage/httpImage/image.jpg_gen/derivatives/square_140/nicole-mortillaro.jpg" class="loaded largeImage"></div></span><div class="authorName" aria-label="Author: Nicole Mortillaro">Nicole Mortillaro</div></div><div class="metadataText"><span class="departmentItem deptItem-news">News <span class="metaSeparator" aria-hidden="true">-</span></span><span class="departmentItem deptItem-technology-science">Technology &amp; Science </span><span class="metaSeparator" aria-hidden="true">|</span><time class="timeStamp" datetime="2018-06-28T13:19:37.888Z">42 minutes ago</time></div></div></div></div></div></a>`;
        
        const target = readJS.getScannableTargets(".non-display-headline");
        expect(target.length).toEqual(1);
        expect(readJS.visibleScannableTargets(readJS.scannableTargets).length).toEqual(0);
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});