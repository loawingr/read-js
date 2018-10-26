(function(){
    "use strict";
    //check that the Amplitude SDK is loaded from the <head>

    const uri = document.location.href.split("?")[0];
    let qs = window.location.search;
    qs = qs.replace("?", "");

    //define the base event property payload to be sent to Amplitude
    const verbPayloadBase = {
        content:{
            title: document.title,
            url: uri,
            type: window.DataLayer.content.type,
            id: window.DataLayer.content.id
        }
    };

    if (document.referrer !== ""){
        verbPayloadBase.referrer = { url:document.referrer };
    }

    if (qs !== ""){
        let uid = qs.match(/^uid=([a-z0-9\-_A-Z]+)$/);
        if (uid !== null){
            uid = uid[1]; //reassign to the match
            //assign the user id
            window.amplitude.getInstance().setUserId(uid);
        }
    }

    //Send LOADED verb to Amplitude
    window.amplitude.getInstance().logEvent("LOADED", verbPayloadBase);

    //detect when the user clicks the next button and send a SELECTED event to window.amplitude
    const nextButton = document.getElementById("next-step");
    nextButton.addEventListener("click", ()=>{
        var selectedPayload = Object.assign({}, verbPayloadBase);
        selectedPayload.feature = {
            name:"nextButton",
            position:"bottom-right-corner"
        };
        window.amplitude.getInstance().logEvent("SELECTED", selectedPayload);
        window.history.back();
    });

    //define callback method to fire READ event to Amplitude
    const handleRead = (payload) =>{
        var readPayload = Object.assign({}, verbPayloadBase);
        readPayload.activity = {
            time:{
                onpage:payload.timeOnPage,
                inview:payload.timeInView
            }
        };
        console.log("Article has been read", readPayload);
        window.amplitude.getInstance().logEvent("READ", readPayload);
    };

    //check that if in an article and configure readJS
    if (window.DataLayer.content.type === "article"){
        window.readJSConfig = {
            thresholds : {
                domNode: 100,
                domPolling: 100,
                maxTimeInView: 20,
                minTimeInView: 3,
                readingPoint: 400,
                minVertical: 50,
                viewport:15
            },
            el: ".story",
            cb: handleRead,
            debug:{
                overlay:true,
                console:true
            }
        };
    }

    const handleScanned = (payload) => {
        var scannedPayload = Object.assign({}, verbPayloadBase);
        scannedPayload.referrer = Object.assign({}, scannedPayload.content);
        scannedPayload.content = {
            title:payload.domNode.querySelector(".headline").innerText,
            url:payload.domNode.getAttribute("href"),
            id:payload.domNode.dataset.contentid,
            type:"headline"
        };
        scannedPayload.activity = {
            time:{
                onpage:payload.timeOnPage,
                inview:payload.timeInView
            }
        };
        console.log("Headline has been scanned", scannedPayload);
        window.amplitude.getInstance().logEvent("SCANNED", scannedPayload);
    };

    //check that if in index and configure scannedJS
    if (window.DataLayer.content.type ==="index"){
        window.readJSConfig = {
            scanned: {
                thresholds : {
                    timeInView: 1.75,
                    readingPoint: 150,
                    maxCalls: 6
                },
                ignoreScrollDepth:true,
                strict: false,
                el: ".card.cardFullBleed, .card.cardDefault",
                cb: handleScanned,
                debug:{
                    overlay:true,
                    console:true
                }
            }
        };
    }
})();