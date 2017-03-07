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
    var articleHTML = "<div class=\"clearfix\"><div class=\"wrap8\"><p>This is a readJS demo page for the single page app use case. Pretend this text is editorial content that you want your audience to read and engage with. The page view tracks that the user loaded the editorial content but we have no idea whether audience is reading that editorial content with page views. What if you could track that the audience is reading the editorial content instead? Sounds nice huh? That is where Read JS can help you. You might be wondering how does Read JS track the read verb?</p><p>No problem! I can tell you all about how this works. The first thing readJS does is become aware if it is inside the active browser tab. As soon as a user moves to another tab and context switches away Read JS stops tracking the read verb. Below are some other cool things that Read JS is aware of:</p><ul><li>It knows how much of the editorial content is in the viewport</li><li>It knows how much space the editorial content is occupying in the viewport</li><li>It knows how far down the page the user has scrolled</li><li>It knows how long the user has the editorial content in the viewport</li><li>It can know the scroll speed of a user</li></ul><p>As you can see there is quite a lot that Read JS can pick up on. On top of that the things listed above are all configurable to suit your different content types on different devices. For example you can have a configuration detecting the read verb of a news article on a mobile device be different from the configuration that detects the read verb of a news article on a desktop.</p><p>There are 2 main things you need to tell Read JS:</p><ol><li>The css selector of the DOM node containing the editorial content</li><li>A function for Read JS to call after it has detected the read verb.</li></ol><p>Just be sure to checkout all the other optional configuration parameters in the README.md to take full advantage of Read JS!</p></div><div class=\"wrap4\"><section class=\"pretend promo\">Pretend this is a promo</section><section class=\"pretend promo\">Pretend this is an advert</section></div></div>";
    function switchToArticle(){
        //do something
        document.querySelector(".content-body").innerHTML = articleHTML;
        readJS.turnOff();
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
        readJSConfig.debug.overlay = true;
        readJSConfig.debug.console = true;
        readJS.turnOn();
    }
    function handleClick(clickEvent){
        var element = clickEvent.target;
        // check if the the clickEvent.target is a link
        if ( element.nodeName === "A" ){
            //switch to article content
            switchToArticle();
            return true;
        } else { // otherwise we'll check its parent classes
            if ( !!element.parentElement ){
                // initialize the parentElement
                var parentElement = element.parentElement;
                while ( !!parentElement && parentElement.nodeName !== "BODY" ) {
                    // check if each parent element is a link
                    if ( parentElement.nodeName === "A" ){
                        //switch to article content
                        switchToArticle();
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
    document.querySelector(".card-list").addEventListener("click", handleClick);
    //start read JS
    readJS.turnOn();
})();