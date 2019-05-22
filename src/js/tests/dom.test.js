//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment } from "./setup.js";
setupTestEnvironment();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-dom-tests", () => {

    //do something before each test
    beforeAll(() => {
        //don't need readJS to be on while testing DOM reading utility functions
        readJS.turnOff();
        readJS.resetConfigStatus();
    });

    it("get-text", () => {

    	document.body.innerHTML = `<p id="get-simple-text">Hello there! The text of the dom node should be returned</p>`
        var el = document.getElementById("get-simple-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should be returned");

        document.body.innerHTML = `<p id="get-nested-text">Hello there! The text of the <span>dom node should</span> be returned</p>`;
        el = document.getElementById("get-nested-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should be returned");

        document.body.innerHTML = `<p id="avoid-image-text">Hello there! The text of the dom node should <img src="/camera.jpg" alt="Richard's camera"/> be returned</p>`;
        el = document.getElementById("avoid-image-text");
        expect(window.readJS.getText(el)).toBe("Hello there! The text of the dom node should be returned");

        document.body.innerHTML = `<input id="text-input" value="This is a test!"/>`;
        el = document.getElementById("text-input");
        expect(window.readJS.getText(el)).toBe("");
        expect(readJS.getText()).toBeFalsy();
    });

    it("should return all nodes of a certain class", () => {
        document.body.innerHTML = `<a class="card cardRegular sclt-featuredcard1" style="display:hidden;" data-contentid="1.4722411" href="https://www.cbc.ca/news/technology/antarctica-coldest-place-earth-1.4722411"><span class="imageMedia image full"><div class="placeholder"><div class="placeholderImage aspect-56"></div><img alt="" src="https://i.cbc.ca/1.4162948.1530142122!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/antarctic-ice-melt-field-camp.jpg" class="loaded largeImage"></div></span><div class="contentWrapper"><div class="card-content"><div class="card-content-top"><h3 class="headline readjsscanned" id="h-card-1.4722411">Scientists weren't satisfied with a –93 C Antarctica. Now they say it's –98 C</h3></div><div class="card-content-bottom"><div id="m-card-1.4722411" class="metadata"><div class="authorInfo"><span class="imageMedia author-image full"><div class="placeholder"><div class="placeholderImage aspect-56"></div><img alt="" src="https://i.cbc.ca/1.3853652.1489432400!/fileImage/httpImage/image.jpg_gen/derivatives/square_140/nicole-mortillaro.jpg" class="loaded largeImage"></div></span><div class="authorName" aria-label="Author: Nicole Mortillaro">Nicole Mortillaro</div></div><div class="metadataText"><span class="departmentItem deptItem-news">News <span class="metaSeparator" aria-hidden="true">-</span></span><span class="departmentItem deptItem-technology-science">Technology &amp; Science </span><span class="metaSeparator" aria-hidden="true">|</span><time class="timeStamp" datetime="2018-06-28T13:19:37.888Z">42 minutes ago</time></div></div></div></div></div></a>`;
        const targets = readJS.getScannableTargets(".headline");
        expect(targets.length).toEqual(1);
    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
    
});