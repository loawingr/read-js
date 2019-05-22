//in spa mode with a default paragraph as the text to read
import { setupTestEnvironment } from "./setup.js";
setupTestEnvironment();

//pull in the readJS library
import defaultExport from "../read.js";

describe("spa tests of readJS", () => {

    //do something before each test
    beforeAll(() =>  {
        readJS.turnOff();
        readJS.resetConfigStatus();
        window.readJSConfig = {};
    });

    it("should not be on already", () => {
        expect(readJS.isOn()).toBeFalsy();
    });

    it("should not be turned on", () => {
        //can't turn on because missing el and cb
        expect(readJS.turnOn()).toBeFalsy();
        expect(readJS.isOn()).toBeFalsy();
    });

    it("should not be turned off yet", () => {
        //can't turn off because isn't on yet
        expect(readJS.turnOff()).toBeFalsy();
        expect(readJS.isOn()).toBeFalsy();
    });

    it("should not accept a number for readJSConfig.el", () => {
        readJSConfig.el = 123;
        expect(readJS.initialize(readJSConfig.cb)).toBeFalsy();
    });

    it("prevents execution without minimum configuration", () => {

        expect(readJS.isOn()).toBeFalsy();
        expect(readJS.setConfig()).toBeFalsy();
        expect(readJS.turnOn()).toBeFalsy();

        window.readJSConfig.el = "#paragraph";

        expect(readJS.setConfig()).toBeFalsy();
        expect(readJS.turnOn()).toBeFalsy();

        window.readJSConfig.cb = () => {
            console.log("user read paragraph");
        }

        //use bare minimum config
        expect(readJS.setConfig()).toBeTruthy();
        expect(readJS.turnOn()).toBeTruthy();
        expect(readJS.isOn()).toBeTruthy();
        expect(readJS.turnOn()).toBeFalsy();
    });

    it("prevents setting config while on", () => {
        expect(readJS.setConfig()).toBeFalsy();
    });

    it("turns off if already on", () => {
        expect(readJS.isOn()).toBeTruthy();
        expect(readJS.turnOff()).toBeTruthy();
        expect(readJS.isOn()).toBeFalsy();
    });

    it("should now be ready to turn on", () => {
        window.readJSConfig.spa = true;
        readJS.domNode = document.getElementById("paragraph");
        expect(readJS.turnOn()).toBeTruthy();
    });

    it("should now be ready to turn off", () => {
        expect(readJS.turnOff()).toBeTruthy();
    });

    it("not turn on more than once if not a spa", () => {
        readJSConfig.spa = false;
        expect(readJS.turnOn()).toBeFalsy();
        readJSConfig.spa = true;
    });

    it("initialize", () => {
        var el = readJSConfig.el;
        delete readJSConfig.el;
        expect(readJS.initialize(() => {
            alert(1);
        })).toBeFalsy();
        readJSConfig.el = el;
        readJS.handleLoad();
        spyOn(window, "setInterval");
        expect(readJS.initialize(readJSConfig.cb)).toBeTruthy();
        expect(window.setInterval).toHaveBeenCalled();
    });

    it("should return false if the user agent contains \"Googlebot\"", () =>  {
        expect(readJS.checkGooglebot("Googlebot-Image/1.0")).toBeTruthy();
        expect(readJS.checkGooglebot("Googlebot-News")).toBeTruthy();
        expect(readJS.checkGooglebot("Googlebot-Video/1.0")).toBeTruthy();
        expect(readJS.checkGooglebot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBeTruthy();
        expect(readJS.checkGooglebot("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36")).toBeTruthy();
        expect(readJS.checkGooglebot("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBeTruthy();
        expect(readJS.checkGooglebot("Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBeTruthy();
        expect(readJS.checkGooglebot("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36")).toBeFalsy();
    });

    //reset after all test cases
    afterAll(() =>  {
        readJS.turnOff();
        readJS.resetConfigStatus();
    });
});