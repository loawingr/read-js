//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment, mockGetBoundingClientRect } from "./setup.js";
setupTestEnvironment();
mockGetBoundingClientRect();

//pull in the readJS library
import defaultExport from "../read.js";

describe("read-js-debug-mode-tests", () => {

    //do something before each test
    beforeAll(() => {
        readJS.turnOn();
    });

    it("console", () => {
        readJS.status.debug.console = true;
        expect(readJS.console("hello Richard!")).toBeFalsy();
        expect(readJS.console("apple", "orange")).toBeFalsy();
        expect(readJS.console("apple", 1)).toBeTruthy();

        readJS.status.debug.console = false;
        expect(readJS.console("hello Richard!")).toBeFalsy();
    });

    it("will-detect-debug-mode-via-url", () => {
        
        readJS.inDebugMode("https://localhost?console=hello");
        expect(readJS.status.debug.console).toBeFalsy();

        readJS.inDebugMode("https://localhost?overlay=12");
        expect(readJS.status.debug.overlay).toBeFalsy();

        expect(readJS.status.debug.level).toBe(3);

        readJS.inDebugMode("https://localhost?console=true");
        expect(readJS.status.debug.console).toBeTruthy();

        readJS.inDebugMode("https://localhost?overlay=true");
        expect(readJS.status.debug.overlay).toBeTruthy();

        readJS.inDebugMode("https://localhost?level=2");
        expect(readJS.status.debug.level).toBe(2);

        readJS.status.debug.console = false;
        readJS.status.debug.overlay = false;
        readJS.status.debug.level = 3;
    });

    it("should be able to render debugging overlay dom nodes", () => {
        //configure to allow overlays to render
        readJS.status.debug.overlay = true;

        //render overlays
        readJS.inView(readJS.domNode, true);

        expect(document.getElementById("viewport_inview")).not.toBeNull();
        expect(document.getElementById("overlap_inview")).not.toBeNull();
        expect(document.getElementById("domnode_inview")).not.toBeNull();
        expect(document.getElementById("scroll_depth_marker")).not.toBeNull();

    });

    //reset after all test cases
    afterAll(() => {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});