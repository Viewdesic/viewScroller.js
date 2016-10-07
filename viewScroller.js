/* 
 * =================================================
 * viewScroller
 * Version: 2.0.4
 * Copyright (c) 2016 Marcin Gierczak
 * http://www.viewdesic.com
 * =================================================
 */

(function($) {
    $.fn.viewScroller = function(params) {

        // User's settings of this plugin
        if (typeof params === "object") {
            params = $.extend({
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
            }, params);
        }

        // Main functions
        $.fn.viewScroller.setAnimSpeedMainView = function(val) {
            params.animSpeedMainView = parseInt(val, 10) || 700;
        };

        $.fn.viewScroller.setAnimSpeedSubView = function(val) {
            params.animSpeedSubView = parseInt(val, 10) || 700;
        };

        $.fn.viewScroller.setAnimEffectMainView = function(effectName) {
            params.animEffectMainView = effectName;
        };

        $.fn.viewScroller.setAnimEffectSubView = function(effectName) {
            params.animEffectSubView = effectName;
        };

        $.fn.viewScroller.setAnimEffectMainViewCss3 = function(effectName) {
            params.animEffectMainViewCss3 = effectName;
        };

        $.fn.viewScroller.setAnimEffectSubViewCss3 = function(effectName) {
            params.animEffectSubViewCss3 = effectName;
        };

        $.fn.viewScroller.setUseKeyboard = function(isActive) {
            if (isActive === true || isActive === false)
                params.useKeyboard = isActive;
        };

        $.fn.viewScroller.setUseScrollbar = function(isActive) {
            changeView(allBagObjs[0], allBagObjs[0].viewsData.views[0], false, false);
            if (isActive === true || isActive === false)
                params.useScrollbar = isActive;
            changeCssOnScrollbarVisible();
            onResize(false, false, false);
        };

        $.fn.viewScroller.setChangeWhenAnim = function(isActive) {
            if (isActive === true || isActive === false)
                params.changeWhenAnim = isActive;
        };

        $.fn.viewScroller.setLoopMainViews = function(isActive) {
            if (isActive === true || isActive === false)
                params.loopMainViews = isActive;
        };

        $.fn.viewScroller.setLoopSubViews = function(isActive) {
            if (isActive === true || isActive === false)
                params.loopSubViews = isActive;
        };

        $.fn.viewScroller.setFitToView = function(isActive) {
            if (isActive === true || isActive === false)
                params.fitToView = isActive;
        };

        $.fn.viewScroller.setTimeToFit = function(val) {
            params.timeToFit = parseInt(val, 10) || 1000;
        };

        $.fn.viewScroller.setFixedWidth = function(val) {
            params.fixedWidth = parseInt(val, 10) || 0;
            setMainbagDimWhenFixed();
            calcViewsDimensions();
            onResize(false, true, false);
        };

        $.fn.viewScroller.setSpaceMainBag = function(val) {
            params.spaceMainBag = parseInt(val, 10) || 0;
            calcViewsDimensions();
            onResize(false, true, false);
        };

        $.fn.viewScroller.showMainView = function(dir) {
            if (dir === 'next') {
                showMainView(direction.NEXT);
            } else {
                showMainView(direction.PREV);
            }
        };

        $.fn.viewScroller.showSubView = function(bagNbr, dir) {
            if (dir === 'next') {
                showSubView(bagNbr, direction.NEXT);
            } else {
                showSubView(bagNbr, direction.PREV);
            }
        };

        $.fn.viewScroller.showView = function(anchor) {
            setHash(anchor, false);
        };

        // Main classes
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
            getallsubviews_sel = subbag_sel + '>' + subview_sel; // Select all subviews from the subbag

        // Types of bags (container for views)
        var bagType = {
            MAINBAG: 0, // Bag type for mainviews
            SUBBAG: 1 // Bag type for subviews
        };

        // Shows view direction DO NOT CHANGE!!!
        var direction = {
            NEXT: 1,
            PREV: -1
        };

        var timeoutId = 0, // DO NOT CHANGE!!! setTimeout of bindHash function
            timeouts = [], // DO NOT CHANGE!!! Array of setTimeouts for scrolling
            times = 0, // DO NOT CHANGE!!! How many times beforeChange event has been fired
            allBagObjs = [], // DO NOT CHANGE!!! Array of all bag objects (one mainbag and all subbags)
            byAnchor = false, // DO NOT CHANGE!!! Is this first time when views are changing by anchor
            currentMainView = '', // DO NOT CHANGE!!! Name of current view
            stopHashEvent = false, // DO NOT CHANGE!!!
            $window = $(window), // DO NOT CHANGE!!!
            $document = $(document), // DO NOT CHANGE!!! 
            windowHeight = $window.height(), // DO NOT CHANGE!!!
            windowWidth = $window.width(), // DO NOT CHANGE!!!
            isChanging = false, // DO NOT CHANGE!!!
            isStart = false, // DO NOT CHANGE!!! Declare hidden scrolling effect
            startTime = Date.now(), // DO NOT CHANGE!!! For mousewheel events handling
            stepViaX = 10, // Step to start scrolling a page by X axis (in px) - for touch only!
            stepViaY = 50, // Step to start scrolling a page by Y axis (in px) - for touch only!
            correctHeight = true, // Corrects height of each view when mobile browser's toolbar has been hidden/shown (this generates visual skip effect)
            css3Active = true; // CSS3 or jQuery animate will be used to change views

        // ----------------------------------------
        // START SELECTOR CACHE
        // ----------------------------------------

        // Selector cache function
        function SelectorCache() {
            var collection = {};

            function getFromCache(selector) {
                if (undefined === collection[selector]) {
                    collection[selector] = $(selector);
                }
                return collection[selector];
            }

            return {
                get: getFromCache
            };
        }

        // Creates Cache object
        var sel = new SelectorCache();

        // ----------------------------------------
        // START VIEWS LOGIC
        // ----------------------------------------

        // CSS3 support detection
        var detectCssTrans = function() {
            var es = document.createElement('p').style,
                cssTransSupport = 'transition' in es ||
                'WebkitTransition' in es ||
                'MozTransition' in es ||
                'msTransition' in es ||
                'OTransition' in es;
            return cssTransSupport; // true || false
        };

        // Adds indexOf function for IE8 only (polyfill)
        var addIndexOf = function() {
            if (!Array.prototype.indexOf) { // IE8 only - add indexOf function
                Array.prototype.indexOf = function(viewsData, start) {
                    var len = this.length;
                    for (var i = (start || 0), j = len; i < j; i++) {
                        if (this[i] === viewsData) {
                            return i;
                        }
                    }
                    return -1;
                };
            }
        };

        // Adds includes function to IE (polyfill) - ECMAScript 6
        var addIncludes = function() {
            if (!String.prototype.includes) {
                String.prototype.includes = function() {
                    'use strict';
                    return String.prototype.indexOf.apply(this, arguments) !== -1;
                };
            }
        };

        // Checks if resize event is fired by change mobile orientation
        var isMobile = function() {
            if (typeof window.orientation !== 'undefined') { // Smartphones usually support this property but not desktop browsers
                return true;
            }
            return false;
        };

        // Checks if orientation has been changed
        var isMobileOrientation = function() {
            if (Math.abs(windowHeight - $window.height()) > 100) {
                windowHeight = $window.height();
                return true;
            }
            if (Math.abs(windowWidth - $window.width()) > 100) {
                windowWidth = $window.width();
                return true;
            }
            return false;
        };

        // Gets view name
        var getViewName = function(idx, view) {
            var viewId = '#' + view.attr('vs-anchor');
            if (viewId === '#undefined') {
                viewId = '';
            }
            return idx + viewId;
        };

        // Gets all mainviews from mainbag
        var getAllMainViews = function() {
            var mainViews = [];
            sel.get(getallmainviews_sel).each(function(idx) {
                mainViews.push(getViewName(idx, $(this)));
            });
            return mainViews;
        };

        // Gets all subviews from specified mainview
        var getAllSubViews = function(mainViewIndex) {
            var subViews = [];
            // Gets specified (based on mainViewIndex) mainview from mainbag
            var getSpecifiedMainView = sel.get(getallmainviews_sel).slice(mainViewIndex, mainViewIndex + 1);
            // Gets all subviews from specified mainview
            getSpecifiedMainView.find(sel.get(getallsubviews_sel)).each(function(idx) {
                subViews.push(getViewName(idx, $(this)));
            });
            var subViewIndex = 0;
            while (subViewIndex < subViews.length) {
                subViewIndex++;
            }
            return subViews;
        };

        // Gets bag index which includes the view
        var getBagIndex = function(viewName) {
            var len = allBagObjs.length;
            for (var bagIndex = 0; bagIndex < len; bagIndex++) {
                var len2 = allBagObjs[bagIndex].viewsData.views.length;
                for (var j = 0; j < len2; j++) {
                    if (allBagObjs[bagIndex].viewsData.views[j].split('#')[1] === viewName) {
                        return bagIndex;
                    }
                }
            }
            return -1;
        };

        // Gets current bag index for the current url #id (view name)
        var getCurrentBagIndex = function(urlViewName) {
            var subviews = [];
            sel.get('div[vs-anchor=' + urlViewName + ']').find(sel.get(getallsubviews_sel)).each(function(idx) {
                subviews.push($(this).attr('vs-anchor'));
            });
            if (subviews.length > 0) {
                return getBagIndex(subviews[0]);
            } else if (subviews.length === 0) {
                sel.get('div[vs-anchor=' + urlViewName + ']').parents(sel.get(subbag_sel)).each(function(idx) {
                    subviews.push($(this).attr('class'));
                });
                if (subviews.length > 0) {
                    if (subviews[0].includes(subbag_sel.replace('.', ''))) {
                        return getBagIndex(urlViewName);
                    }
                }
            }
            return -1;
        };

        // Gets the current view id from URL
        var getCurrentViewIdx = function() {
            var id = '',
                currentBagIndex = 0;
            // Get current view id from URL
            if (window.location.hash.indexOf('#') > -1) {
                id = window.location.hash.replace('#', '');
                currentBagIndex = getCurrentBagIndex(id);
            }
            return currentBagIndex;
        };

        // Sets hash in the URL
        var setHash = function(id, addHash) {
            if (addHash === true) {
                stopHashEvent = true;
            } else {
                stopHashEvent = false;
            }
            window.location.hash = id;
        };

        // Creates bag object
        var createBagObj = function(container, views, bagType) {
            var newBagObj = new bagObject();
            newBagObj.setBagObj(container, views, bagType);
            return newBagObj;
        };

        // Creates bag objects for all subviews inside each mainview
        var createBagObjsForAllSubViews = function(mainViews) {
            var subViews = [],
                mainViewName = '',
                mainViewIndex = 0,
                subViewIndex = 0,
                len = mainViews.length;
            while (mainViewIndex < len) {
                subViews = getAllSubViews(mainViewIndex);
                mainViewName = mainViews[mainViewIndex].split('#')[1];
                if (subViews.length > 0) {
                    allBagObjs.push(createBagObj(subbag_sel + '|' + subViewIndex + '|' + mainViewName + '|' + mainViewIndex, subViews, bagType.SUBBAG));
                    subViewIndex++;
                }
                mainViewIndex++;
            }
        };

        // Creates bag objects for all views
        var createBagObjsForAllViews = function() {
            var mainViews = getAllMainViews();
            allBagObjs.push(createBagObj(mainbag_sel, mainViews, bagType.MAINBAG));
            createBagObjsForAllSubViews(mainViews);
        };

        // Changes view on the hash change
        var changeViewOnHashChange = function(e) {
            if (stopHashEvent === false && window.location.hash.indexOf('#') > -1) {
                var id = window.location.hash.replace('#', ''),
                    viewData = getViewDataForID(id);
                if (typeof viewData !== 'undefined' && viewData.length > 0) {
                    changeView(allBagObjs[viewData[0]], viewData[1], false, false);
                }
            }
            stopHashEvent = false;
        };

        // Looks for anchor id among all views in all bag objects and return the view data which has the same id
        var getViewDataForID = function(id) {
            var viewData = [],
                len = allBagObjs.length;
            for (var subObjNbr = 0; subObjNbr < len; subObjNbr++) {
                var views = allBagObjs[subObjNbr].viewsData.views,
                    bagType = allBagObjs[subObjNbr].viewsData.bagType,
                    len2 = views.length;
                for (var j = 0; j < len2; j++) {
                    if (views[j].indexOf('#') > -1) {
                        if (views[j].split('#')[1] === id) {
                            viewData.push(subObjNbr, views[j], bagType);
                            return viewData;
                        }
                    }
                }
            }
        };

        // Gets view index
        var getViewIndex = function(bagObj, direction) {
            var idx = bagObj.viewsData.views.indexOf(bagObj.viewsData.activeView) + direction;
            if ((params.loopSubViews && typeof bagObj.viewsData.views[idx] === 'undefined' && bagObj.viewsData.container.includes(subbag_sel)) ||
                (params.loopMainViews && typeof bagObj.viewsData.views[idx] === 'undefined' && bagObj.viewsData.container.includes(mainbag_sel))) {
                idx = idx < 0 ? bagObj.viewsData.views.length - 1 : 0;
            }
            return idx;
        };

        // Adds styles to the bag selectors when useScrollbar option is enabled
        var changeCssOnScrollbarVisible = function() {
            if (params.useScrollbar) {
                sel.get('html').css('overflow-y', 'scroll');
                sel.get('body').css('overflow-y', '');
            } else {
                sel.get('body').css('overflow-y', 'hidden'); // Needed due to Firefox when useScrollbar = false, not required in other browsers
                sel.get('html').css('overflow-y', 'hidden');
            }
        };

        // Checks if window has been resized
        var checkIfResize = function(animSpeed, isResize) {
            if (isResize) {
                return 1;
            } else {
                return animSpeed;
            }
        };

        // Sets views position
        var calcViewsPos = function(bagObj) {
            var viewsPos = [];
            bagObj.viewsData.viewsPos.length = 0;
            var len = bagObj.viewsData.views.length;
            for (var i = 0; i < len; i++) {
                if (bagObj.viewsData.bagType === bagType.SUBBAG) {
                    var width = sel.get(mainbag_sel).width();
                    if (params.fixedWidth === 0) {
                        width = $window.width() - params.spaceMainBag;
                    } else {
                        width = params.fixedWidth;
                    }
                    bagObj.viewsData.viewsPos.push(width * i);
                } else {
                    bagObj.viewsData.viewsPos.push($window.height() * i);
                }
            }
        };

        // Calculates the nearest view to the current scroll position
        var calcViewPos = function(arr) {
            var currPos = $window.scrollTop(),
                prevDiffPos = 0,
                diffPos = 0,
                getArrNbr = 0,
                len = arr.length;
            for (var i = 0; i < len; i++) {
                diffPos = Math.abs(arr[i] - currPos);
                if (diffPos < prevDiffPos) {
                    getArrNbr = i;
                }
                prevDiffPos = diffPos;
            }
            return getArrNbr; // Return index of views array includes the closest value to the current scroll position
        };

        // Sets height and width css properties of the mainviews and subviews
        var calcViewsDimensions = function() {
            var width = sel.get(mainbag_sel).width();
            if (params.fixedWidth === 0) {
                width = $window.width() - params.spaceMainBag;
            } else {
                width = params.fixedWidth;
            }
            sel.get(mainbag_sel).css('width', width + 'px');
            var height = $window.height();
            sel.get(mainview_sel).css('height', height + 'px');
            sel.get(subview_sel).css('width', width + 'px');
            sel.get(subbag_sel).each(function(idx) {
                $(this).css('width', width * $(this).find(subview_sel).length + 'px'); // How many subviews are in the subbag
            });
            if (css3Active) {
                sel.get(mainbag_sel).css('height', 'auto');
            }
        };

        // Adds own classes with subbag number
        var addClassesForSubBags = function() {
            sel.get(subbag_sel).each(function(idx) {
                $(this).addClass(subbag_sel.replace('.', '') + '-' + idx);
            });
        };

        // Adds wrappers for subbags (generates tag: <div style="..."'>here is a subbag</div>
        var addWrappersForSubBags = function() {
            sel.get(subbag_sel).wrap('<div style="overflow: hidden; height: 100%; width: 100%;"></div>');
        };

        // Sets dimension of mainbag includes rooms for menu right or left
        var setStartDimension = function() {
            if (params.fixedWidth === 0) {
                sel.get(mainbag_sel).css('width', sel.get(mainbag_sel).width() - params.spaceMainBag + 'px');
            } else {
                sel.get(mainbag_sel).css('width', params.fixedWidth + 'px');
            }
        };

        // Sets mainbag's position on absolute when it's' width is fixed
        var setMainbagDimWhenFixed = function() {
            if (params.fixedWidth > 0) {
                $(sel.get(mainbag_sel)).css({
                    'position': 'absolute'
                });
            }
        };

        // Sets active view (for vs-active class)
        var setActiveView = function() {
            $(sel.get(mainbag_sel)).find(sel.get(active_sel)).each(function(idx) {
                if (idx === 0) {
                    setHash($(this).attr('vs-anchor'));
                }
            });
        };

        // Shows next or prev subview
        var showSubView = function(currBagIndex, dir) {
            if (currBagIndex > -1) {
                // Prevent of scrolling views when they are still animate
                if (params.changeWhenAnim || (!params.changeWhenAnim && !isChanging)) {
                    changeView(allBagObjs[currBagIndex], '', false, false, dir);
                }
            }
        };

        // Shows next or prev mainview
        var showMainView = function(dir) {
            // Prevent of scrolling views when they are still animate
            if (params.changeWhenAnim || (!params.changeWhenAnim && !isChanging)) {
                changeView(allBagObjs[0], '', false, false, dir);
            }
        };

        // Scrolls views on x or y axis - via CSS3
        var translateElement = function(elem, viewPos, isResize, orientation, callback) {
            if (orientation === 'x') {
                var doResizeSubView = checkIfResize(params.animSpeedMainView, false);
                elem.css({
                    '-webkit-transition': 'all ' + doResizeSubView + 'ms ' + params.animEffectSubViewCss3 + ' 0ms',
                    '-moz-transition': 'all ' + doResizeSubView + 'ms ' + params.animEffectSubViewCss3 + ' 0ms',
                    '-o-transition': 'all ' + doResizeSubView + 'ms ' + params.animEffectSubViewCss3 + ' 0ms',
                    'transition': 'all ' + doResizeSubView + 'ms ' + params.animEffectSubViewCss3 + ' 0ms',
                    '-webkit-transform': 'translate3d(' + viewPos + 'px,0,0)',
                    '-moz-transform': 'translate3d(' + viewPos + 'px,0,0)',
                    '-o-transform': 'translate3d(' + viewPos + 'px,0,0)',
                    'transform': 'translate3d(' + viewPos + 'px,0,0)'
                });
            } else {
                var doResizeMainView = checkIfResize(params.animSpeedMainView, false);
                elem.css({
                    '-webkit-transition': 'all ' + doResizeMainView + 'ms ' + params.animEffectMainViewCss3 + ' 0ms',
                    '-moz-transition': 'all ' + doResizeMainView + 'ms ' + params.animEffectMainViewCss3 + ' 0ms',
                    '-o-transition': 'all ' + doResizeMainView + 'ms ' + params.animEffectMainViewCss3 + ' 0ms',
                    'transition': 'all ' + doResizeMainView + 'ms ' + params.animEffectMainViewCss3 + ' 0ms',
                    '-webkit-transform': 'translate3d(0,' + viewPos + 'px,0)',
                    '-moz-transform': 'translate3d(0,' + viewPos + 'px,0)',
                    '-o-transform': 'translate3d(0,' + viewPos + 'px,0)',
                    'transform': 'translate3d(0,' + viewPos + 'px,0)'
                });
            }
            // Calls when CSS3 transition is over
            elem.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        };

        // Scrolls views on x or y axis - via jQuery
        var animatejQuery = function(elem, viewPos, isResize, orientation, callback) {
            if (orientation === 'x') {
                elem.stop().animate({
                    scrollLeft: viewPos
                }, checkIfResize(params.animSpeedSubView, isResize), params.animEffectSubView, function() {
                    // Calls when jQuery animation is over
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            } else {
                elem.stop().animate({
                    scrollTop: viewPos
                }, checkIfResize(params.animSpeedMainView, isResize), params.animEffectMainView, function() {
                    // Calls when jQuery animation is over
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
        };

        // Shows specified view - this function manage of views change
        var changeView = function(bagObj, viewName, isResize, isScroll, direction) {
            if (typeof direction !== 'undefined') { // Show next or previous view
                viewName = bagObj.viewsData.views[getViewIndex(bagObj, direction)];
            }

            if (bagObj.viewsData.views.length > 0 && typeof viewName !== 'undefined') {
                var indexOfView = bagObj.viewsData.views.indexOf(viewName),
                    viewPosition = bagObj.viewsData.viewsPos[indexOfView],
                    viewSelector = bagObj.viewsData.container,
                    scrollPos = 0;

                // Releases beforeEvent
                if (isStart || (byAnchor === false && ((typeof isResize === 'undefined' && isScroll === false) || (bagObj.viewsData.activeView !== viewName && isResize === false)))) {
                    var stop = false;
                    if (typeof params.beforeChange === 'function') {
                        stop = params.beforeChange();
                    }
                    times++;
                    if (stop) { // Stop changing views if beforeChange function returns false
                        return false;
                    }
                }

                if (bagObj.viewsData.container === mainbag_sel) {
                    currentMainView = viewName.split('#')[1];
                } else {
                    if (!isStart) {
                        if (!isResize && currentMainView !== bagObj.viewsData.container.split('|')[2]) {
                            byAnchor = true; // Informs that changing view is fired by anchor
                            changeView(allBagObjs[0], bagObj.viewsData.container.split('|')[3] + '#' + bagObj.viewsData.container.split('|')[2], false, false);
                        }
                        currentMainView = bagObj.viewsData.container.split('|')[2];
                    }
                }

                if (!isResize && !isStart) {
                    if (window.location.hash !== viewName.split('#' [1])) {
                        setHash(viewName.split('#')[1], true); // Also changes hash to the current view, ex. view-2
                    }
                }

                if (bagObj.viewsData.bagType === bagType.SUBBAG) {
                    var container = viewSelector.split('|')[0],
                        containerNbr = viewSelector.split('|')[1];
                    viewSelector = sel.get((container + '-' + containerNbr)); // Gets subbag container from the DOM
                } else {
                    viewSelector = sel.get(viewSelector);
                }

                var elem = viewSelector; // Get current view container
                isChanging = true; // Prevent of scrolling views when they are still animate

                if (bagObj.viewsData.bagType === bagType.SUBBAG) {
                    if (!css3Active) {
                        // Scroll via jQuery animation
                        animatejQuery(elem.parent(), viewPosition, isResize, 'x', function() {
                            animationDone(isScroll, bagObj, viewName);
                        });
                    } else {
                        // Scroll via CSS3 transitions
                        translateElement(elem, viewPosition * -1, isResize, 'x', function() {
                            animationDone(isScroll, bagObj, viewName);
                        });
                    }
                } else {
                    if (!isScroll) {
                        unbindWheel();
                    }

                    if (params.useScrollbar || isScroll) {
                        if (css3Active) {
                            if (navigator.userAgent.includes('Firefox') || navigator.userAgent.includes('.NET') || navigator.userAgent.includes('MSIE') || navigator.userAgent.includes('Windows Phone')) {
                                elem = sel.get('html'); // for ie/firefox
                            } else {
                                elem = sel.get('body'); // for edge/chrome/opera/safari
                            }
                        }
                    }

                    if (params.useScrollbar || !css3Active) {
                        // Scroll via jQuery animation
                        unbindScroll();
                        animatejQuery(elem, viewPosition, isResize, 'y', function() {
                            animationDone(isScroll, bagObj, viewName);
                        });
                    } else {
                        // Scroll via CSS3 transitions
                        scrollPos = sel.get('body').scrollTop();
                        viewPosition = viewPosition - scrollPos; // Calculates position and moves to the nearest view
                        translateElement(elem, viewPosition * -1, isResize, 'y', function() {
                            animationDone(isScroll, bagObj, viewName);
                        });
                    }

                    if (!params.useScrollbar) {
                        bindWheel();
                    }
                }

                if (!isStart) {
                    bagObj.viewsData.activeView = viewName; // Sets name of the current view, for example: 1#view-2
                    byAnchor = false;
                }
            }
        };

        // Calls when jQuery or CSS3 animation is over
        var animationDone = function(isScroll, bagObj, viewName) {
            // Releases afterEvent
            if (times > 0) {
                if (typeof params.afterChange === 'function') {
                    params.afterChange();
                }
                times -= 1; // this variable counts how many beforeChange callback has been invoked
            }
            if (!params.useScrollbar && !isScroll) {} else {
                stopHashEvent = false;
                unbindResize();
                if ($window.height() !== windowHeight) {
                    onResize(false, false, false);
                    windowHeight = $window.height();
                }
                // This code changes view's height if  mobile browser is hiding/showing toolbar
                if (allBagObjs[0].viewsData.viewsPos.length > 1) {
                    if (correctHeight && isMobile() && $window.height() !== Math.abs(allBagObjs[0].viewsData.viewsPos[0] - allBagObjs[0].viewsData.viewsPos[1])) {
                        calcViewsDimensions();
                        var len = allBagObjs.length;
                        for (var i = 0; i < len; i++) {
                            calcViewsPos(allBagObjs[i]);
                            changeView(allBagObjs[i], allBagObjs[i].viewsData.activeView, true);
                        }
                    }
                }
                bindResize();
                bindScroll();
            }
            isChanging = false; // Prevent of scrolling views when they are changing
            isStart = false; // Clear hidden scrolling effect
        };

        // ----------------------------------------
        // START REGION EVENTS
        // ----------------------------------------

        // Adds click event to all anchors with 'vs-anchor' class declared
        var bindAnchor = function() {
            // If user click on this element, application will search for id of the anchor among all views inside all bag objects and for this id change view
            sel.get(anchor_sel).on('click', onAnchor);
        };

        // Sets anchor
        var onAnchor = function(e) {
            e.preventDefault();
            var id = $(this).attr('href').replace('#', ''),
                viewData = getViewDataForID(id);
            if (viewData && viewData.length > 0) {
                // Prevent of changing views when they are still animate
                if (params.changeWhenAnim || (!params.changeWhenAnim && !isChanging)) {
                    setHash(id);
                }
            }
        };

        // Adds hashchange event
        var bindHashChange = function() {
            $window.on('hashchange', changeViewOnHashChange);
        };

        // Removes hashchange event
        var unbindHashChange = function() {
            $window.off('hashchange', changeViewOnHashChange);
        };

        // Adds scroll event to outerbag selector
        var bindScroll = function() {
            $window.on('scroll', onScroll);
        };

        // Removes scroll event
        var unbindScroll = function() {
            $window.off('scroll', onScroll);
        };

        // Scrolls the window
        var onScroll = function(e) {
            // Sets hash name and current view
            var idx = calcViewPos(allBagObjs[0].viewsData.viewsPos); // Calculates which view is closer to the current scroll position
            clearTimeout(timeoutId);
            unbindHashChange();
            if (window.location.hash !== '#' + allBagObjs[0].viewsData.views[idx].split('#')[1]) {
                setHash(allBagObjs[0].viewsData.views[idx].split('#')[1], false); // Sets the hash to the closests view
                allBagObjs[0].viewsData.activeView = allBagObjs[0].viewsData.views[idx]; // Sets current view on mainbag
            }
            // Prevents run bind after hash change (there is very small timespan between hash change and hash bind)
            timeoutId = setTimeout(function() {
                bindHashChange();
            }, 10);
            // Fire the scroll
            Array.prototype.forEach.call(timeouts, function(elem) {
                clearTimeout(elem);
            });
            timeouts.length = 0;
            var len = allBagObjs[0].viewsData.viewsPos.length - 1;
            var currPos = $window.scrollTop();
            timeouts.push(setTimeout(function() {
                if (params.fitToView) {
                    // Let's scroll only when scrollTop position is other than current mainview
                    var go = true;
                    Array.prototype.forEach.call(allBagObjs[0].viewsData.viewsPos, function(elem) {
                        if (elem === currPos) {
                            go = false;
                        }
                    });
                    if (go) {
                        isStart = true;
                        changeView(allBagObjs[0], allBagObjs[0].viewsData.activeView, false, false);
                    }
                }
            }, params.timeToFit));
        };

        // Adds mousewheel event to mainbag selector
        var bindWheel = function() {
            $window.on('mousewheel', onMouseWheel);
        };

        // Removes mousewheel event
        var unbindWheel = function() {
            $window.off('mousewheel', onMouseWheel);
        };

        // Changes view depending on the mouse wheel direction
        var onMouseWheel = function(e) {
            var wheelTime = Date.now();
            // Calculates time for prevents scrolling many views at the same time (especially on MAC OS)
            var timeDiff = wheelTime - startTime;
            startTime = wheelTime;
            // Prevents scroll when ctrl key is pressed and when the time diff is less than 100 ms
            console.log(timeDiff);
            if (!e.ctrlKey && timeDiff > 100) {
                if (e.deltaY < 0) {
                    showMainView(direction.NEXT);
                } else {
                    showMainView(direction.PREV);
                }
            }
        };

        // Adds click on elements with next or prev class
        var bindPrevNextClickEvent = function() {
            sel.get(subviewprev_sel).each(function(idx) {
                $(this).on('click', function() {
                    currentBagIndex = getCurrentViewIdx();
                    if (currentBagIndex > -1) {
                        showSubView(currentBagIndex, direction.PREV);
                    }
                });
            });
            sel.get(subviewnext_sel).each(function(idx) {
                $(this).on('click', function() {
                    currentBagIndex = getCurrentViewIdx();
                    if (currentBagIndex > -1) {
                        showSubView(currentBagIndex, direction.NEXT);
                    }
                });
            });
            sel.get(mainviewprev_sel).each(function(idx) {
                $(this).on('click', function() {
                    showMainView(direction.PREV);
                });
            });
            sel.get(mainviewnext_sel).each(function(idx) {
                $(this).on('click', function() {
                    showMainView(direction.NEXT);
                });
            });
        };

        // Adds touch events
        var bindTouch = function() {
            var elem = window; // don't use jQuery because of argument of the touchAttachEvents function
            touchAttachEvents(elem);
        };

        // Adds resize event to the window selector
        var bindResize = function() {
            $window.on('resize', onResize);
        };

        // Adds resize event to the window selector
        var unbindResize = function() {
            $window.off('resize', onResize);
        };

        // Changes view depending on the window size
        var onResize = function(e, isRoomChange, isCallback) {
            if (!isMobile() || isRoomChange || (isMobile() && isMobileOrientation())) {
                // Releases beforeEvent
                if (typeof params.beforeResize === 'function' && typeof isCallback === 'undefined') {
                    params.beforeResize();
                }
                // Recalcutales dimensions of each view
                calcViewsDimensions();
                var len = allBagObjs.length;
                for (var i = 0; i < len; i++) {
                    calcViewsPos(allBagObjs[i]);
                    changeView(allBagObjs[i], allBagObjs[i].viewsData.activeView, true);
                }
                // Releases afterEvent
                if (typeof params.afterResize === 'function' && typeof isCallback === 'undefined') {
                    params.afterResize();
                }
            }
        };

        // Adds keyboard events
        var bindKeyboard = function() {
            $document.on('keydown', onKeyDown);
        };

        // Removes keyboard event
        var unbindKeyboard = function() {
            $document.off('keydown', onKeyDown);
        };

        // Changes views by keyboard
        var onKeyDown = function(e) {
            var UP_KEY_CODE = 38,
                DOWN_KEY_CODE = 40,
                LEFT_KEY_CODE = 37,
                RIGHT_KEY_CODE = 39,
                HOME_KEY_CODE = 36,
                END_KEY_CODE = 35,
                PAGEUP_KEY_CODE = 33,
                PAGEDOWN_KEY_CODE = 34,
                currentBagIndex = 0;

            var getKey = function(e) {
                if (window.event) {
                    return e.keyCode;
                } // IE
                else if (e.which) {
                    return e.which;
                } // Firefox/Opera
            };

            var keynum = getKey(e);

            // Gets the current view id from the URL
            currentBagIndex = getCurrentViewIdx();

            if (params.useKeyboard) {
                switch (keynum) {
                    case PAGEUP_KEY_CODE:
                    case UP_KEY_CODE:
                        if (!params.useScrollbar) {
                            showMainView(direction.PREV);
                        }
                        break;
                    case PAGEDOWN_KEY_CODE:
                    case DOWN_KEY_CODE:
                        if (!params.useScrollbar) {
                            showMainView(direction.NEXT);
                        }
                        break;
                    case RIGHT_KEY_CODE:
                        if (currentBagIndex > -1) {
                            showSubView(currentBagIndex, direction.NEXT);
                        }
                        break;
                    case LEFT_KEY_CODE:
                        if (currentBagIndex > -1) {
                            showSubView(currentBagIndex, direction.PREV);
                        }
                        break;
                    case HOME_KEY_CODE:
                        if (!params.useScrollbar) {
                            setHash(allBagObjs[0].viewsData.views[0].split('#')[1]);
                        }
                        break;
                    case END_KEY_CODE:
                        if (!params.useScrollbar) {
                            setHash(allBagObjs[0].viewsData.views[allBagObjs[0].viewsData.views.length - 1].split('#')[1]);
                        }
                        break;
                }
            }
        };

        // ----------------------------------------
        // START REGION TOUCHES
        // ----------------------------------------

        var touchable = 'createTouch' in document; // Checks if your browser support touches
        var touches = []; // Includes all touches vectors
        var posXGlobal = 0, // Contains pointer position on the x axis
            posYGlobal = 0; // Contains pointer position on the y axis

        // Cursor positions
        var cursorPos = {
            x: null,
            y: null
        };

        // Binds touch events
        var touchAttachEvents = function(elem) {
            if (window.PointerEvent) {
                elem.addEventListener('pointermove', onCursorMove, false);
            }
            if (touchable) {
                elem.addEventListener('touchstart', onTouchStart, false);
                elem.addEventListener('touchmove', onCursorMove, false);
                elem.addEventListener('touchend', onTouchEnd, false);
            }
        };

        // Sets current touch position
        var touchesChange = function(e) {
            touches = e.touches;

            if (touchable) {
                touches = e.touches;
                var len = touches.length;
                for (var i = 0; i < len; i++) {
                    var touch = touches[i];
                    cursorPos.x = getCursorPosX(touch);
                    cursorPos.y = getCursorPosY(touch);
                }
            } else {
                cursorPos.x = getCursorPosX(e);
                cursorPos.y = getCursorPosY(e);
            }

            return cursorPos.x + "|" + cursorPos.y;
        };

        // Gets coordinates of all touches
        var onTouchStart = function(e) {
            var pos = touchesChange(e).split('|');
            posXGlobal = parseInt(pos[0], 10);
            posYGlobal = parseInt(pos[1], 10);
        };

        // Changes views depending on touch direction
        var onTouchEnd = function(e) {
            var pos = touchesChange(e).split('|'),
                currentBagIndex = 0,
                stepX = stepViaX,
                stepY = stepViaY,
                afterPos0 = parseInt(pos[0], 10),
                afterPos1 = parseInt(pos[1], 10),
                beforePosXPrev = parseInt(posXGlobal + stepX, 10),
                beforePosXNext = parseInt(posXGlobal - stepX, 10),
                beforePosYPrev = parseInt(posYGlobal + stepY, 10),
                beforePosYNext = parseInt(posYGlobal - stepY, 10);

            // Checks which direction takes to scroll
            if (Math.abs(afterPos0 - posXGlobal) < Math.abs(afterPos1 - posYGlobal)) {
                // Scroll vertically
                if (afterPos1 > beforePosYPrev) {
                    // Scroll page up
                    if (!params.useScrollbar) {
                        showMainView(direction.PREV);
                    }
                } else if (afterPos1 < beforePosYNext) {
                    // Scroll page down
                    if (!params.useScrollbar) {
                        showMainView(direction.NEXT);
                    }
                }
            } else {
                // Scroll horizontally
                currentBagIndex = getCurrentViewIdx();
                if (currentBagIndex > -1) {
                    if (afterPos0 > beforePosXPrev) {
                        // Scroll page right
                        showSubView(currentBagIndex, direction.PREV);
                    } else if (afterPos0 < beforePosXNext) {
                        // Scroll page left 
                        showSubView(currentBagIndex, direction.NEXT);
                    }
                }
            }
        };

        // Sets current cursor position
        var onCursorMove = function(e) {
            if (!params.useScrollbar) {
                e.preventDefault ? e.preventDefault(): e.returnValue = false; // preventDefault - other than IE8, returnValue - IE8
            }

            if (touchable) {
                touches = e.touches;
                var len = touches.length;
                for (var i = 0; i < len; i++) {
                    var touch = touches[i];
                    cursorPos.x = getCursorPosX(touch);
                    cursorPos.y = getCursorPosY(touch);
                }
            } else {
                cursorPos.x = getCursorPosX(e);
                cursorPos.y = getCursorPosY(e);
            }
        };

        // Gets x cursor position
        var getCursorPosX = function(obj) {
            var pos = obj.clientX;
            return pos;
        };

        // Gets y cursor position
        var getCursorPosY = function(obj) {
            var pos = obj.clientY;
            return pos;
        };

        // ----------------------------------------
        // START INIT FUNCTION
        // ----------------------------------------
        
        // Init function
        var init = function() {
            addIndexOf();
            addIncludes();
            setStartDimension();
            // Checks if browser supports transitions
            if (!detectCssTrans()) {
                css3Active = false;
            }
            addClassesForSubBags();
            addWrappersForSubBags();
            calcViewsDimensions();
            changeCssOnScrollbarVisible();
            createBagObjsForAllViews();
            var len = allBagObjs.length;
            for (var i = 0; i < len; i++) {
                calcViewsPos(allBagObjs[i]);
            }
            // Corrects subviews position after first page load without any URL anchor and when the scrollbar is visible
            onResize(false, false, false);
            // Checks if scrolling by wheel is not activated
            if (!params.useScrollbar) {
                bindWheel();
            }
            setActiveView();
            // Sets appropriate view after page is loaded (based on hash name from URL)
            changeViewOnHashChange();
            bindAnchor();
            bindHashChange();
            bindScroll();
            bindResize();
            bindTouch();
            bindPrevNextClickEvent();
            // Checks if changing of views by keyboard is activated
            if (params.useKeyboard) {
                bindKeyboard();
            }
            setMainbagDimWhenFixed();
        };
        
        // ----------------------------------------
        // START MAIN BAG OBJECT
        // ----------------------------------------

        // Main bag object
        var bagObject = function() {
            // Views data
            var viewsData = {
                activeView: '', // Active view
                container: '', // Class name of the bag
                bagType: bagType.MAINBAG, // Type of bag (0 - mainbag or 1 - subbag) - important for scrolling
                views: [], // Names of views, for example: [0#view-1, 1#view-2. 2#view-3, 3#view-4, 4#view-5]
                viewsPos: [] // Positions of views
            };

            // Sets bag object
            var setBagObj = function(container, viewList, bagType) {
                viewsData.container = container;
                viewsData.views = viewList;
                viewsData.bagType = bagType;
                viewsData.activeView = viewsData.views[0];
            };

            return {
                setBagObj: setBagObj,
                viewsData: viewsData
            };
        };

        init();
    };
})(jQuery);
