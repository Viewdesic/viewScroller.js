# viewScroller.js

![preview](https://github.com/Viewdesic/viewScroller.js/blob/master/images/viewScroller.jpg?raw=true)

![viewScroller.js version](http://img.shields.io/badge/viewScroller.js-v2.1.0-brightgreen.svg)
[![License](http://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)

This is small and easy to use solution that allows you to create fullpage scrolling websites.

- [Live demo](http://www.viewdesic.com/viewscroller/)

If you like it, please, donate it!

[![Donate](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FNKU5V3KF9X2G)

## Documentation

- [Introduction](https://github.com/viewdesic/viewScroller.js#introduction)
- [Compatibility](https://github.com/viewdesic/viewScroller.js#compatibility)
- [Installation](https://github.com/viewdesic/viewScroller.js#installation)
- [Libraries](https://github.com/viewdesic/viewScroller.js#libraries)
- [Define HTML structure](https://github.com/viewdesic/viewScroller.js#define-html-structure)
- [Navigation](https://github.com/viewdesic/viewScroller.js#navigation)
- [Initialization](https://github.com/viewdesic/viewScroller.js#initialization)
- [Parameters](https://github.com/viewdesic/viewScroller.js#parameters)
- [Functions](https://github.com/viewdesic/viewScroller.js#functions)
- [Callbacks](https://github.com/viewdesic/viewScroller.js#callbacks)
- [Classes](https://github.com/viewdesic/viewScroller.js#classes)
- [Layouts](https://github.com/viewdesic/viewScroller.js#layouts)
- [Reporting issues](https://github.com/viewdesic/viewScroller.js#reporting-issues)
- [Websites using viewScroller.js](https://github.com/viewdesic/viewScroller.js#websites-using-viewscrollerjs)
- [Donations](https://github.com/viewdesic/viewScroller.js#donations)
- [License & Copyrights](https://github.com/viewdesic/viewScroller.js#license--copyrights)

## Introduction

This plugin helps you create amazing one-page scrolling application with minimal effort.

Any suggestions about features and others acpects of this plugin would be appreciated!
Don't hesitate contact me at [my web site] (http://www.viewdesic.com/) or via e-mail.

## Compatibility

viewScroller.js works on all modern browsers (and some old ones for example IE 8-9) on any device like mobile phones, tablets and desktop computers.

It uses CSS3 transitions and jQuery animations depends on browser abilities. It's important because some old browsers like IE8 has no CSS3 support.

viewScroller.js has been tested also on Browserstack.

## Installation

You can just download .zip pack of this plugin from <a href="http://www.viewdesic.com/viewscroller/distribution/viewscroller.zip">my official viewScroller.js site</a>.

This pack includes all necessary files to start:
- [jQuery library](http://jquery.com/) (1.6 minimum)
- [jQuery mousewheel](https://plugins.jquery.com/mousewheel/) (3.1.13 minimum)
- [jQuery easing](https://github.com/gdsmith/jquery.easing) (1.3 minimum)
- viewScroller.css
- viewScroller.min.css
- viewScroller.js
- viewScroller.min.js
- index.html (main sample website using the viewScroller plugin)
- examples.css (styles for all examples)
+ examples dictionary (includes all examples)

###Moreover, you can install this plugin using:

```shell
// Bower
bower install viewscroller.js

// NuGet
PM> Install-Package viewScroller
```

## Libraries

If you want to use viewScroller.js remember that your HTML file must have `<!DOCTYPE html>` definition.

There are some other definitions you must declared in your HTML file:

**inside `<head>` section:**
```html
<link rel="stylesheet" type="text/css" href="viewScroller.css">
```
or minified version:
```html
<link rel="stylesheet" type="text/css" href="viewScroller.min.css">
```

**before the end of `<body>` section:**
```html
<script src="jquery-3.1.0.min.js"></script>
<script src="jquery.easing.min.js"></script>
<script src="jquery.mousewheel.min.js"></script>
```
or you can use CDN links for these jQuery libraries.

**after that you can put the main viewScroller.js script:**
```html
<script src="viewScroller.js"></script>
```
or minified version:
```html
<script src="viewScroller.min.js"></script>
```

## Define HTML structure

The main node of the structure is `<div class="mainbag"></div>` inside which you can declare rest of the structure.

This example defines HTML structure with 3 mainviews (marked with vs-anchor attribute ex.: 'firstview', 'secondview', 'thirdview') and 3 subviews inside second view (marked with vs-anchor attribute ex.: 'firstsubview', 'secondsubview', 'thirdsubview'):

```html
<div class="mainbag">
	<div vs-anchor="firstview" class="mainview">View 1</div>
	<div vs-anchor="secondview" class="mainview">
		<div class="subbag">
			<div vs-anchor="firstsubview" class="subview">Subview A</div>
			<div vs-anchor="secondsubview" class="subview">Subview B</div>
			<div vs-anchor="thirdsubview" class="subview">Subview C</div>
		</div>
	</div>
	<div vs-anchor="thirdview" class="mainview">View 3</div>
</div>
```

**Remember:**

- Each mainview div must have class `.mainview` and each subview div must have class `.subview`.
- All subviews must be placed inside `<div class="subbag"></div>` wrapper.
- Each view (mainview and subview) must have it's own `vs-anchor` attribute which is equivalent of ID attribute and it's value must be unique in the whole document. This attribute enables us to navigate views.
- You can also use `section` or `article` elements for mainview or subview sections

## Navigation

To create navigation over specific mainviews or subviews use `<a href>` elements, for example:

**For mainviews:**
```html
<a href="#firstview" class="vs-anchor">View 1</a>
<a href="#secondview" class="vs-anchor">View 2</a>
<a href="#thirdview" class="vs-anchor">View 3</a>
```

**For subviews:**
```html
<div class="vs-center-wrap">
	<div class="vs-center">
		Subview A
		<div class="pos">
			<input type="button" value="Previous subview" class="vs-subview-prev">
			<a href="#subview-a" class="vs-anchor">Subview A</a>
			<a href="#subview-b" class="vs-anchor">Subview B</a>
			<a href="#subview-c" class="vs-anchor">Subview C</a>
			<input type="button" value="Next subview" class="vs-subview-next">
		</div>
	</div>
	...
</div>
```

You must know that each `<a href ...>` element must have `vs-anchor` class.

To create navigation for changing mainviews you have to use `vs-mainview-prev` or `vs-mainview-next` class, for example:
```html
<button class="vs-mainview-prev">prev mainview</button>
<button class="vs-mainview-next">next mainview</button>
```
or
```html
<a href="#" class="vs-mainview-prev">prev mainview</a>
<a href="#" class="vs-mainview-next">next mainview</a>
```

To create navigation for changing subviews you have to use `vs-subview-prev` or `vs-subview-next` class, for example:
```html
<button class="vs-subview-prev">prev subview</button>
<button class="vs-subview-next">next subview</button>
```
or
```html
<a href="#" class="vs-subview-prev">prev subview</a>
<a href="#" class="vs-subview-next">next subview</a>
```

Moreover you can change views programmatically using built-in functions:

**Show next/previous mainview:**                           

`$.fn.viewScroller.showMainView('next' / 'prev');`                        
example:                                 
`$.fn.viewScroller.showMainView('next');`

**Show next/previous subview:**                           

`$.fn.viewScroller.showSubView(bag-number, 'next' / 'prev');`                      
example:                            
```javascript
var currentBagIndex = getCurrentViewIdx();
$.fn.viewScroller.showSubView(currentBagIndex, 'next' / 'prev');
```

**Show specific view using anchor name:**                     

`$.fn.viewScroller.showView(anchor);`                                    
example:                                                                    
`$.fn.viewScroller.showView('subview-b');`

## Center content of the view

You can center a content inside each view using predefined classes `.vs-center-wrap` and `.vs-center`:

```html
<div vs-anchor="firstview" class="mainview">
	<div class="vs-center-wrap">
        <div class="vs-center">
			View 1
		</div>
	</div>
...
</div>
```

or you can use classes from examples.css such as `.box` and `.info`:

```html
<div class="box">
	<div class="info">
		View 1
	</div>
</div>
```

For more information look at the examples' source code.
[the official project website] (http://www.viewdesic.com/viewscroller/index.html).

## Initialization

To start using viewScroller.js plugin you have to define it like this:

```javascript
$(document).ready(function() {
	$('.mainbag').viewScroller();
});
```

You can define many parameters of viewScroller.js directly inside the init function, for example:

```javascript
$('.mainbag').viewScroller({
	useScrollbar: false, // Use scrollbar to change views
	changeWhenAnim: false, // Change views when they are changing
	loopMainViews: true, // Change horizontal views (mainviews) in loop mode
	loopSubViews: true	// Change vertical views (subviews) in loop mode
});
```

## Parameters

List of all parameters to use inside the viewScroller.js init function:

```javascript
$('.mainbag').viewScroller({
	// Animation
	animSpeedMainView: 700, // Animation speed of mainviews: 0 - fastest
	animSpeedSubView: 700, // Animation speed of subviews: 0 - fastest
	animEffectMainView: 'easeInOutCubic', // Animation effect of mainviews change - jQuery (easing)
	animEffectSubView: 'easeInOutCubic', // Animation effect of subviews change - jQuery (easing)
	animEffectMainViewCss3: 'ease', // Animation effect of mainviews change - CSS3 (easing)
	animEffectSubViewCss3: 'ease', // Animation effect of subviews change - CSS3 (easing)

	// Steering
	useKeyboard: true, // Use keyboard to change views
	useScrollbar: false, // Use scrollbar to change views
	changeWhenAnim: true, // Change views when they are changing
	loopMainViews: false, // Change horizontal views (mainviews) in loop mode
	loopSubViews: false, // Change vertical views (subviews) in loop mode
	fitToView: true, // Will the browser fit to the closest view (works if the useScrollbar option is true)
	timeToFit: 1000, // Time between stop scrolling and start fitting to the closest view

	// Mainbag dimension
	fixedWidth: 0, // (in px) width of the mainbag - if 0 - then width = 100% of window (in px) = .mainbag { width: XXX }
	spaceMainBag: 0, // (in px) a total value of the right and the left CSS margin dimensions of the .mainbag, for example: if .mainbag { left: XXX, right: YYY} then spaceMainBag = XXX + YYY

	// Callbacks
	beforeChange: null, // Callback which is called before views change
	afterChange: null, // Callback which is called after views change
	beforeResize: null, // Callback which is called before browser window resize
	afterResize: null // Callback which is called after browser window resize
});
```

## Functions

List of all functions to change the most important parameters:

- setAnimSpeedMainView(value)

ex.: `$.fn.viewScroller.setAnimSpeedMainView(300);`

- setAnimSpeedSubView(value)

ex.: `$.fn.viewScroller.setAnimSpeedSubView(300);`

- setAnimEffectMainView(easing_func_name)

ex.: `$.fn.viewScroller.setAnimEffectMainView('easeInOutCubic');`

- setAnimEffectSubView(easing_func_name)

ex.: `$.fn.viewScroller.setAnimEffectSubView('easeInOutCubic');`

- setAnimEffectMainViewCss3(easing_func_name)

ex.: `$.fn.viewScroller.setAnimEffectMainViewCss3('ease');`

- setAnimEffectSubViewCss3(easing_func_name)

ex.: `$.fn.viewScroller.setAnimEffectSubViewCss3('ease');`

- setUseKeyboard(true/false)

ex.: `$.fn.viewScroller.setUseKeyboard(true);`

- setUseScrollbar(true/false)

ex.: `$.fn.viewScroller.setUseScrollbar(false);`

- setChangeWhenAnim(true/false)

ex.: `$.fn.viewScroller.setChangeWhenAnim(true);`

- setLoopSubViews(true/false)

ex.: `$.fn.viewScroller.setLoopSubViews(true);`

- setLoopMainViews(true/false)

ex.: `$.fn.viewScroller.setLoopMainViews(true);`

- setFitToView(true/false)

ex.: `$.fn.viewScroller.setFitToView(true);`

- setTimeToFit(value)

ex.: `$.fn.viewScroller.setTimeToFit(800);`

- setFixedWidth(value)

ex.: `$.fn.viewScroller.setFixedWidth(140);`

- setSpaceMainBag(value)

ex.: `$.fn.viewScroller.setSpaceMainBag(140);`

## Callbacks

There are four predefined callbacks.

You can use it to take some action, for example:

```javascript
$('.mainbag').viewScroller({
	beforeChange: function() { // Defines own callback before views change
		console.log('beforeChange fired!');
	},
	afterChange: function() { // Defines own callback after views change
		console.log('afterChange fired!');
	},
	beforeResize: function() { // Defines own callback before browser window resize
		console.log('beforeResize fired!');
	},
	afterResize: function() { // Defines own callback after browser window resize
		console.log('afterResize fired!');
	}
});
```

There is a possibility to cancel views change by returning `false` on the beforeChange function:

```javascript
$('.mainbag').viewScroller({
	beforeChange: function() {
		return false; // It means that views changing will be terminated
	}
});
```

## Predefined classes

List of all predefined classes:

```javascript
var mainbag_sel = '.mainbag', // mainbag class
	subbag_sel = '.subbag', // subbag class
	mainview_sel = '.mainview', // mainview class
	subview_sel = '.subview', // subview class
	anchor_sel = '.vs-anchor', // Any anchor class
	active_sel = '.vs-active', // Active view class
	center_sel = '.vs-center', // Any content class inside a view
	subviewprev_sel = '.vs-subview-prev', // Class for the element which changes current subview to the previous subview
	subviewnext_sel = '.vs-subview-next', // Class for the element which changes current subview to the next subview
	mainviewprev_sel = '.vs-mainview-prev', // Class for the element which changes current mainview to the previous mainview
	mainviewnext_sel = '.vs-mainview-next', // Class for the element which changes current mainview to the next mainview
	getallmainviews_sel = mainbag_sel + '>' + mainview_sel, // Select all mainviews from the mainbag
```

**Remember that if you want to change some of the classes inside viewScroller.js file you need to change it in your HTML structure also.**

## Layouts

You can use viewScroller.js in different layouts.

Look at these examples:
(.mainbag - class that includes HTML scrolling views stucture)

### Layout 1 ([Live demo](http://www.viewdesic.com/viewscroller/index.html))
**space from the left window corner: 100px, width of mainbag = rest space of the window**

![example](/images/1.gif)
```javascript
$('.mainbag').css({
	'left': '100px'
});
$.fn.viewScroller.setSpaceMainBag(100); // Sets 100px space
```

### Layout 2 ([Live demo](http://www.viewdesic.com/viewscroller/examples/panel-right.html))
**space from the right window corner: 100px, width of mainbag = rest space of the window**

![example](/images/2.gif)
```javascript
$('.mainbag').css({
	'right': '0px'
});
$.fn.viewScroller.setSpaceMainBag(100); // Sets 100px space
```

### Layout 3 ([Live demo](http://www.viewdesic.com/viewscroller/examples/panel-left-right.html))
**space from the right window corner: 100px, space from the left window corner: 100px, width of mainbag = rest space of the window**

![example](/images/3.gif)
```javascript
$('.mainbag').css({
	'right': '100px',
	'left': '100px'
});
$.fn.viewScroller.setSpaceMainBag(280); // Sets 200px space
```

### Layout 4 ([Live demo](http://www.viewdesic.com/viewscroller/examples/panel-right-fixed.html))
**space from the right window corner: 100px, width of mainbag is fixed = 350px**

![example](/images/4.gif)
```javascript
// Sets fixed width of mainview
$.fn.viewScroller.setFixedWidth(350);

// Sets dimension
$('.mainbag').css({
	'right': '100px'
});
$.fn.viewScroller.setSpaceMainBag(0); // Sets to 0 because of fixed width and right margin
```

Note: Only when the main HTML structure is set to the right, you must use setSpaceMainBag function with 0 value.

### Layout 5 ([Live demo](http://www.viewdesic.com/viewscroller/examples/panel-left-fixed.html))
**space from the left window corner: 100px, width of mainbag is fixed = 350px**

![example](/images/5.gif)
```javascript
// Sets fixed width of mainview
$.fn.viewScroller.setFixedWidth(350);

// Sets dimension
$('.mainbag').css({
	'left': '100px'
});
$.fn.viewScroller.setSpaceMainBag(100); // Sets to 100px because of fixed width and left margin
```

### Layout 6 ([Live demo](http://www.viewdesic.com/viewscroller/examples/basic.html))
**fullscreen, width of mainbag = 100% window width**

![example](/images/6.gif)
```javascript
$('.mainbag').viewScroller({
});
```

Note: When you use the fullscreen layout you don't have to declare any dimension parameters.

## Different height of views

You can define a custom height of each mainview.

To set the custom height of mainviews just use viewsHeight property, ex.:

([Live demo](http://www.viewdesic.com/viewscroller/examples/custom-height.html))

```javascript
$('.mainbag').viewScroller({
    viewsHeight: [200, 0, 300, 1600, ...]
	/* Sets height:
	* 200px for firstview
	* 0 - means 100vh for secondview
    * 300px for thirdview
	* 1600px for fourthview
	...
	*/
});
```

Note:
If you use viewsHeight property remember to declare height value for all the mainviews. Don't skip any of views.
If you want to set 100vh for some of the view, just put 0 value.

## Reporting issues

If you have some issue with this plugin just report it on the GitHub.

You can also use [jsFiddle] (https://jsfiddle.net/Viewdesic/50s38drr/) to reproduce this issue.

## Websites using viewScroller.js

If you want to use viewScroller.js plugin on your site, <a href="mailto:marcin.gierczak@viewdesic.com">let me know</a>.

I will put your site address listed below :)

## Donations

If you like viewScroller.js just donate it to keep these projects alive!

[![Donate](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FNKU5V3KF9X2G)

## License & Copyrights

[The MIT License] (http://opensource.org/licenses/MIT)

Copyright (c) 2016 Marcin Gierczak &lt;marcin.gierczak@viewdesic.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

###IMPORTANT!
**If you want to make any modification in js/css files remember to kept intact all copyright comments.**

**If you minify js/css files remember to put copyright information at the begining of these files.**
