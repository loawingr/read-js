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

## Getting started
Run the following commands at the root directory of read-js
```sh
$ npm install
$ grunt
```

Open the test file in a web browser of your choosing
```sh
./build/test/reading.html
```

There are 2 pieces of information that need to be defined for:

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

## Version
1.0.0

## License

MIT