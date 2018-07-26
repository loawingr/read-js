/* global readJS */
//define read JS config
var readJSConfig = {
    debug: {
        console: true,
        overlay: false
    },
    spa: true,
    thresholds: {
        timeInView: 5, //5 seconds of viewing time
        domNode: 15, //the 15% of dom node must be in viewport
        viewport: 50, //50% of the viewport must be occupied by the list of content
        minVertical: 70, //70% of the dom node must have been seen or scrolled passed
    },
    strict: true,
    el: ".card-list",
    cb: function(){
        "use strict";
        alert("The user scanned the list of cards");
    }
};
//basic SPA controller
(function(){
    "use strict";
    var LANDING_STATE = 1;
    var ARTICLE_STATE = 2;
    var articleHTML = "<div class=\"clearfix\"><div class=\"wrap8\"><p>This is a readJS demo page for the single page app use case. Pretend this text is editorial content that you want your audience to read and engage with. The page view tracks that the user loaded the editorial content but we have no idea whether audience is reading that editorial content with page views. What if you could track that the audience is reading the editorial content instead? Sounds nice huh? That is where Read JS can help you. You might be wondering how does Read JS track the read verb?</p><p>No problem! I can tell you all about how this works. The first thing readJS does is become aware if it is inside the active browser tab. As soon as a user moves to another tab and context switches away Read JS stops tracking the read verb. Below are some other cool things that Read JS is aware of:</p><ul><li>It knows how much of the editorial content is in the viewport</li><li>It knows how much space the editorial content is occupying in the viewport</li><li>It knows how far down the page the user has scrolled</li><li>It knows how long the user has the editorial content in the viewport</li><li>It can know the scroll speed of a user</li></ul><p>As you can see there is quite a lot that Read JS can pick up on. On top of that the things listed above are all configurable to suit your different content types on different devices. For example you can have a configuration detecting the read verb of a news article on a mobile device be different from the configuration that detects the read verb of a news article on a desktop.</p><p>There are 2 main things you need to tell Read JS:</p><ol><li>The css selector of the DOM node containing the editorial content</li><li>A function for Read JS to call after it has detected the read verb.</li></ol><p>Just be sure to checkout all the other optional configuration parameters in the README.md to take full advantage of Read JS!</p></div><div class=\"wrap4\"><section class=\"pretend promo\"><a href=\"#\">Pretend this is a promo</a></section><section class=\"pretend promo\"><a href=\"#\">Pretend this is an advert</a></section></div></div>";
    var landingHTML = document.querySelector(".content-body").innerHTML;
    var appState = LANDING_STATE;
    window.getArticleHTML = function(){
        return articleHTML;
    };
    window.getLandingHTML = function(){
        return landingHTML;
    };
    function switchToArticle(){
        //do something
        document.querySelector(".content-body").innerHTML = articleHTML;
        if(!readJS.turnOff()){
            alert("switchToArticle(): Error turning off read JS");
            return false;
        }
        readJSConfig.el = ".wrap8";
        readJSConfig.cb = function(){
            alert("article has been read");
        };
        readJSConfig.spa = true;
        readJSConfig.strict = false;
        readJSConfig.thresholds.domNode = 20;
        readJSConfig.thresholds.viewport = 40;
        readJSConfig.thresholds.timeInView = 13;
        readJSConfig.thresholds.minVertical = 50;
        readJSConfig.debug.overlay = false;
        readJSConfig.debug.console = true;

        if(!readJS.turnOn()){
            alert("switchToArticle(): Error turning on read JS");
            return false;
        }
        return true;
    }
    function switchToListing(){
        document.querySelector(".content-body").innerHTML = landingHTML;
        if(!readJS.turnOff()){
            alert("switchToListing(): Error turning off read JS");
            return false;
        }
        readJSConfig.el = ".card-list";
        readJSConfig.cb = function(){
            alert("the listing has been scanned");
        };
        readJSConfig.spa = true;
        readJSConfig.strict = false;
        readJSConfig.thresholds.domNode = 15;
        readJSConfig.thresholds.viewport = 50;
        readJSConfig.thresholds.timeInView = 5;
        readJSConfig.thresholds.minVertical = 70;
        readJSConfig.debug.overlay = false;
        readJSConfig.debug.console = true;

        if(!readJS.turnOn()){
            alert("switchToListing(): Error turning on read JS");
            return false;
        }
        return true;
    }
    function decide(){
        //switch to article content
        if (appState === LANDING_STATE){
            console.log("switch to article");
            switchToArticle();
            appState = ARTICLE_STATE;
        }else{
            console.log("switch to listing");
            switchToListing();
            appState = LANDING_STATE;
        }
    }
    function handleClick(clickEvent){
        var element = clickEvent.target;
        // check if the the clickEvent.target is a link
        if ( element.nodeName === "A" ){
            decide();
        } else { // otherwise we'll check its parent classes
            if ( !!element.parentElement ){
                // initialize the parentElement
                var parentElement = element.parentElement;
                while ( !!parentElement && parentElement.nodeName !== "BODY" ) {
                    // check if each parent element is a link
                    if ( parentElement.nodeName === "A" ){
                        decide();
                        return true;
                    } else {
                        // otherwise test the next parent element
                        parentElement = parentElement.parentElement;
                    }
                }
            } else {
                return false;
            }
        }
    }

    document.querySelector(".content-body").addEventListener("click", handleClick);
    //start read JS
    readJS.turnOn();
})();