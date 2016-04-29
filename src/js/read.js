var readJSConfig = window.readingJSConfig || {};
if (!readJSConfig.el){ readJSConfig.el = ".story-body"; }
if (!readJSConfig.cb){ readJSConfig.cb = function(){
    "use strict";
    alert("The article has been read");
}; }
/*
    Read.js assumes:
    1) The article width never exceeds the viewport width
*/
(function(){
    "use strict";
    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    var wordCount = document.getElementById(".story-body").innerHTML.split(' ').length;
    var averageReadSpeed = 400; //according to Google, average read speed is 200 wpm with 60% comprehension. Need to find 95th percentile number. Arbitrarily doubling for now.
    var readJS = {
        debug: {
            console:false,
            overlay:false
        },
        timeInterval: 1.5, //number of seconds between checking whether to poll the DOM
        activity:{
            scrollDepth: 0, //the number of pixels that the browser has travelled vertically
            timeOnPage:0, //number of seconds the user is on the page
            timeInUnknownState:0, //number of idle seconds
            timeInView:0, //number of seconds the story is in the viewport
            scrolled: false,
            dnp:0, //the percentage of the dom node that is in view
            vpp:0, //the percentage of the viewport that the dom node is occupying
            pollingPoints: 0, //the points accumulated before polling the DOM
            readingPoints: 0, //the points accumulated during reading time; if points exceeds the reading point threshold then the person has read the article
            increment: 100, //the number of points awarded when reading activity types have been determined
            read: false
        },
        thresholds:{
            viewport:25, //100 points awarded if the DOM node takes up this percentage of the viewport or higher
            domNode:30, //100 points awarded if the user scrolls past the percentage point of the DOM node
            readingPoint:400, // if the number of points exceeds this limit than the person has read the article
            domPolling:100, // the number of points to accumulate before doing any calculations on the DOM
            timeInView:(wordCount*(domNode/100)/averageReadSpeed) //calculated minimum time necessary to reach the 100% scroll node above
        },
        /*
            initialize: set the interval at which the behaviour library will check the page for new activity
        */
        initialize : function(callback){

            if (typeof(callback)!== "function"){
                console.log("ERROR: readJS.initialize() expected a callback function");
                return;
            }
            readJS.callback = callback;

            //check if the reader is actually reading at a decaying rate
            readJS.readingWorker = window.setInterval(function(){
                var timeInterval = readJS.timeInterval; //seconds
                readJS.activity.timeOnPage+=timeInterval;
                readJS.activity.timeInUnknownState+=timeInterval;
                //add very little points when time passes by
                readJS.activity.readingPoints+=timeInterval;
                //detected the user has scrolled which means they are active on the page
                if (!!readJS.activity.scrolled){
                    readJS.activity.scrolled = false;
                    readJS.reactivate();
                    readJS.console("detected scroll:", readJS.activity.timeOnPage, " seconds");
                }
                if(readJS.isUpdateRequired()){
                    readJS.calculateCoordinates();
                    readJS.addPoints();
                    readJS.hasRead();
                }

            }, readJS.timeInterval*1000);
            readJS.console("readJS: starting interval ID", readJS.readingWorker);
        },
        /*
            console() will debug the message if the debug mode permits
        */
        console : function(){
            if (!!readJS.debug.console){
                console.log(arguments);
            }
        },
        /*
            calculateCoordinates() will determine the amount of overlap between the dom node and the viewport
        */
        calculateCoordinates : function(){
            if (!!readJS.domNode){
                var r = readJS.inView(readJS.domNode);
                readJS.console("dom_node_inview_percent", r.dom_node_inview_percent, "dom_node_viewport_percent", r.dom_node_viewport_percent);
            }else{
                console.log("ERROR: could not find the story body");
            }
        },
        /*
            hasRead() will determine if the user has read the article
        */
        hasRead: function(){
            if (!!readJS.activity.read){
                return;
            }
            if (readJS.activity.readingPoints > readJS.thresholds.readingPoint && readJS.activity.timeInView >= readJS.thresholds.timeInView){
                readJS.activity.read = true;
                readJS.callback();
                readJS.removeListeners();
                readJS.console("readJS: the user has read the article", readJS.activity.readingPoints);
                readJS.console("readJS: ending interval ID", readJS.readingWorker);
                window.clearInterval(readJS.readingWorker);
            }else{
                readJS.console("readingPoints:", readJS.activity.readingPoints, "timeInView:", readJS.activity.timeInView);
            }
        },
        /*
            addPoints() will recognize actions that will get us closer to the reading state
        */
        addPoints : function(){
            if(!readJS.inViewport(readJS.domNode)){
                return;
            }
            //user is reading because enough of the dom node has been scrolled through
            if (readJS.activity.dnp > readJS.thresholds.domNode){
                readJS.activity.readingPoints += readJS.activity.increment;
            }
            //user is reading because enough of the viewport is being occupied by the article DOM node
            if (readJS.activity.vpp > readJS.thresholds.viewport){
                readJS.activity.readingPoints += readJS.activity.increment;
            }
        },
        /*
            isUpdateRequired() determines if the DOM node calculations should be run
        */
        isUpdateRequired : function(){
            readJS.activity.pollingPoints += 100*Math.pow(0.9, readJS.activity.timeInUnknownState);
            //it's been long enough to check again
            if (readJS.activity.pollingPoints >= readJS.thresholds.domPolling ){
                readJS.activity.pollingPoints = 0;
                readJS.console("readJS: analyzing the DOM at", readJS.activity.timeOnPage, " seconds");
                return true;
            }

            //console.log("waiting for the right time to check the DOM", readJS.activity.timeOnPage);
            return false;
        },
        /*
            reactivate: the user has done something interesting on the page like click or scroll so it is time to reset the decay curve
        */
        reactivate: function(){
            readJS.console("readJS: reactivating refresh rate");
            readJS.activity.timeInUnknownState = 0;
            readJS.activity.pollingPoints += readJS.activity.increment;

        },
        /*
            inDebugMode: reads the query string to figure out how to behave
        */
        inDebugMode: function(){
            if (document.location.href.match(/statsOverlay\=true/)){
                readJS.debug.overlay = true;
                return;
            }

            if (document.location.href.match(/statsConsole\=true/)){
                readJS.debug.console = true;
                return;
            }

            if (document.location.href.match(/statsDebug\=true/)){
                readJS.debug.overlay = true;
                readJS.debug.console = true;
                return;
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
            if (!readJS.debug.overlay){
                return;
            }
            var calculated = Math.abs(document.body.scrollTop) + window.innerHeight;
            if (calculated > readJS.activity.scrollDepth){
                readJS.activity.scrollDepth = calculated;
                document.getElementById("scrollinfo").innerHTML = calculated;
            }
        },
        /*
            removeOverlay: utility function to remove dom nodes
        */
        removeOverlay : function(domNodeId){
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
                readJS.console("ending interval ID ", readJS.readingWorker);
                window.clearInterval(readJS.readingWorker);
            }else{
                readJS.console("readJS: reinitializing after detecting tab is in focus");
                readJS.initialize(readJS.callback);
            }
        },
        //give inView a dom node and it will tell you what percentage of it is inside the viewport
        //the calculations assume
        inView : function(domNode){

            readJS.domNode = domNode;

            //top left and bottom right coordinate points of the viewport
            var vp = { tl:[], br:[]};

            //x coordinate of the top left corner of the viewport
            vp.tl[0] = Math.abs(document.body.scrollLeft);

            //y coordinate of the top left corner the viewport
            vp.tl[1] = Math.abs(document.body.scrollTop);

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
            if (!!readJS.debug.overlay){
                readJS.removeOverlay("viewport_inview");
                var vui = document.createElement("DIV");
                vui.id = "viewport_inview";
                document.body.appendChild(vui);
                vui.style.position = "absolute";
                vui.style.left = vp.tl[0] + "px";
                vui.style.top = vp.tl[1] + "px";
                vui.style.width = vp.width + "px";
                vui.style.height = vp.height + "px";
                vui.style.background = "green";
                vui.style.opacity = "0.5";
                vui.style.zIndex = 9999;
                //console.log(vui);
            }

            //top left and bottom right coordinate points of the dom node
            var dn = { tl:[], br:[]};

            var bcr = domNode.getBoundingClientRect();

            //x coordinate of the top left corner of the dom node
            dn.tl[0] = bcr.left + parseInt(window.scrollX,10);

            //y coordinate of the top left corner of the dom node
            dn.tl[1] = bcr.top + parseInt(window.scrollY,10);

            //x coordinate of the top left corner of the dom node
            dn.br[0] = dn.tl[0] + bcr.width;

            //y coordinate of the top left corner of the dom node
            dn.br[1] = dn.tl[1] + bcr.height;

            if (!!readJS.debug.overlay){
                //highlight dom node
                readJS.removeOverlay("domnode_inview");
                var dui = document.createElement("DIV");
                dui.id = "domnode_inview";
                document.body.appendChild(dui);
                dui.style.position = "absolute";
                dui.style.left = dn.tl[0] + "px";
                dui.style.top = dn.tl[1] + "px";
                dui.style.width = bcr.width + "px";
                dui.style.height = bcr.height + "px";
                dui.style.background = "blue";
                dui.style.opacity = "0.5";
                dui.style.zIndex = 9999;
                //console.log(dui);
            }

            //element is not in viewport
            if (!readJS.inViewport(readJS.domNode)){
                return { "dom_node_inview_percent":0, "dom_node_viewport_percent": 0 };
            }
            readJS.activity.timeInView += readJS.timeInterval;

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

            if (!!readJS.debug.overlay){
                //highlight the overlap area
                readJS.removeOverlay("overlap_inview");
                var ui = document.createElement("DIV");
                ui.id = "overlap_inview";
                document.body.appendChild(ui);
                ui.style.position = "absolute";
                ui.style.left = overlap.tl[0] + "px";
                ui.style.top = overlap.tl[1] + "px";
                ui.style.width = width_of_overlap + "px";
                ui.style.height = height_of_overlap + "px";
                ui.style.background = "red";
                ui.style.opacity = "0.5";
                ui.style.zIndex = 9999;
                //console.log(ui);
            }
            readJS.activity.dnp = dnip;
            readJS.activity.vpp = dnvp;

            return { "dom_node_inview_percent":dnip, "dom_node_viewport_percent": dnvp };
        },
        handleScroll : function(){
            readJS.activity.scrolled = true;
            readJS.showScrollInfo();
        },
        handleClick : function(){
            readJS.activity.readingPoints += readJS.activity.increment;
            readJS.reactivate();
        },
        handleLoad : function(){
            readJS.domNode = document.querySelector(readJSConfig.el);
            readJS.domNode.addEventListener("click", readJS.handleClick);
            readJS.calculateCoordinates();
        },
        removeListeners : function(){
            window.removeEventListener("scroll", readJS.handleScroll);
            readJS.domNode.removeEventListener("click", readJS.handleClick);
            document.removeEventListener(readJS.getVisibilityProperties().eventName, readJS.handleVisibilityChange, false);
        }
    };
    readJS.inDebugMode();

    //add the scrolling debugging console
    if (!!readJS.debug.overlay){
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

    window.readJS = readJS;

})();
if (!!readJSConfig && !!readJSConfig.el && !!readJSConfig.cb){

    //scroll event listener
    window.addEventListener("scroll", readJS.handleScroll);

    //tab focus event listener
    document.addEventListener(readJS.getVisibilityProperties().eventName, readJS.handleVisibilityChange, false);

    //onload event listener
    window.addEventListener("load", readJS.handleLoad);

    //set it all in motion
    readJS.initialize(readJSConfig.cb);

}
