/* global readJSConfig */
/*
    Read.js assumes:
    1) The article width never exceeds the viewport width
*/
(function() {
    "use strict";
    // Set the name of the hidden property and the change event for visibility

    function readJS(config){
        /*
            resetConfigStatus : resets config to default and all status variables to zero
        */
        this.isOnValue = false;
        this.initialized = false;
        this.intervals = [];
        this.configKey = config;
        this.scannableTargets = [];
        this.visibleElementsMap = [];

        this.resetConfigStatus = () => {
            this.status = {
                strict: false, // be very strict on read/scan verb
                spa: false, //tell readJS if it is in a single page app
                ignoreScrollDepth: false,
                debug: {
                    console: false,
                    overlay: false,
                    overlays: {}
                },
                timeInterval: 1.5, //number of seconds between checking whether to poll the DOM
                activity: {
                    scrollDepth: 0, //the number of pixels that the browser has travelled vertically
                    maxVertical: 0, //the vertical percentage of the dom node the user has seen
                    timeOnPage: 0, //number of seconds the user is on the page
                    timeInUnknownState: 0, //number of idle seconds
                    timeInView: 0, //number of seconds the story is in the viewport
                    scrolled: false,
                    dnp: 0, //the percentage of the dom node that is in view
                    vpp: 0, //the percentage of the viewport that the dom node is occupying
                    pollingPoints: 0, //the points accumulated before polling the DOM
                    readingPoints: 0, //the points accumulated during reading time; if points exceeds the reading point threshold then the person has read the article
                    increment: 100, //the number of points awarded when reading activity types have been determined
                    read: false,
                    averageReadSpeed: 300 / 60, //A "good" reader (ref: readingsoft.com) has a 300wpm (words-per-minute) average speed on a screen. Using this as a basis and converting to words-per-second to define minimum display time.
                    initialTime: 0,
                    totalTime: 0,
                    numberOfCalls: 0
                },
                thresholds: {
                    viewport: 25, //100 points awarded if the DOM node takes up this percentage of the viewport or higher
                    domNode: 30, //100 reading points awarded if the user has 30% of DOM node in the viewport
                    minVertical: 50, //100 reading points awarded if the user scrolls past the percentage point of the DOM node
                    readingPoint: 400, // if the number of points exceeds this limit than the person has read the article
                    domPolling: 100, // the number of points to accumulate before doing any calculations on the DOM
                    minTimeInView: 3, //min number of seconds for the text to be in view
                    maxTimeInView: 20, //max number of seconds for the text to be in view
                    scrollDepth: 0, // dynamically calculated because dependant on dom node height
                    percentagePoint: 30, // the percentage of words in the body that is used to dynamically calculate the timeInView threshold using averageReadSpeed
                    maxCalls: 3
                }
            };
            return true;
        },
        /*
            getConfig: will return the current read JS config thresholds and settings
        */
        this.getConfig = () => {
            return this.status;
        },
        /*
            setConfig: will allow you to override default config values if it's currently not running
        */
        this.setConfig = () => {

            if (!!this.isOnValue) {
                return false;
            }

            if (typeof(window.readJSConfig) === "undefined") {
                this.console("Error: Cannot find Read JS config object readJSConfig");
                return false;
            }

            if(!!this.configKey && !!window.readJSConfig[this.configKey]){
                this.readJSConfig = window.readJSConfig[this.configKey];
            }else{
                this.readJSConfig = window.readJSConfig;
            }

            if (typeof(this.readJSConfig.spa) === "boolean") {
                this.status.spa = this.readJSConfig.spa;
            }
            if (typeof(this.readJSConfig.strict) === "boolean") {
                this.status.strict = this.readJSConfig.strict;
            }
            if (typeof(this.readJSConfig.ignoreScrollDepth) === "boolean") {
                this.status.ignoreScrollDepth = this.readJSConfig.ignoreScrollDepth;
            }
            if (!!this.readJSConfig.debug) {
                if (typeof(this.readJSConfig.debug.console) === "boolean") {
                    this.status.debug.console = this.readJSConfig.debug.console;
                }
                if (typeof(this.readJSConfig.debug.overlay) === "boolean") {
                    this.status.debug.overlay = this.readJSConfig.debug.overlay;
                }
            }
            if (typeof(this.readJSConfig.timeInterval) === "number") {
                this.status.timeInterval = this.readJSConfig.timeInterval;
            }
            if (!!this.readJSConfig.activity) {
                if (typeof(this.readJSConfig.activity.increment) === "number") {
                    this.status.activity.increment = this.readJSConfig.activity.increment;
                }
                if (typeof(this.readJSConfig.activity.averageReadSpeed) === "number") {
                    this.status.activity.averageReadSpeed = this.readJSConfig.activity.averageReadSpeed;
                }
            }
            if (!!this.readJSConfig.thresholds) {
                if (typeof(this.readJSConfig.thresholds.viewport) === "number") {
                    this.status.thresholds.viewport = this.readJSConfig.thresholds.viewport;
                }
                if (typeof(this.readJSConfig.thresholds.domNode) === "number") {
                    this.status.thresholds.domNode = this.readJSConfig.thresholds.domNode;
                }
                if (typeof(this.readJSConfig.thresholds.readingPoint) === "number") {
                    this.status.thresholds.readingPoint = this.readJSConfig.thresholds.readingPoint;
                }
                if (typeof(this.readJSConfig.thresholds.domPolling) === "number") {
                    this.status.thresholds.domPolling = this.readJSConfig.thresholds.domPolling;
                }
                if (typeof(this.readJSConfig.thresholds.timeInView) === "number") {
                    this.status.thresholds.timeInView = this.readJSConfig.thresholds.timeInView;
                }
                if (typeof(this.readJSConfig.thresholds.minTimeInView) === "number") {
                    this.status.thresholds.minTimeInView = this.readJSConfig.thresholds.minTimeInView;
                }
                if (typeof(this.readJSConfig.thresholds.maxTimeInView) === "number") {
                    this.status.thresholds.maxTimeInView = this.readJSConfig.thresholds.maxTimeInView;
                }
                if (typeof(this.readJSConfig.thresholds.minVertical) === "number") {
                    this.status.thresholds.minVertical = this.readJSConfig.thresholds.minVertical;
                }
                if (typeof(this.readJSConfig.thresholds.percentagePoint) === "number") {
                    this.status.thresholds.percentagePoint = this.readJSConfig.thresholds.percentagePoint;
                }
                if (typeof(this.readJSConfig.thresholds.maxCalls) === "number") {
                    this.status.thresholds.maxCalls = this.readJSConfig.thresholds.maxCalls;
                }
            }

            if (typeof(this.readJSConfig.el) !== "string") {
                this.console("ERROR: readJS.initialize() expected el to be a string");
                return false;
            }
            if (typeof(this.readJSConfig.cb) !== "function") {
                this.console("ERROR: readJS.setConfig() expected a callback function");
                return false;
            }

            return true;
        },

        /*
            initialize: set the interval at which the behaviour library will check the page for new activity
        */
        this.initialize = (callback) => {

            if (typeof(callback) !== "function") {
                this.console("ERROR: readJS.initialize() expected a callback function");
                return false;
            }
            this.callback = callback;

            if(!!this.configKey && !!window.readJSConfig[this.configKey]){
                this.readJSConfig = window.readJSConfig[this.configKey];
            }else{
                this.readJSConfig = window.readJSConfig;
            }

            if (typeof(this.readJSConfig.el) !== "string") {
                this.console("ERROR: readJS.initialize() expected el to be a string or object");
                return false;
            }

            this.setInitialTime();

            this.isOnValue = true;

            this.stopPolling();
            //check if the reader is actually reading at a decaying rate
            this.readingWorker = window.setInterval(this.checkActivity, this.status.timeInterval * 1000);
            this.intervals.push(this.readingWorker);
            this.console("readJS: starting interval ID", this.readingWorker);

            this.inDebugMode();

            return true;
        },
        /*
            setInitialTime: sets the initial time in activity.initialTime
        */
        this.setInitialTime = () => {
            this.status.activity.initialTime = new Date().getTime();
        },
        /*
            calculateTotalTime: sets the total time as the difference between total time and current time
        */
        this.calculateTotalTime = () => {
            if (!!this.status.activity.initialTime) {
                const currentTime = new Date().getTime();
                const currentTotal = this.status.activity.totalTime;
                this.status.activity.totalTime = parseInt(currentTotal) + parseInt(currentTime) - parseInt(this.status.activity.initialTime);
                this.setInitialTime();
            }
            if (this.status.activity.totalTime > 0) {
                return this.status.activity.totalTime;
            }
            this.console("ERROR: readJS.calculateTotalTIme() - initialTime not set");
            return false;
        },

        /*
            getScannableTargets: returns an object containing all the domnodes of the parameter class
        */
        this.getScannableTargets = (className) => {
            const scannableTargets = document.querySelectorAll(className);
            if (scannableTargets.length === 0) {
                this.console("ERROR: readJS.getScannableTargets(className) - No elements by that className!");
                return false;
            } else {
                this.scannableTargets = [];
                this.scannableTargets = Array.prototype.slice.call(scannableTargets);
                return this.scannableTargets;
            }
        },

        /*
            visibleScannableTargets: iterates through readJS.scannableTargets and returns elements currently in view
        */
        this.visibleScannableTargets = (scannableTargets) => {
            if (typeof(scannableTargets) !== "undefined" && scannableTargets.length > 0) {
                const visibleElements = [];
                this.visibleElementsMap = [];

                if(scannableTargets.length == 1){
                    const domNodePercentage = this.inView(scannableTargets[0]);
                    if(domNodePercentage.dom_node_viewport_percent > this.status.thresholds.viewport || domNodePercentage.dom_node_inview_percent > 80){
                        visibleElements.push(scannableTargets[0]);
                        this.visibleElementsMap.push(0);
                    }
                }else{
                    for (let i = 0; i < scannableTargets.length; i++) {
                        if (this.inView(scannableTargets[i]).dom_node_inview_percent > 80) {
                            visibleElements.push(scannableTargets[i]);
                            this.visibleElementsMap.push(i);
                        }
                    }
                }

                if (visibleElements.length > 3) {
                    this.console("ERROR: readJS.visibleScannableTargets() - More than 3 elements visible!");
                    return false;
                }
                return visibleElements;
            }

            this.console("ERROR: readJS.visibleScannableTargets() - No scannableTargets found!");
            return false;
        },

        /*
            getIntervals: returns a list of intervals that were set by window.setInterval
        */
        this.getIntervals = () => {
            return this.intervals;
        },
        /*
            checkActivity is meant to determine if the user is active on the page
        */
        this.checkActivity = () => {

            var timeInterval = this.status.timeInterval; //seconds
            this.status.activity.timeOnPage += timeInterval;
            this.status.activity.timeInUnknownState += timeInterval;
            //add very little points when time passes by
            this.status.activity.readingPoints += timeInterval;
            //detected the user has scrolled which means they are active on the page
            this.detectForScroll();
            this.endConditionsChecked();
        },
        /*
            endConditionsChecked will check for success conditions and add points accordingly and then see if the script should stop
        */
        this.endConditionsChecked = () => {
            if (!!this.isUpdateRequired()) {

                const allVisibleElements = this.visibleScannableTargets(this.scannableTargets);
                if(allVisibleElements && allVisibleElements.length > 0){
                    const firstElementInView = allVisibleElements[0];
                    this.domNode = firstElementInView;
                    this.addPoints();
                    this.hasRead();
                    return true;
                }
            }
            return false;
        },
        /*
            detectForScroll reads the scroll boolean to see if the event has happened and reactivate the script
        */
        this.detectForScroll = () => {
            if (!!this.status.activity.scrolled) {
                this.status.activity.scrolled = false;
                this.reactivate();
                this.console("detected scroll:", this.status.activity.timeOnPage, " seconds");
                return true;
            }
            return false;
        },
        /*
            console() will debug the message if the debug mode permits
        */
        this.console = (...args) => {
            if (!!this.status.debug.console) {
                console.log(this.readingWorker, args);
                return true;
            }
            return false;
        },
        /*
            getText() will search the domNode for childNodes of text
        */
        this.getText = (element) => {
            try {
                var ret = "";
                //element doesn't have nested DOM elements
                //if(typeof(element.childNodes) === "undefined"){
                //    return element.nodeValue;
                //}

                //element has nested DOM elements
                var length = element.childNodes.length;
                for (var i = 0; i < length; i++) {
                    var node = element.childNodes[i];
                    if (node.nodeType !== 8) {
                        ret += node.nodeType !== 1 ? node.nodeValue : this.getText(node);
                    }
                }
                return ret.replace(/[\t\n\r]+/g, "").replace(/\s+/g, " ").trim();
            } catch (err) {
                this.console(err);
                return false;
            }
        },
        /*
            calculateCoordinates() will determine the amount of overlap between the dom node and the viewport
        */
        this.calculateCoordinates = () => {
            if (!!this.domNode) {
                var r = this.inView(this.domNode);
                this.console("dom_node_inview_percent", r.dom_node_inview_percent, "dom_node_viewport_percent", r.dom_node_viewport_percent);
                return true;
            } else {
                this.console("ERROR: could not find the story body");
                return false;
            }
        },
        /*
            hasRead() will determine if the user has read the article
        */
        this.hasRead = () => {
            //did not scroll far down enough
            if (!this.status.ignoreScrollDepth && this.status.activity.scrollDepth < this.status.thresholds.scrollDepth) {
                this.console("Has not read yet because user didn't pass scrollDepth threshold");
                this.report();
                return false;
            }
            if (!!this.status.strict) {
                //does not have enough of the dom node in the viewport (display ad viewability)
                if (this.status.activity.dnp < this.status.thresholds.domNode) {
                    this.console("STRICT MODE: not enough of dom node is in view");
                    this.report();
                    return false;
                }
            }
            //not enough points scored
            if (this.status.activity.readingPoints <= this.status.thresholds.readingPoint) {
                this.console("Not enough points scored for callback");
                this.report();
                return false;
            }
            //not enough time in view
            if (this.status.activity.timeInView < this.status.thresholds.timeInView) {
                this.console("Not enough time in view for callback");
                this.report();
                return false;
            }

            this.callback(this.status.activity.timeInView, this.status.activity.timeOnPage);
            this.status.activity.numberOfCalls++;
            this.scannableTargets.splice(this.visibleElementsMap[0], 1);
            if(this.scannableTargets.length <= 0 || this.status.activity.numberOfCalls >= this.status.thresholds.maxCalls) {
                this.removeListeners();
                this.console("readJS: the user has read the article", this.status.activity.readingPoints);
                this.stopPolling();
            }
            return true;

        },
        /*
            stopPolling() will clear the current interval
        */
        this.stopPolling = () => {
            if (!!this.readingWorker) {
                window.clearInterval(this.readingWorker);
                this.console("readJS: ending interval ID", this.readingWorker);
                delete this.readingWorker;
            }
        },
        /*
            report() will console out what readJS knows so far
        */
        this.report = () => {
            this.console("readingPoints: " + this.status.activity.readingPoints, "timeInView: " + this.status.activity.timeInView, this.status.thresholds.readingPoint, this.status.thresholds.timeInView);
        },
        /*
            addPoints() will recognize actions that will get us closer to the reading state
        */
        this.addPoints = () => {
            if (!this.inViewport(this.domNode)) {
                return false;
            }
            //user is reading because enough of the dom node is in the viewport
            if (this.status.activity.dnp > this.status.thresholds.domNode) {
                this.status.activity.readingPoints += this.status.activity.increment;
            }
            //user is reading because enough of the viewport is being occupied by the article DOM node
            if (this.status.activity.vpp > this.status.thresholds.viewport) {
                this.status.activity.readingPoints += this.status.activity.increment;
            }
            //user is reading because they have scrolled passed a certain vertical threshold
            //if (readJS.status.activity.scrollDepth > readJS.status.thresholds.scrollDepth){
            //    readJS.status.activity.readingPoints += readJS.status.activity.increment/5;
            //}
            return this.status.activity.readingPoints;
        },
        /*
            isUpdateRequired() determines if the DOM node calculations should be run
        */
        this.isUpdateRequired = () => {
            this.status.activity.pollingPoints += 100 * Math.pow(0.9, this.status.activity.timeInUnknownState);
            //it's been long enough to check again
            if (this.status.activity.pollingPoints >= this.status.thresholds.domPolling) {
                this.console("readJS: analyzing the DOM at", this.status.activity.timeOnPage, " seconds", this.status.activity.pollingPoints);
                this.status.activity.pollingPoints = 0;
                return true;
            }

            //console.log("waiting for the right time to check the DOM", readJS.status.activity.timeOnPage);
            return false;
        },
        /*
            reactivate: the user has done something interesting on the page like click or scroll so it is time to reset the decay curve
        */
        this.reactivate = () => {
            this.console("readJS: reactivating refresh rate");
            this.status.activity.timeInUnknownState = 0;
            this.status.activity.pollingPoints += this.status.activity.increment;

        },
        /*
            inDebugMode: reads the query string to figure out how to behave
        */
        this.inDebugMode = () => {

            //add the scrolling debugging console
            if (!!this.status.debug.overlay) {
                //add the dom node to overlay
                this.scrollDataOverlay = document.createElement("DIV");
                this.scrollDataOverlay.style.position = "fixed";
                this.scrollDataOverlay.style.bottom = "2em";
                this.scrollDataOverlay.style.right = "2em";
                this.scrollDataOverlay.style.zIndex = 10000;
                this.scrollDataOverlay.id = "scrollinfo";
                document.body.appendChild(this.scrollDataOverlay);
                //find the scroll data on initial load
                this.showScrollInfo();
            }

        },
        /*
            inViewport: utility function to determine if any part of the element in question is in the viewport
        */
        this.inViewport = (el) => {
            var rect = el.getBoundingClientRect();
            return rect.bottom > 0 && rect.right > 0 && rect.left < window.innerWidth && rect.top < window.innerHeight;
        },
        /*
            showScrollInfo: overlay display to show the maximum scroll depth of the user
        */
        this.showScrollInfo = () => {
            if (!this.status.debug.overlay) {
                return false;
            }
            document.getElementById("scrollinfo").innerHTML = this.status.activity.scrollDepth;
            return true;
        },
        /*
            getScrollInfo: will detect if user has scrolled pass threshold point
        */
        this.getScrollInfo = () => {
            var scrollTop;
            // Firefox and IE don't support document.body.scrollTop, so we need this logic to select document.documentElement.scrollTop instead
            if (!!document.body.scrollTop) {
                scrollTop = document.body.scrollTop;
            } else if (!!document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            }
            var calculated = Math.abs(scrollTop) + window.innerHeight;
            if (calculated > this.status.activity.scrollDepth) {
                this.status.activity.scrollDepth = calculated;
            }
            return true;
        },
        /*
            removeDomNode: utility function to remove dom nodes
        */
        this.removeDomNode = (domNodeId) => {
            var dn = document.getElementById(domNodeId);
            if (!!dn) {
                var p = dn.parentNode;
                p.removeChild(dn);
                dn = null;
                return true;
            }
            return false;
        },
        /*
            removeOverlays: utility to remove all overlay DOM nodes
        */
        this.removeOverlays = () => {
            this.removeDomNode("viewport_inview");
            this.removeDomNode("overlap_inview");
            this.removeDomNode("domnode_inview");
        },
        /*
            Cross browser way to detect the visibility properties
        */
        this.getVisibilityProperties = () => {
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document.mozHidden !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            return {
                hiddenProp: hidden,
                eventName: visibilityChange
            };
        },
        // If the page is hidden, pause the DOM polling;
        // if the page is shown, continue to poll the DOM
        this.handleVisibilityChange = () => {
            var hidden = this.getVisibilityProperties().hiddenProp;
            if (document[hidden]) {
                this.console("readJS: pausing after detecting focus to another tab");
                this.stopPolling();
                this.calculateTotalTime();
            } else {
                this.console("readJS: reinitializing after detecting tab is in focus");
                this.initialize(this.callback);
            }
        },
        //give inView a dom node and it will tell you what percentage of it is inside the viewport
        //the calculations assume
        this.inView = (domNode) => {
            var dui, vui, oui;

            this.domNode = domNode;

            //top left and bottom right coordinate points of the viewport
            var vp = {
                tl: [],
                br: []
            };

            //x coordinate of the top left corner of the viewport
            vp.tl[0] = Math.abs(document.body.scrollLeft || document.documentElement.scrollLeft);

            //y coordinate of the top left corner the viewport
            vp.tl[1] = Math.abs(document.body.scrollTop || document.documentElement.scrollTop);

            //x coordinate of the bottom right corner of the viewport
            vp.br[0] = vp.tl[0] + window.innerWidth;

            //y coordinate of the bottom right corner the viewport
            vp.br[1] = vp.tl[1] + window.innerHeight;

            //viewport width
            vp.width = window.innerWidth;
            //viewport height
            vp.height = window.innerHeight;

            //viewport area
            vp.area = vp.width * vp.height;

            //highlight viewport
            if (!!this.status.debug.overlay) {

                if (!this.status.debug.overlays.vui) {
                    vui = document.createElement("DIV");
                    vui.id = "viewport_inview";
                    vui.style.position = "absolute";
                    vui.style.background = "green";
                    vui.style.opacity = "0.5";
                    vui.style.zIndex = 9999;
                    document.body.appendChild(vui);
                    this.status.debug.overlays.vui = vui;
                }
                vui = this.status.debug.overlays.vui;
                vui.style.left = vp.tl[0] + "px";
                vui.style.top = vp.tl[1] + "px";
                vui.style.width = vp.width + "px";
                vui.style.height = vp.height + "px";
                //readJS.console(vui);
            }

            //top left and bottom right coordinate points of the dom node
            var dn = {
                tl: [],
                br: []
            };

            var bcr = domNode.getBoundingClientRect();

            var xOffset = (typeof(window.scrollX) === "undefined") ? parseInt(window.pageXOffset, 10) : parseInt(window.scrollX, 10);
            var yOffset = (typeof(window.scrollY) === "undefined") ? parseInt(window.pageYOffset, 10) : parseInt(window.scrollY, 10);

            //x coordinate of the top left corner of the dom node
            dn.tl[0] = bcr.left + xOffset;

            //y coordinate of the top left corner of the dom node
            dn.tl[1] = bcr.top + yOffset;

            //x coordinate of the bottom right corner of the dom node
            dn.br[0] = dn.tl[0] + bcr.width;

            //y coordinate of the bottom right corner of the dom node
            dn.br[1] = dn.tl[1] + bcr.height;

            //get the scroll info with the time interval/cadence
            this.getScrollInfo();

            //pixel point of minVertical percentage
            this.status.thresholds.scrollDepth = Math.abs(dn.tl[1]) + (bcr.height * this.status.thresholds.minVertical / 100);

            if (!!this.status.debug.overlay) {
                //highlight dom node
                if (!this.status.debug.overlays.dui) {
                    dui = document.createElement("DIV");
                    dui.id = "domnode_inview";
                    dui.style.position = "absolute";
                    dui.style.background = "blue";
                    dui.style.opacity = "0.5";
                    dui.style.zIndex = 9999;
                    document.body.appendChild(dui);
                    this.status.debug.overlays.dui = dui;
                }
                dui = this.status.debug.overlays.dui;

                dui.style.left = dn.tl[0] + "px";
                dui.style.top = dn.tl[1] + "px";
                dui.style.width = bcr.width + "px";
                dui.style.height = bcr.height + "px";
                //this.console(dui);
            }

            //element is not in viewport
            if (!this.inViewport(this.domNode)) {
                return {
                    "dom_node_inview_percent": 0,
                    "dom_node_viewport_percent": 0
                };
            }

            //How much of the dom node is overlapping with the viewport?
            var overlap = {
                tl: [],
                br: []
            };
            //x of the tl overlap coordinate
            overlap.tl[0] = (dn.tl[0] >= vp.tl[0]) ? dn.tl[0] : vp.tl[0];
            //y of the tl overlap coordinate
            overlap.tl[1] = (dn.tl[1] >= vp.tl[1]) ? dn.tl[1] : vp.tl[1];

            //x of the br overlap coordinate
            overlap.br[0] = (dn.br[0] <= vp.br[0]) ? dn.br[0] : vp.br[0];

            //y of the br overlap coordinate
            overlap.br[1] = (dn.br[1] <= vp.br[1]) ? dn.br[1] : vp.br[1];

            //console.log("dom node", dn);
            //console.log("overlap", overlap);
            //width of overlap
            var width_of_overlap = Math.abs(overlap.tl[0] - overlap.br[0]);
            //console.log("width_of_overlap", width_of_overlap);

            //height of overlap
            var height_of_overlap = Math.abs(overlap.tl[1] - overlap.br[1]);
            //console.log("height_of_overlap", height_of_overlap);

            //determine the area of the dom node
            var dom_node_area = Math.abs((dn.tl[0] - dn.br[0]) * (dn.tl[1] - dn.br[1]));
            //console.log("dom_node_area", dom_node_area);

            //determine the area of the overlap
            var overlap_node_area = Math.abs(width_of_overlap * height_of_overlap);
            //console.log("overlap_node_area", overlap_node_area);

            //percentage of overlap in the dom node
            var dnip = overlap_node_area / dom_node_area * 100;

            //percentage of dom node occupying viewport
            var dnvp = overlap_node_area / vp.area * 100;

            if (!!this.status.debug.overlay) {
                //highlight the overlap area
                if (!this.status.debug.overlays.oui) {
                    oui = document.createElement("DIV");
                    oui.id = "overlap_inview";
                    document.body.appendChild(oui);
                    oui.style.position = "absolute";
                    oui.style.background = "red";
                    oui.style.opacity = "0.5";
                    oui.style.zIndex = 9999;
                    this.status.debug.overlays.oui = oui;
                }
                oui = this.status.debug.overlays.oui;
                oui.style.left = overlap.tl[0] + "px";
                oui.style.top = overlap.tl[1] + "px";
                oui.style.width = width_of_overlap + "px";
                oui.style.height = height_of_overlap + "px";
                //this.console(oui);
            }
            this.status.activity.dnp = dnip;
            this.status.activity.vpp = dnvp;

            var retval = {
                "dom_node_inview_percent": dnip,
                "dom_node_viewport_percent": dnvp
            };

            //if in strict mode and not enough of the dom node is in the viewport or not enough of the viewport is occupied by dom node then don't increment timeInView
            if (!!this.status.strict && (dnip < this.status.thresholds.domNode || dnvp < this.status.thresholds.viewport)) {
                return retval;
            }
            //increment timeInView
            this.status.activity.timeInView += this.status.timeInterval;
            return retval;
        },
        this.handleScroll = () => {
            this.status.activity.scrolled = true;
            this.showScrollInfo();
        },
        this.handleClick = () => {
            this.status.activity.readingPoints += this.status.activity.increment;
            this.reactivate();
        },
        this.handleLoad = () => {
            this.getScannableTargets(this.readJSConfig.el);
            this.domNode = document.querySelector(this.readJSConfig.el);
            this.setTimeInViewThreshold();
            this.domNode.addEventListener("click", this.handleClick);
            this.visibleScannableTargets(this.scannableTargets);
        },
        this.setTimeInViewThreshold = () => {

            if (typeof(this.status.thresholds.timeInView) === "number") {
                return false; //manually overriden so no need to word count
            }
            // get wordCount of the domNode we're watching in order to calculate correct timeInView threshold
            var wordCount = this.getText(this.domNode).split(" ").length;
            var averageReadSpeed = this.status.activity.averageReadSpeed;
            // readJS.status.thresholds.timeInView is the average time it should take to read the percentage of text set in readJS.status.thresholds.domNode
            this.status.thresholds.timeInView = Math.floor(wordCount * (this.status.thresholds.percentagePoint / 100) / averageReadSpeed);

            //console.log("threshold of timeInView", readJS.status.thresholds.timeInView);
            if (this.status.thresholds.minTimeInView > this.status.thresholds.timeInView) {
                this.status.thresholds.timeInView = this.status.thresholds.minTimeInView;
            } else if (this.status.thresholds.timeInView > this.status.thresholds.maxTimeInView) {
                this.status.thresholds.timeInView = this.status.thresholds.maxTimeInView;
            }

            //console.log("recalculated threshold of timeInView", readJS.status.thresholds.timeInView);
            return true;
        },
        this.removeListeners = () => {
            window.removeEventListener("scroll", this.handleScroll);
            window.removeEventListener("load", this.handleLoad);
            if (typeof(this.domNode) !== "undefined") {
                this.domNode.removeEventListener("click", this.handleClick);
            }
            document.removeEventListener(this.getVisibilityProperties().eventName, this.handleVisibilityChange, false);
        },
        /*
            isOn : returns the value of isOnValue private variable
        */
        this.isOn = () => {
            return this.isOnValue;
        },
        /*
            turnOff : For SPA's to stop Read JS when changing app state
        */
        this.turnOff = () => {
            if (!this.isOnValue) {
                return false;
            }

            this.removeListeners();
            this.console("readJS: stopping midway");
            this.stopPolling();
            this.removeOverlays();
            this.status.activity.read = false;
            this.isOnValue = false;

            return true;
        },
        /*
            turnOn : For SPA's to start Read JS when changing app state
        */
        this.turnOn = () => {
            if (!!this.isOnValue) {
                return false;
            }

            //reset all status variables
            this.resetConfigStatus();

            //check if there are override config values
            this.setConfig();

            if (!!this.initialized && !this.readJSConfig.spa) {
                this.console("ERROR: Not a SPA. Cannot turnOn() again on the same web page");
                return false;
            }
            if (typeof(this.readJSConfig) === "undefined") {
                this.console("ERROR: Could not find callback and/or domNode css selector in window.readJSConfig");
                return false;
            }
            if (typeof(this.readJSConfig.el) !== "string") {
                this.console("ERROR:  readJSConfig expected el to be a string");
                return false;
            }
            if (typeof(this.readJSConfig.cb) !== "function") {
                this.console("ERROR: readJSConfig expected a callback function");
                return false;
            }

            //scroll event listener
            window.addEventListener("scroll", this.handleScroll);

            //tab focus event listener
            document.addEventListener(this.getVisibilityProperties().eventName, this.handleVisibilityChange, false);

            if (!this.status.spa) {
                //onload event listener
                window.addEventListener("load", this.handleLoad);
            } else {
                this.handleLoad();
            }

            //set it all in motion
            this.initialize(this.readJSConfig.cb);

            this.isOnValue = true;

            if (!this.initialized) {
                this.handleVisibilityChange(); //use case:user opens page in new tab which means we need to check if the tab is active before counting
                this.initialized = true;
            }

            return true;
        };

    }

    //initialize both readJS and scannedJS
    window.readJS = new readJS("read");
    window.scannedJS = new readJS("scanned");

    if (typeof(readJSConfig) !== "undefined" && readJSConfig.spa !== true) {

        //only turnOn scannedJS if readJSConfig specify scanned
        if(readJSConfig.scanned || readJSConfig.read){
            if(readJSConfig.scanned){
                window.scannedJS.turnOn();
            }
            if(readJSConfig.read){
                window.readJS.turnOn();
            }

        }else{
            window.readJS.turnOn();
        }
    } else {
        //setup status variables at a minimum
        if(!!window.readJS){
            window.readJS.resetConfigStatus();
        }
        if(!!window.scannedJS){
            window.scannedJS.resetConfigStatus();
        }
    }
})();
