/*
    Read.js assumes:
    1) The article width never exceeds the viewport width
*/
(function(){
    "use strict";
    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    var percentagePoint = 30; //the word count percentage and amount of dom node needing to be visible in viewport for awarding reading points
    var isOn = false;
    var initialized = false;
    var intervals = [];
    var readJS = {
        /*
            resetConfigStatus : resets config to default and all status variables to zero
        */
        resetConfigStatus : function(){
            readJS.status = {
                strict : false, // be very strict on read/scan verb
                spa : false, //tell readJS if it is in a single page app
                debug: {
                    console:false,
                    overlay:false,
                    overlays: {}
                },
                timeInterval: 1.5, //number of seconds between checking whether to poll the DOM
                activity:{
                    scrollDepth: 0, //the number of pixels that the browser has travelled vertically
                    maxVertical: 0, //the vertical percentage of the dom node the user has seen
                    timeOnPage:0, //number of seconds the user is on the page
                    timeInUnknownState:0, //number of idle seconds
                    timeInView:0, //number of seconds the story is in the viewport
                    scrolled: false,
                    dnp:0, //the percentage of the dom node that is in view
                    vpp:0, //the percentage of the viewport that the dom node is occupying
                    pollingPoints: 0, //the points accumulated before polling the DOM
                    readingPoints: 0, //the points accumulated during reading time; if points exceeds the reading point threshold then the person has read the article
                    increment: 100, //the number of points awarded when reading activity types have been determined
                    read: false,
                    averageReadSpeed : 300/60 //A "good" reader (ref: readingsoft.com) has a 300wpm (words-per-minute) average speed on a screen. Using this as a basis and converting to words-per-second to define minimum display time.
                },
                thresholds:{
                    viewport:25, //100 points awarded if the DOM node takes up this percentage of the viewport or higher
                    domNode:percentagePoint, //100 reading points awarded if the user has 30% of DOM node in the viewport
                    minVertical:50, //100 reading points awarded if the user scrolls past the percentage point of the DOM node
                    readingPoint:400, // if the number of points exceeds this limit than the person has read the article
                    domPolling:100, // the number of points to accumulate before doing any calculations on the DOM
                    minTimeInView: 3, //min number of seconds for the text to be in view
                    maxTimeInView: 20, //max number of seconds for the text to be in view
                    scrollDepth: 0 // dynamically calculated because dependant on dom node height
                }
            };
            return true;
        },
        /*
            getConfig: will return the current read JS config thresholds and settings
        */
        getConfig : function(){
            return readJS.status;
        },
        /*
            setConfig: will allow you to override default config values if it's currently not running
        */
        setConfig : function(){
            if (!!isOn){
                return false;
            }
            if (typeof(readJSConfig) === "undefined"){
                readJS.console("Error: Cannot find Read JS config object readJSConfig");
                return false;
            }
            if (typeof(readJSConfig.spa) === "boolean"){
                readJS.status.spa = readJSConfig.spa;
            }
            if (typeof(readJSConfig.strict) === "boolean"){
                readJS.status.strict = readJSConfig.strict;
            }
            if (!!readJSConfig.debug){
                if(typeof(readJSConfig.debug.console) === "boolean"){
                    readJS.status.debug.console = readJSConfig.debug.console;
                }
                if(typeof(readJSConfig.debug.overlay) === "boolean"){
                    readJS.status.debug.overlay = readJSConfig.debug.overlay;
                }
            }
            if (typeof(readJSConfig.timeInterval) === "number"){
                readJS.status.timeInterval = readJSConfig.timeInterval;
            }
            if (!!readJSConfig.activity){
                if(typeof(readJSConfig.activity.increment) === "number"){
                    readJS.status.activity.increment = readJSConfig.activity.increment;
                }
                if (typeof(readJSConfig.activity.averageReadSpeed) === "number"){
                    readJS.status.activity.averageReadSpeed = readJSConfig.activity.averageReadSpeed;
                }
            }
            if (!!readJSConfig.thresholds){
                if (typeof(readJSConfig.thresholds.viewport) === "number"){
                    readJS.status.thresholds.viewport = readJSConfig.thresholds.viewport;
                }
                if (typeof(readJSConfig.thresholds.domNode) === "number"){
                    readJS.status.thresholds.domNode = readJSConfig.thresholds.domNode;
                }
                if (typeof(readJSConfig.thresholds.readingPoint) === "number"){
                    readJS.status.thresholds.readingPoint = readJSConfig.thresholds.readingPoint;
                }
                if (typeof(readJSConfig.thresholds.domPolling) === "number"){
                    readJS.status.thresholds.domPolling = readJSConfig.thresholds.domPolling;
                }
                if (typeof(readJSConfig.thresholds.timeInView) === "number"){
                    readJS.status.thresholds.timeInView = readJSConfig.thresholds.timeInView;
                }
                if (typeof(readJSConfig.thresholds.minTimeInView) === "number"){
                    readJS.status.thresholds.minTimeInView = readJSConfig.thresholds.minTimeInView;
                }
                if (typeof(readJSConfig.thresholds.maxTimeInView) === "number"){
                    readJS.status.thresholds.maxTimeInView = readJSConfig.thresholds.maxTimeInView;
                }
                if (typeof(readJSConfig.thresholds.minVertical) === "number"){
                    readJS.status.thresholds.minVertical = readJSConfig.thresholds.minVertical;
                }
            }
            if (typeof(readJSConfig.el) !== "string"){
                readJS.console("ERROR: readJS.setConfig() expected a string representation of css selector");
                return false;
            }
            if (typeof(readJSConfig.cb) !== "function"){
                readJS.console("ERROR: readJS.setConfig() expected a callback function");
                return false;
            }
            return true;
        },

        /*
            initialize: set the interval at which the behaviour library will check the page for new activity
        */
        initialize : function(callback){

            if (typeof(callback)!== "function"){
                readJS.console("ERROR: readJS.initialize() expected a callback function");
                return false;
            }
            readJS.callback = callback;

            if (!readJSConfig.el){
                readJS.console("ERROR: readJS.initialize() expected a dom node to inspect");
                return false;
            }
            isOn = true;
            
            readJS.stopPolling();
            //check if the reader is actually reading at a decaying rate
            readJS.readingWorker = window.setInterval(readJS.checkActivity, readJS.status.timeInterval*1000);
            intervals.push(readJS.readingWorker);
            readJS.console("readJS: starting interval ID", readJS.readingWorker);

            readJS.inDebugMode();

            return true;
        },
        /*
            getIntervals: returns a list of intervals that were set by window.setInterval
        */
        getIntervals : function(){
            return intervals;
        },
        /*
            checkActivity is meant to determine if the user is active on the page
        */
        checkActivity : function(){

            var timeInterval = readJS.status.timeInterval; //seconds
            readJS.status.activity.timeOnPage+=timeInterval;
            readJS.status.activity.timeInUnknownState+=timeInterval;
            //add very little points when time passes by
            readJS.status.activity.readingPoints+=timeInterval;
            //detected the user has scrolled which means they are active on the page
            readJS.detectForScroll();
            readJS.endConditionsChecked();
        },
        /*
            endConditionsChecked will check for success conditions and add points accordingly and then see if the script should stop
        */
        endConditionsChecked : function(){
            if(!!readJS.isUpdateRequired()){
                readJS.calculateCoordinates();
                readJS.addPoints();
                readJS.hasRead();
                return true;
            }
            return false;
        },
        /*
            detectForScroll reads the scroll boolean to see if the event has happened and reactivate the script
        */
        detectForScroll : function(){
            if (!!readJS.status.activity.scrolled){
                readJS.status.activity.scrolled = false;
                readJS.reactivate();
                readJS.console("detected scroll:", readJS.status.activity.timeOnPage, " seconds");
                return true;
            }
            return false;
        },
        /*
            console() will debug the message if the debug mode permits
        */
        console : function(){
            if (!!readJS.status.debug.console){
                console.log(readJS.readingWorker, arguments);
                return true;
            }
            return false;
        },
        /*
            getText() will search the domNode for childNodes of text
        */
        getText : function(element){
            try{
                var ret = "";
                //element doesn't have nested DOM elements
                //if(typeof(element.childNodes) === "undefined"){
                //    return element.nodeValue;
                //}

                //element has nested DOM elements
                var length = element.childNodes.length;
                for(var i = 0; i < length; i++) {
                    var node = element.childNodes[i];
                    if(node.nodeType !== 8) {
                        ret += node.nodeType !== 1 ? node.nodeValue : readJS.getText(node);
                    }
                }
                return ret.replace(/[\t\n\r]+/g, "").replace(/\s+/g, " ").trim();
            }catch(err){
                readJS.console(err);
                return false;
            }
        },
        /*
            calculateCoordinates() will determine the amount of overlap between the dom node and the viewport
        */
        calculateCoordinates : function(){
            if (!!readJS.domNode){
                var r = readJS.inView(readJS.domNode);
                readJS.console("dom_node_inview_percent", r.dom_node_inview_percent, "dom_node_viewport_percent", r.dom_node_viewport_percent);
                return true;
            }else{
                readJS.console("ERROR: could not find the story body");
                return false;
            }
        },
        /*
            hasRead() will determine if the user has read the article
        */
        hasRead : function(){
            if (!!readJS.status.activity.read){
                return true;
            }
            //did not scroll far down enough
            if (readJS.status.activity.scrollDepth < readJS.status.thresholds.scrollDepth){
                readJS.console("Has not read yet because user didn't pass scrollDepth threshold");
                readJS.report();
                return false;
            }
            if (!!readJS.status.strict){
                //does not have enough of the dom node in the viewport (display ad viewability)
                if (readJS.status.activity.dnp < readJS.status.thresholds.domNode){
                    readJS.console("STRICT MODE: not enough of dom node is in view");
                    readJS.report();
                    return false;
                }
            }
            //not enough points scored
            if (readJS.status.activity.readingPoints <= readJS.status.thresholds.readingPoint){
                readJS.report();
                return false;
            }
            //not enough time in view
            if (readJS.status.activity.timeInView < readJS.status.thresholds.timeInView){
                readJS.report();
                return false;
            }
            
            readJS.status.activity.read = true;
            readJS.callback();
            readJS.removeListeners();
            readJS.console("readJS: the user has read the article", readJS.status.activity.readingPoints);
            readJS.stopPolling();
            return true;
            
        },
        /*
            stopPolling() will clear the current interval
        */
        stopPolling : function(){
            if (!!readJS.readingWorker){
                window.clearInterval(readJS.readingWorker);
                readJS.console("readJS: ending interval ID", readJS.readingWorker);
                delete readJS.readingWorker;
            }
        },
        /*
            report() will console out what readJS knows so far
        */
        report : function(){
            readJS.console("readingPoints: "+ readJS.status.activity.readingPoints, "timeInView: "+ readJS.status.activity.timeInView, readJS.status.thresholds.readingPoint, readJS.status.thresholds.timeInView);
        },
        /*
            addPoints() will recognize actions that will get us closer to the reading state
        */
        addPoints : function(){
            if(!readJS.inViewport(readJS.domNode)){
                return false;
            }
            //user is reading because enough of the dom node is in the viewport
            if (readJS.status.activity.dnp > readJS.status.thresholds.domNode){
                readJS.status.activity.readingPoints += readJS.status.activity.increment;
            }
            //user is reading because enough of the viewport is being occupied by the article DOM node
            if (readJS.status.activity.vpp > readJS.status.thresholds.viewport){
                readJS.status.activity.readingPoints += readJS.status.activity.increment;
            }
            //user is reading because they have scrolled passed a certain vertical threshold
            //if (readJS.status.activity.scrollDepth > readJS.status.thresholds.scrollDepth){
            //    readJS.status.activity.readingPoints += readJS.status.activity.increment/5;   
            //}
            return readJS.status.activity.readingPoints;
        },
        /*
            isUpdateRequired() determines if the DOM node calculations should be run
        */
        isUpdateRequired : function(){
            readJS.status.activity.pollingPoints += 100*Math.pow(0.9, readJS.status.activity.timeInUnknownState);
            //it's been long enough to check again
            if (readJS.status.activity.pollingPoints >= readJS.status.thresholds.domPolling ){
                readJS.console("readJS: analyzing the DOM at", readJS.status.activity.timeOnPage, " seconds", readJS.status.activity.pollingPoints);
                readJS.status.activity.pollingPoints = 0;
                return true;
            }

            //console.log("waiting for the right time to check the DOM", readJS.status.activity.timeOnPage);
            return false;
        },
        /*
            reactivate: the user has done something interesting on the page like click or scroll so it is time to reset the decay curve
        */
        reactivate : function(){
            readJS.console("readJS: reactivating refresh rate");
            readJS.status.activity.timeInUnknownState = 0;
            readJS.status.activity.pollingPoints += readJS.status.activity.increment;

        },
        /*
            inDebugMode: reads the query string to figure out how to behave
        */
        inDebugMode : function(){

            //add the scrolling debugging console
            if (!!readJS.status.debug.overlay){
                //add the dom node to overlay
                readJS.scrollDataOverlay = document.createElement("DIV");
                readJS.scrollDataOverlay.style.position = "fixed";
                readJS.scrollDataOverlay.style.bottom = "2em";
                readJS.scrollDataOverlay.style.right = "2em";
                readJS.scrollDataOverlay.style.zIndex = 10000;
                readJS.scrollDataOverlay.id = "scrollinfo";
                document.body.appendChild(readJS.scrollDataOverlay);
                //find the scroll data on initial load
                readJS.showScrollInfo();
            }

        },
        /*
            inViewport: utility function to determine if any part of the element in question is in the viewport
        */
        inViewport: function(el){
            var rect = el.getBoundingClientRect();
            return rect.bottom > 0 && rect.right > 0 && rect.left < window.innerWidth && rect.top < window.innerHeight;
        },
        /*
            showScrollInfo: overlay display to show the maximum scroll depth of the user
        */
        showScrollInfo: function(){
            if (!readJS.status.debug.overlay){
                return false;
            }
            document.getElementById("scrollinfo").innerHTML = readJS.status.activity.scrollDepth;
            return true;
        },
        /*
            getScrollInfo: will detect if user has scrolled pass threshold point
        */
        getScrollInfo : function(){
            var calculated = Math.abs(document.body.scrollTop) + window.innerHeight;
            if (calculated > readJS.status.activity.scrollDepth){
                readJS.status.activity.scrollDepth = calculated;
            }
            return true;
        },
        /*
            removeDomNode: utility function to remove dom nodes
        */
        removeDomNode : function(domNodeId){
            var dn = document.getElementById(domNodeId);
            if (!!dn){
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
        removeOverlays : function(){
            readJS.removeDomNode("viewport_inview");
            readJS.removeDomNode("overlap_inview");
            readJS.removeDomNode("domnode_inview");
        },
        /*
            Cross browser way to detect the visibility properties
        */
        getVisibilityProperties : function(){
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
            return { hiddenProp: hidden, eventName: visibilityChange };
        },
        // If the page is hidden, pause the DOM polling;
        // if the page is shown, continue to poll the DOM
        handleVisibilityChange : function(){
            var hidden = readJS.getVisibilityProperties().hiddenProp;
            if (document[hidden]) {
                readJS.console("readJS: pausing after detecting focus to another tab");
                readJS.stopPolling();
            }else{
                readJS.console("readJS: reinitializing after detecting tab is in focus");
                readJS.initialize(readJS.callback);
            }
        },
        //give inView a dom node and it will tell you what percentage of it is inside the viewport
        //the calculations assume
        inView : function(domNode){
            var dui, vui, oui;

            readJS.domNode = domNode;

            //top left and bottom right coordinate points of the viewport
            var vp = { tl:[], br:[]};

            //x coordinate of the top left corner of the viewport
            vp.tl[0] = Math.abs(document.body.scrollLeft||document.documentElement.scrollLeft);

            //y coordinate of the top left corner the viewport
            vp.tl[1] = Math.abs(document.body.scrollTop||document.documentElement.scrollTop);

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
            if (!!readJS.status.debug.overlay){
                
                if (!readJS.status.debug.overlays.vui){
                    vui = document.createElement("DIV");
                    vui.id = "viewport_inview";
                    vui.style.position = "absolute";
                    vui.style.background = "green";
                    vui.style.opacity = "0.5";
                    vui.style.zIndex = 9999;
                    document.body.appendChild(vui);
                    readJS.status.debug.overlays.vui = vui;
                }
                vui = readJS.status.debug.overlays.vui;            
                vui.style.left = vp.tl[0] + "px";
                vui.style.top = vp.tl[1] + "px";
                vui.style.width = vp.width + "px";
                vui.style.height = vp.height + "px";
                //readJS.console(vui);
            }

            //top left and bottom right coordinate points of the dom node
            var dn = { tl:[], br:[]};

            var bcr = domNode.getBoundingClientRect();

            var xOffset = (typeof(window.scrollX) === "undefined")?parseInt(window.pageXOffset, 10):parseInt(window.scrollX,10);
            var yOffset = (typeof(window.scrollY) === "undefined")?parseInt(window.pageYOffset, 10):parseInt(window.scrollY,10);

            //x coordinate of the top left corner of the dom node
            dn.tl[0] = bcr.left + xOffset;

            //y coordinate of the top left corner of the dom node
            dn.tl[1] = bcr.top + yOffset;

            //x coordinate of the bottom right corner of the dom node
            dn.br[0] = dn.tl[0] + bcr.width;

            //y coordinate of the bottom right corner of the dom node
            dn.br[1] = dn.tl[1] + bcr.height;

            //get the scroll info with the time interval/cadence
            readJS.getScrollInfo();

            //pixel point of minVertical percentage
            readJS.status.thresholds.scrollDepth = Math.abs(dn.tl[1]) + (bcr.height * readJS.status.thresholds.minVertical / 100);

            if (!!readJS.status.debug.overlay){
                //highlight dom node
                if (!readJS.status.debug.overlays.dui){
                    dui = document.createElement("DIV");
                    dui.id = "domnode_inview";
                    dui.style.position = "absolute";
                    dui.style.background = "blue";
                    dui.style.opacity = "0.5";
                    dui.style.zIndex = 9999;
                    document.body.appendChild(dui);
                    readJS.status.debug.overlays.dui = dui;
                }
                dui = readJS.status.debug.overlays.dui;
                
                dui.style.left = dn.tl[0] + "px";
                dui.style.top = dn.tl[1] + "px";
                dui.style.width = bcr.width + "px";
                dui.style.height = bcr.height + "px";
                //readJS.console(dui);
            }

            //element is not in viewport
            if (!readJS.inViewport(readJS.domNode)){
                return { "dom_node_inview_percent":0, "dom_node_viewport_percent": 0 };
            }

            //How much of the dom node is overlapping with the viewport?
            var overlap = { tl:[], br:[]};
            //x of the tl overlap coordinate
            overlap.tl[0] = (dn.tl[0] >= vp.tl[0])?dn.tl[0]:vp.tl[0];
            //y of the tl overlap coordinate
            overlap.tl[1] = (dn.tl[1] >= vp.tl[1])?dn.tl[1]:vp.tl[1];

            //x of the br overlap coordinate
            overlap.br[0] = (dn.br[0] <= vp.br[0])?dn.br[0]:vp.br[0];

            //y of the br overlap coordinate
            overlap.br[1] = (dn.br[1] <= vp.br[1])?dn.br[1]:vp.br[1];

            //console.log("dom node", dn);
            //console.log("overlap", overlap);
            //width of overlap
            var width_of_overlap = Math.abs(overlap.tl[0] - overlap.br[0]);
            //console.log("width_of_overlap", width_of_overlap);

            //height of overlap
            var height_of_overlap = Math.abs(overlap.tl[1]-overlap.br[1]);
            //console.log("height_of_overlap", height_of_overlap);

            //determine the area of the dom node
            var dom_node_area = Math.abs((dn.tl[0] - dn.br[0])*(dn.tl[1] - dn.br[1]));
            //console.log("dom_node_area", dom_node_area);

            //determine the area of the overlap
            var overlap_node_area = Math.abs(width_of_overlap * height_of_overlap);
            //console.log("overlap_node_area", overlap_node_area);

            //percentage of overlap in the dom node
            var dnip = overlap_node_area / dom_node_area * 100;

            //percentage of dom node occupying viewport
            var dnvp = overlap_node_area / vp.area * 100;

            if (!!readJS.status.debug.overlay){
                //highlight the overlap area
                if(!readJS.status.debug.overlays.oui){
                    oui = document.createElement("DIV");
                    oui.id = "overlap_inview";
                    document.body.appendChild(oui);
                    oui.style.position = "absolute";
                    oui.style.background = "red";
                    oui.style.opacity = "0.5";
                    oui.style.zIndex = 9999;
                    readJS.status.debug.overlays.oui = oui;
                }
                oui = readJS.status.debug.overlays.oui;
                oui.style.left = overlap.tl[0] + "px";
                oui.style.top = overlap.tl[1] + "px";
                oui.style.width = width_of_overlap + "px";
                oui.style.height = height_of_overlap + "px";
                //readJS.console(oui);
            }
            readJS.status.activity.dnp = dnip;
            readJS.status.activity.vpp = dnvp;

            var retval = { "dom_node_inview_percent":dnip, "dom_node_viewport_percent": dnvp };

            //if in strict mode and not enough of the dom node is in the viewport or not enough of the viewport is occupied by dom node then don't increment timeInView
            if(!!readJS.status.strict && (dnip < readJS.status.thresholds.domNode || dnvp < readJS.status.thresholds.viewport)){
                    return retval;
            }
            //increment timeInView
            readJS.status.activity.timeInView += readJS.status.timeInterval;    
            return retval;
        },
        handleScroll : function(){
            readJS.status.activity.scrolled = true;
            readJS.showScrollInfo();
        },
        handleClick : function(){
            readJS.status.activity.readingPoints += readJS.status.activity.increment;
            readJS.reactivate();
        },
        handleLoad : function(){
            readJS.domNode = document.querySelector(readJSConfig.el);
            readJS.setTimeInViewThreshold();
            readJS.domNode.addEventListener("click", readJS.handleClick);
            readJS.calculateCoordinates();
        },
        setTimeInViewThreshold : function(){

            if(typeof(readJS.status.thresholds.timeInView) === "number"){
                return false; //manually overriden so no need to word count
            }
            // get wordCount of the domNode we're watching in order to calculate correct timeInView threshold
            var wordCount = readJS.getText(readJS.domNode).split(" ").length;
            var averageReadSpeed = readJS.status.activity.averageReadSpeed; 
            // readJS.status.thresholds.timeInView is the average time it should take to read the percentage of text set in readJS.status.thresholds.domNode
            readJS.status.thresholds.timeInView = Math.floor(wordCount*((percentagePoint/100)/averageReadSpeed)/readJS.status.timeInterval);
            
            //console.log("threshold of timeInView", readJS.status.thresholds.timeInView);
            if (readJS.status.thresholds.minTimeInView > readJS.status.thresholds.timeInView){
                readJS.status.thresholds.timeInView = readJS.status.thresholds.minTimeInView;
            }else if(readJS.status.thresholds.timeInView > readJS.status.thresholds.maxTimeInView){
                readJS.status.thresholds.timeInView = readJS.status.thresholds.maxTimeInView;
            }
            
            //console.log("recalculated threshold of timeInView", readJS.status.thresholds.timeInView);
            return true;
        },
        removeListeners : function(){
            window.removeEventListener("scroll", readJS.handleScroll);
            window.removeEventListener("load", readJS.handleLoad);
            if (typeof(readJS.domNode) !== "undefined"){
                readJS.domNode.removeEventListener("click", readJS.handleClick);    
            }
            document.removeEventListener(readJS.getVisibilityProperties().eventName, readJS.handleVisibilityChange, false);
        },
        /*
            isOn : returns the value of isOn private variable
        */
        isOn : function(){
            return isOn;
        },
        /*
            turnOff : For SPA's to stop Read JS when changing app state
        */
        turnOff : function(){
            if (!isOn){
                return false;
            }
            
            readJS.removeListeners();
            readJS.console("readJS: stopping midway");
            readJS.stopPolling();
            readJS.removeOverlays();
            readJS.status.activity.read = false;
            isOn = false;

            return true;
        },
        /*
            turnOn : For SPA's to start Read JS when changing app state
        */
        turnOn : function(){
            if(!!isOn){
                return false;
            }

            //reset all status variables
            readJS.resetConfigStatus();

            //check if there are override config values
            readJS.setConfig();

            if(!!initialized && !readJSConfig.spa){
                readJS.console("ERROR: Not a SPA. Cannot turnOn() again on the same web page");
                return false;
            }
            if (typeof(readJSConfig) === "undefined"){
                readJS.console("ERROR: Could not find callback and/or domNode css selector in window.readJSConfig");
                return false;
            }
            if (typeof(readJSConfig.el) !== "string"){
                readJS.console("ERROR: Could not find domNode css selector in window.readJSConfig");
                return false;
            }
            if (typeof(readJSConfig.cb) !== "function" ){
                readJS.console("ERROR: Could not find callback function in window.readJSConfig");
                return false;
            }

            //scroll event listener
            window.addEventListener("scroll", readJS.handleScroll);

            //tab focus event listener
            document.addEventListener(readJS.getVisibilityProperties().eventName, readJS.handleVisibilityChange, false);

            if (!readJS.status.spa){
                //onload event listener
                window.addEventListener("load", readJS.handleLoad);
            }else{
                readJS.handleLoad();
            }

            //set it all in motion
            readJS.initialize(readJSConfig.cb);

            isOn = true;

            if (!initialized){
                readJS.handleVisibilityChange(); //use case:user opens page in new tab which means we need to check if the tab is active before counting
                initialized = true;
            }

            return true;
        }
    };

    window.readJS = readJS;

})();
if(typeof(readJSConfig)!=="undefined" && readJSConfig.spa !== true){
    readJS.turnOn(); //auto track on non SPA architecture web pages
}else{
    //setup status variables at a minimum
    readJS.resetConfigStatus();
}