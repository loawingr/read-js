# read-js
Detects reading behaviour on a web page.

## Motivation

Imagine you are at a bar with a friend.
Your friend tells you about this great news story that happened last week.
Next morning you sober up and you want to read up on the story your friend referred to.
So you go to Google and search.
Google returns you a list of choices but only one of the items in the list is what you are looking for.
You click on the first item in the list.
You quickly realize after 5-10 seconds that it's not what you were looking for so you hit the back button. Problem is there was a false positive logged as a page view by the analytics tool on that first content page.
You continue to look and go back and forth between list of content and story pages until you find what you are actually looking for.
You might have continued this pattern 3,4,5 times before finding what you are looking for but you also triggered 3,4,5 page views (ie. false positives) for the news organizations that you visited.

Those news organizations are saying alright we are great!
Look at all the page views we got!
People are reading a ton of our content!
In actual fact the page views were rejections of the content.
These false positives got me thinking about the following questions:

* Is there anything out there that could detect that a person read an article?
* And it accounted for when the user switches tabs?
* And it accounted for the occupied space of the article in the viewport?
* And it accounted the amount of time the user had the article in view?

I couldn't find anything out there so I built it.
It's called Read JS. :)

## How does the JS determine the user is active?

* The browser tab with Read JS running in it must be the active tab
* If the user clicks on the article text
* If the user highlights any of the article text
* If the user scrolls inside the webpage

## Getting started
Run the following commands at the root directory of read-js
```sh
$ npm install
$ npm run build
```

Open the test file in a web browser of your choosing
```sh
./build/test/reading.html
./build/test/scanning.html
```

There are 2 pieces of information that need to be defined at a minimum for:

  - The DOM node contains the article text
  - The callback function to invoke when the library has detected the user has read the article

```js
var readJSConfig = window.readingJSConfig || {};
if (!readJSConfig.el){ readJSConfig.el = ".story-body"; } //DOM node
if (!readJSConfig.cb){ readJSConfig.cb = function(){ //callback
    "use strict";
    alert("The article has been read");
}; }
```

The custom callback allows the developer to do whatever they want with the detection of the reading custom event. Maybe it sends data to Google Analytics or Adobe Analytics. This library is not tied to any backend services. Purely front end code.

## Configurable Settings

Example: Assuming average person can read 300 words per minute for this article
```js
	readJSConfig.activity.avgReadingSpeed = 300/60; //default is 300/60
```

Example: Score 100 reading points when the scrolls passed a vertical threshold point of the content or the content is occupying enough of the viewport. Score 100 polling points when the user clicks on the DOM node or scrolls on the page.
```js
	readJSConfig.activity.increment = 100; //default is 100
```

Example: 500 reading points need to accumulate/scored before reading/scanning action has been decided
```js
	readJSConfig.thresholds.readingPoint = 500; //default is 400
```
## Criteria before recalculating DOM node position relative to viewport

Example: Every 3 seconds the JS will check to see if the user did anything interesting like scroll, click, have enough of the viewport occupied. During idle time the readingPoints will increment by the timeInterval. In this example 
```js
	readJSConfig.timeInterval = 3; //default is 1.5 seconds
```

Example: The user must have 5 seconds of time where the readJSConfig.thresholds.viewport threshold is satisfied.
```js
	readJSConfig.thresholds.timeInView = 5; //JS uses word count and avgReadingSpeed to determine dynamically as default
```

Example: If readJSConfig.thresholds.timeInView is not defined then you can set a min and max for dynamic calculator
```js
	readJSConfig.thresholds.minTimeInView = 3; //default is 3 seconds
	readJSConfig.thresholds.maxTimeInView = 15; //default is 20 seconds
```

Example: The user must scroll passed 50% of the DOM node vertical height to satisfy the scroll depth threshold.
```js
    readJSConfig.thresholds.scrollDepth = 50%; //default is 0%
```

Example: In strict mode the thresholds.domNode & thresholds.viewport need to be satisfied to increment the timeInView

```js
	readJSConfig.strict = true; //default is false
```

## Criteria before reading points are scored

The browser tab with Read JS running must be the active tab

Example: User must have 30% of the viewport occupied by the content you want read/scanned before scoring
```js
	readJSConfig.thresholds.viewport = 30; //default is 25% 
```

Example: This feature is in here for the display ad viewability use case. The sample below is saying at least 30% of the advert is in view before awarding points equal to readJSConfig.activity.increment
```js
	readJS.thresholds.domNode = 30 //default is 30%
```

Example: User must accumulate 200 polling points before JS does mathematical calculations with DOM node positioning in viewport
```js
	readJSConfig.thresholds.domPolling = 200; //default is 100
```

Example: In strict mode the thresholds.domNode needs to be satisfied before readJS determines the content has been read/scanned
```js
	readJSConfig.strict = true; //default is false
```

## DOM Polling Degredation Curve

Read JS will use the formula below to make sure that it's slowing down it's polling activity as time passes without any indication (DOM node clicks, window scrolls) the user is reading. Note that timeInUnknownState is directly correlated with readJSConfig.timeInterval

```js
readJS.status.activity.pollingPoints += 100*Math.pow(0.9, readJS.status.activity.timeInUnknownState);
```

If readJSConfig.timeInterval is set at default setting of 1.5 seconds the cadence of DOM reading/calculations are as follows in seconds: 0, 3, 6, 10.5, 18 and then it goes to sleep.

## Debug Modes

Example: Want to see some log info in the developer tools?
```js
	readJSConfig.debug.statsConsole = true; //default is false
```

Example: Want to see some visual overlays to see the DOM calculations in action?
```js
	readJSConfig.debug.statsOverlay = true; //default is false
```

## General Public Methods

|Method       |Return Value Type|Parameters|Description                                      | Available |
|-------------|-----------------| -------- | ----------------------------------------------- | --------- |
| getConfig() | Object          | None     | Will return the readJSConfig object being used  | Yes       |
| setConfig() | Boolean         | None     | Will read from window.readJSConfig object       | Yes       |
| isOn()      | Boolean         | None     | Will tell you if readJS is on right now         | Yes       |
| turnOff()   | Boolean         | None     | Use for SPA app state changes to stop listening | Yes       |
| turnOn()    | Boolean         | None     | Use for SPA app state changes to start listening| Yes       |

## Single Page Apps (SPA) - Needs a Sample Page

You must tell ReadJS that it is in an SPA by:

```js
	readJSConfig.spa = true; //default is false
```

To support SPA's there are 3 methods that are exposed.

* Call turnOff() to stop readJS before changing app state to stop all listeners and DOM calculations
* Set new configuration in readJSConfig object based on the content type and reading/scanning behaviour you want to encourage.
* Call turnOn() to indicate the DOM node has been loaded and rendered and to start listening based on the new config object

## Browser Compatibility

| Device | OS | Browser | Compatible? |
|-------------------|-------------------|----------------|----------|
| Desktop | OSX El Capitan | Safari 9.1.1 | Yes |
| Desktop | OSX El Capitan | Chrome 56 | Yes |
| Desktop | OSX El Capitan | Firefox 43 | Yes |
| Desktop | Windows 8 64-bit | IE 10 | Partial |
| Desktop | Windows 8 64-bit | Chrome 54 | Yes |
| Desktop | Windows 8 64-bit | Firefox 51 | Yes |
| Desktop | Windows 8 64-bit | Opera 43 | Yes |
| Apple iPad Air 2 | iOS 9.3.1 | Safari | Yes |
| Apple iPad Air 2 | iOS 9.3.1 | Chrome 55 | Yes |
| Apple iPad Air 2 | iOS 9.3.1 | Firefox 6.1 | Yes |
| Apple iPad 2 | iOS 9.2.1 | Safari | Yes |
| Apple iPad 2 | iOS 9.2.1 | Chrome 56 | Yes |
| Apple iPad 2 | iOS 9.2.1 | Firefox 6.1 | Yes |
| Apple iPad 2 | iOS 9.2.1 | Opera Mini | No |
| Samsung Galaxy Tab 4 | Android 5.1.1 | Chrome 55+ | Partial |
| Samsung Galaxy Tab 4 | Android 5.1.1 | Firefox 51+ | Yes |
| iPhone 6 | iOS 10.2 | Safari | Yes |
| iPhone 6 | iOS 10.2 | Chrome 56 | Yes |
| iPhone 6 | iOS 10.2 | Firefox 6.1 git | Yes |
| Nexus 5 | Android 6.0.1 | Chrome 56+ | Yes |
| Nexus 5 | Android 6.0.1 | Firefox 51+| Yes |
| Nexus 5 | Android 6.0.1 | Opera Mini | No |

## Known Bugs

* Compatibility mode in Internet Explorer is currently not supported.
* On the Android Samsung Galaxy Tab 4 (5.1.1) in Google Chrome the zoom function confuses read JS.

## Version
1.1.3

## License

MIT