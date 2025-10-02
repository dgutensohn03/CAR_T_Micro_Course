//Fullscreen v17.5.3.1, developed by LHT Learning.
//Latest change(s): Hotfix to further eradicate seamless play resume issue

//Uses and/or overwrites following Lectora variables and functions (incomplete list):
//trivExitPage(), ReFlow(), pgID in content page
//isSinglePagePlayerAvail(), getDevice(), is.iOS, ObjLayerActionGoTo() in trivantis.js
//DragMouseDown2(), DragMouseMove2(), DragItemWithin2() functions here overwrite similar functions (without 2) in trivantis-drag.js

var trueDoc = document; //The document element that matches the scope of the page elements.
var trueWindow = window; //The window element that matches the scope of the page elements.
var fullscreenAnchor = document.body; //The parent of where the anchored page elements go.
var fPageDiv; //The pagediv, used for sizing and placing the page.
var oldPageDiv;
var fPageDivFound = false;
var sPlay = false;
var anchorArray = new Array();
var anchorGroupArray = new Array();
var pinArray = new Array();
var trueJQ;
var version;
var bPosX = 0;
var bPosY = 0;
var docRoot; //The topmost document of the page. A scrolling event listener must be placed here for updates.
var groupCounter = 0;
var fsDebug = false;
var firstRun = false;
var haltFS = false; //Is the page already lined up to switch to another? Then don't add anything else.

trueDoc.body.style.opacity = "0.0";

//Detect if the course was published using Lectora 17.0.x or 17.1.x using the existence of triv$.
if (typeof triv$ !== 'undefined')
{
    trueJQ = triv$;
    version = "17.1";
    displayIfDebug("Fullscreen: Lectora 17.1 detected.");
} else
{
    trueJQ = jQuery;
    version = "17.0";
    displayIfDebug("Fullscreen: Lectora 17.0 detected.");
}

trueJQ('body').load( function() {
    trueJQ('body').contents().find("head")
      .append(trueJQ("<style type='text/css'>  body{display:block; overflow-y: auto; -webkit-overflow-scrolling: touch; position: absolute; top: 0; left: 0; right: 0; bottom: 0;}  </style>"));
});

//Detect if seamless play is enabled and adjust accordingly.
if (isSinglePagePlayerAvail())
{
    trueDoc = parent.document;
    trueWindow = parent.window;
    fullscreenAnchor = parent.document.body;
    sPlay = true;
    displayIfDebug("Fullscreen: Seamless play detected.");
}

trueDoc.body.style.width = "100%";
trueDoc.body.style.height = "100%";
trueDoc.body.style.margin = "0px 0px 0px 0px";
trueDoc.body.style.position = "absolute";

function firstRunFunc()
{
    var frTarget = trueJQ("#pageDIV");
    if (isSinglePagePlayerAvail())
    {
        frTarget = trueJQ(trueDoc.body).children("div[id^=page]")[0];
    }
    displayIfDebug("Fullscreen: firstRunFunc() begins.");
    var screenHeight = window.top.innerHeight ? window.top.innerHeight : trueJQ(window.top).height();
        var screenWidth = window.top.innerWidth ? window.top.innerWidth : trueJQ(window.top).width();
        displayIfDebug("Screen height: " + screenHeight + "px. Screen width: " + screenWidth + "px.");
        bPosY = (screenHeight - bHeight) / 2;
        if (trueJQ("#pageDIV").height() < screenHeight)
        {
            trueJQ(frTarget).css('top', ((screenHeight - trueJQ("#pageDIV").height()) / 2) + "px");
            trueDoc.body.style.overflowY = "hidden";
        }
        else
        {
            trueJQ(frTarget).css('top', 0);
            trueDoc.body.style.overflowY = "scroll";
        }
        bPosX = (screenWidth - bWidth) / 2;
        if (trueJQ("#pageDIV").width() < screenWidth)
        {
            trueJQ(frTarget).css('left', ((screenWidth - trueJQ("#pageDIV").width()) / 2) + "px");
            trueDoc.body.style.overflowX = "hidden";
        }
        else
        {
            trueJQ(frTarget).css('left', 0);
            trueDoc.body.style.overflowX = "scroll";
        }
        if (trueJQ("#pageDIV").height() < screenHeight && trueJQ("#pageDIV").width() < screenWidth)
        {
            trueJQ(trueDoc.body).css('background-position', bPosX + 'px ' + 0 + 'px');
        }
        else
        {
            if (trueJQ("#pageDIV").width() >= screenWidth)
            {
                bPosX = -((bWidth - trueJQ("#pageDIV").width()) / 2);
            }
            if (trueJQ("#pageDIV").height() >= screenHeight)
            {
                bPosY = -((bHeight - trueJQ("#pageDIV").height()) / 2);
            }
            trueJQ(trueDoc.body).css('background-position', bPosX + 'px ' + 0 + 'px');
        }

        trueDoc.body.style.opacity = "1.0";
        firstRun = true;
        displayIfDebug("Fullscreen: firstRunFunc() begins.");
}

//Update each frame
function update()
{
    if(fPageDiv != null)
    {
        displayIfDebug("Fullscreen: Update() begins.");
        if (getDevice() == "Desktop")
        {
            lectora17Fix();
        }

        var screenHeight = window.top.innerHeight ? window.top.innerHeight : trueJQ(window.top).height();
        var screenWidth = window.top.innerWidth ? window.top.innerWidth : trueJQ(window.top).width();
        displayIfDebug("Screen height: " + screenHeight + "px. Screen width: " + screenWidth + "px.");
        bPosY = (screenHeight - bHeight) / 2;
        if (trueJQ(fPageDiv).height() < screenHeight)
        {
            trueJQ(fPageDiv).css('top', ((screenHeight - trueJQ(fPageDiv).height()) / 2) + "px");
            trueDoc.body.style.overflowY = "hidden";
        }
        else
        {
            trueJQ(fPageDiv).css('top', 0);
            trueDoc.body.style.overflowY = "scroll";
        }
        bPosX = (screenWidth - bWidth) / 2;
        if (trueJQ(fPageDiv).width() < screenWidth)
        {
            trueJQ(fPageDiv).css('left', ((screenWidth - trueJQ(fPageDiv).width()) / 2) + "px");
            trueDoc.body.style.overflowX = "hidden";
        }
        else
        {
            trueJQ(fPageDiv).css('left', 0);
            trueDoc.body.style.overflowX = "scroll";
        }
        if (trueJQ(fPageDiv).height() < screenHeight && trueJQ(fPageDiv).width() < screenWidth)
        {
            trueJQ(trueDoc.body).css('background-position', bPosX + 'px ' + 0 + 'px');
        }
        else
        {
            if (trueJQ(fPageDiv).width() >= screenWidth)
            {
                bPosX = -((bWidth - trueJQ(fPageDiv).width()) / 2);
            }
            if (trueJQ(fPageDiv).height() >= screenHeight)
            {
                bPosY = -((bHeight - trueJQ(fPageDiv).height()) / 2);
            }
            trueJQ(trueDoc.body).css('background-position', bPosX + 'px ' + 0 + 'px');
        }

        trueDoc.body.style.backgroundImage = "url('" + bImage + "')";

        runPinArray();

        for (var i = 0; i < anchorArray.length; i++)
        {
            var thisName = trueDoc.getElementById(anchorArray[i].name);
            if (anchorArray[i].always)
            {
                if (/iPhone|iPod|iPad/.test(navigator.userAgent))
                {
                    thisName.style.position = "absolute";
                }
                else
                {
                    thisName.style.position = "fixed";
                }
                thisName.style.zIndex = "1000";
            }
            if (anchorArray[i].xAxis == "left")
            {
                if (/iPhone|iPod|iPad/.test(navigator.userAgent))
                {
                    if(sPlay)
                    {
                        trueJQ(thisName).css('left', trueDoc.body.scrollLeft + "px");
                    }
                    else
                    {
                        trueJQ(thisName).css('left', window.parent.pageXOffset + "px");
                    }
                    trueJQ(thisName).css('right', "auto");
                }
                else
                {
                    thisName.style.right = "auto";
                    thisName.style.left = "0px";
                    if (anchorArray[i].always)
                    {
                        thisName.style.left = "0px";
                    }
                }
            }
            else if (anchorArray[i].xAxis == "right")
            {
                if (/iPhone|iPod|iPad/.test(navigator.userAgent))
                {
                    if(sPlay)
                    {
                        trueJQ(thisName).css('left', (screenWidth + trueDoc.body.scrollLeft - trueJQ(thisName).width()) + "px");
                        trueJQ(thisName).css('right', "auto");
                    }
                    else
                    {
                        trueJQ(thisName).css('left', "auto");
                        trueJQ(thisName).css('right', "0px");
                    }
                }
                else
                {
                    thisName.style.right = "0px";
                    thisName.style.left = "auto";
                    if (trueJQ(fPageDiv).width() > screenWidth)
                    {
                        thisName.style.left = (trueJQ(fPageDiv).width() - trueJQ(thisName).width()) + "px";
                    }
                    if (trueJQ(fPageDiv).height() > screenHeight)
                    {
                        thisName.style.right = "0px";
                        thisName.style.left = "auto";
                    }
                }
            }
            else if (anchorArray[i].xAxis == "center")
            {
                if (/iPhone|iPod|iPad/.test(navigator.userAgent))
                {
                    if(sPlay)
                    {
                        trueJQ(thisName).css('left', (trueDoc.body.scrollLeft + ((screenWidth - trueJQ(thisName).width()) / 2)) + "px");
                    }
                    else
                    {
                        trueJQ(thisName).css('left', (window.parent.pageXOffset + ((screenWidth - trueJQ(thisName).width()) / 2)) + "px");
                    }
                    trueJQ(thisName).css('right', "auto");
                }
                else
                {
                    thisName.style.right = "auto";
                    trueJQ(thisName).css('left', ((screenWidth - trueJQ(thisName).width()) / 2) + "px");
                    if (trueJQ(fPageDiv).width() > screenWidth && anchorArray[i].always)
                    {
                        thisName.style.left = ((screenWidth / 2) - (trueJQ(thisName).width() / 2)) + "px";
                    }
                }
            }

            if (anchorArray[i].yAxis == "top")
            {
                if (/iPhone|iPod|iPad/.test(navigator.userAgent))
                {
                    if(sPlay)
                    {
                        trueJQ(thisName).css('top', trueDoc.body.scrollTop + "px");
                    }
                    else
                    {
                        trueJQ(thisName).css('top', window.parent.pageYOffset + "px");
                    }
                    trueJQ(thisName).css('bottom', "auto");
                }
                else
                {
                    thisName.style.bottom = "auto";
                    thisName.style.top = "0px";
                    if (anchorArray[i].always)
                    {
                        thisName.style.top = "0px";
                    }
                }
            }
            else if (anchorArray[i].yAxis == "bottom")
            {
                if (/iPhone|iPod|iPad/.test(navigator.userAgent))
                {
                    if(sPlay)
                    {
                        trueJQ(thisName).css('top', trueDoc.body.scrollTop + screenHeight - trueJQ(thisName).height() + "px");
                    }
                    else
                    {
                        trueJQ(thisName).css('top', window.parent.pageYOffset + screenHeight - trueJQ(thisName).height() + "px");
                    }
                    trueJQ(thisName).css('bottom', "auto");
                }
                else
                {
                    thisName.style.bottom = "0px";
                    thisName.style.top = "auto";
                    if (trueJQ(fPageDiv).width() > screenWidth)
                    {
                        thisName.style.bottom = "0px";
                        thisName.style.top = "auto";
                    }
                }
            }
            else if (anchorArray[i].yAxis == "center")
            {
                if (/iPhone|iPod|iPad/.test(navigator.userAgent))
                {
                    if(sPlay)
                    {
                        trueJQ(thisName).css('top', (trueDoc.body.scrollTop + ((screenHeight - trueJQ(thisName).height()) / 2)) + "px");
                    }
                    else
                    {
                        trueJQ(thisName).css('top', (window.parent.pageYOffset + ((screenHeight - trueJQ(thisName).height()) / 2)) + "px");
                    }
                    trueJQ(thisName).css('bottom', "auto");
                }
                else
                {
                    thisName.style.bottom = "auto";
                    trueJQ(thisName).css('top', ((screenHeight - trueJQ(thisName).height()) / 2) + "px");
                    if (trueJQ(fPageDiv).height() > screenHeight && anchorArray[i].always)
                    {
                        thisName.style.top = ((screenHeight / 2) - (trueJQ(thisName).height() / 2)) + "px";
                    }
                }
            }
        }
    }
    displayIfDebug("Fullscreen: Update() finished.");
}

//Helper function for cross-browser scrollTop
function getScrollTop()
{
    return trueWindow.scrollY || trueDoc.documentElement.scrollTop;
}

//Our custom ReFlow to account for how fullscreen.js behaves
function ReFlow()
{
    displayIfDebug("Fullscreen: Overwritten ReFlow() begins.");
    if (getDevice() == "Desktop" || getDevice() == "Tablet")
    {
        var left = (winW > trueJQ(fPageDiv).width()) ? (winW - trueJQ(fPageDiv).width()) / 2 : 0
        if (pageLayer)
        {
            pageLayer.moveTo(left, 0);
            if (version == "17.1")
            {
                if (!bScaleToWindow)
                    pageLayer.hasMoved = true;
            } 
            else
            {
                pageLayer.hasMoved = true;
            }
            pageLayer.newX = left;
            pageLayer.newY = 0;
            if (version == "17.1")
            {
                fillBrowser();
            }
            adjustAllObjectsForFixedPosition();
            setfixed();
        }
        if(firstRun){update();}else{firstRunFunc();}
        if (typeof dragMgr != 'undefined' && typeof fPageDiv != 'undefined') { dragMgr.offsetDrag(trueJQ(fPageDiv).position().left, trueJQ(fPageDiv).position().top) };
    } else
    {
        normalReflow();
    }
    setfixed(); //anchoring
    displayIfDebug("Fullscreen: Overwritten ReFlow() finished.");
}

//Pins objects to their specified position each frame
function runPinArray()
{
    displayIfDebug("Fullscreen: runPinArray() begins.");
    if (fPageDiv)
    {
        for (var i = 0; i < pinArray.length; i++)
        {
            var thisName = trueDoc.getElementById(pinArray[i]);

            thisName.style.left = trueJQ(fPageDiv).position().left + thisName.EX + "px";
            thisName.style.top = trueJQ(fPageDiv).position().top + thisName.WY + "px";
        }
    }
    displayIfDebug("Fullscreen: runPinArray() finished.");
}

//Class for pinned object
function pinThis(name, EXE, WYE)
{
    trueDoc.getElementById(name).EX = EXE;
    trueDoc.getElementById(name).WY = WYE;
    pinArray.push(name);
    fullscreenAnchor.appendChild(trueDoc.getElementById(name));
}

//Class for anchor object
function anchorObject(Name, YAxis, XAxis, Always)
{
    this.name = Name;
    this.xAxis = XAxis;
    this.yAxis = YAxis;
    this.always = Always;
}

//Class for anchorGroupObject
function anchorGroupObject(TName, Always, AnchorType, TWidth, THeight)
{
    this.tName = TName;
    this.always = Always;
    this.anchorType = AnchorType;
    this.tWidth = TWidth;
    this.tHeight = THeight;
}

function anchorGroup(tName, always, anchorType, tWidth, tHeight)
{
    if(!haltFS)
    {
        if (fPageDivFound)
        {
            anchorGroup2(tName, always, anchorType, tWidth, tHeight);
        }
        else
        {
            anchorGroupArray.push(new anchorGroupObject(tName, always, anchorType, tWidth, tHeight));
        }
        displayIfDebug("Fullscreen: Group " + tName + " registered to Fullscreen.");
    }
}

function anchorGroup2(tName, always, anchorType, tWidth, tHeight)
{
    var tempGroup = document.createElement("div");
    tempGroup.id = "fsTempGroup" + groupCounter;
    tempGroup.style.width = tWidth;
    tempGroup.style.height = tHeight;
    tempGroup.style.position = "absolute";
    tempGroup.style.pointerEvents = "none";
    fPageDiv.appendChild(tempGroup);
    for (var i = 0; i < window[tName].childArray.length; i++)
    {
        if (window[window[tName].childArray[i]].isGrp)
        {
            addAllInGroup(window[window[tName].childArray[i]], tempGroup);
        }
        else
        {
            var tempElement = trueDoc.getElementById(window[tName].childArray[i]);
            tempElement.style.pointerEvents = "auto";
            tempGroup.appendChild(tempElement);
        }
    }
    var func = "anchor" + anchorType;
    window[func]("fsTempGroup" + groupCounter, always);
    displayIfDebug("Fullscreen: Group " + tName + " anchored as fsTempGroup" + groupCounter);
    groupCounter++;
}

function fPageDivFoundFunction()
{
    if(!haltFS)
    {
        for (var i = 0; i < anchorGroupArray.length; i++)
        {
            anchorGroup2(anchorGroupArray[i].tName, anchorGroupArray[i].always, anchorGroupArray[i].anchorType, anchorGroupArray[i].tWidth, anchorGroupArray[i].tHeight)
        }
    }
}

function appendToGroup(tempID, addTo)
{
    var tempElement = trueDoc.getElementById(tempID);
    addTo.appendChild(tempElement);
}

function addAllInGroup(ogGroup, destGroup)
{
    for (var i = 0; i < ogGroup.childArray.length; i++)
    {
        if (window[ogGroup.childArray[i]].isGrp)
        {
            addAllInGroup(window[window[name].childArray[i]], tempGroup);
        }
        else
        {
            var tempElement = trueDoc.getElementById(ogGroup.childArray[i]);
            tempElement.style.pointerEvents = "auto";
            destGroup.appendChild(tempElement);
        }
    }
}

//fullscreen.js's 9 anchor functions
function anchorTopLeft(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "top", "left", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to top left.");
    }
}
function anchorTopRight(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "top", "right", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to top right.");
    }
}
function anchorBottomLeft(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "bottom", "left", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to bottom left.");
    }
}
function anchorBottomRight(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "bottom", "right", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to bottom right.");
    }
}
function anchorCenterLeft(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "center", "left", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to center left.");
    }
}
function anchorCenterRight(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "center", "right", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to center right.");
    }
}
function anchorTopCenter(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "top", "center", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to top center.");
    }
}
function anchorBottomCenter(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "bottom", "center", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to bottom center.");
    }
}
function anchorCenterCenter(name, always)
{
    if(!haltFS)
    {
        anchorArray.push(new anchorObject(name, "center", "center", always));
        fullscreenAnchor.appendChild(trueDoc.getElementById(name));
        displayIfDebug("Fullscreen: Object " + name + " registered to center.");
    }
}

//Anchor an image to top or bottom of window, with the width of the window. BG should ideally be a repeatable image (or solid color).
function anchorHeaderFooter(fsBGName, location)
{
    fsBG = trueDoc.getElementById(fsBGName);
    fsBG.style.position = "fixed";
    fsBG.style.left="0px";
    if(location=="header")
    {
        fsBG.style.top="0px";
    }
    else if (location=="footer")
    {
        fsBG.style.bottom="0px";
    }
    fsBG.style.width="100%";
    fullscreenAnchor.appendChild(fsBG);
}

//Lectora's normal reflow function. Used on phones.
function normalReflow()
{
    findWH()
    var pageEleWidth = pageLayer.ele.clientWidth;
    if ((is.ieAny || is.edge) && pageLayer.ele.clientWidth == 0 && isSinglePagePlayerAvail()) pageEleWidth = parseFloat(GetPageWidth());
    if (pageLayer)
    {
        var left = (winW > pageEleWidth) ? (winW - pageEleWidth) / 2 : 0
        transformScale = (winW > pageEleWidth) ? 1 : (winW / pageEleWidth)
        if (is.isMobile.any())
            left = 0
        if (is.iOS && isInIframe(getDisplayWindow(), 0))
            transformScale = (getScreenWidth() > pageEleWidth) ? 1 : (getScreenWidth() / pageEleWidth)
        var transSty = calculateScale();
        pageLayer.moveTo(left, 0);
        pageLayer.hasMoved = true;
        pageLayer.newX = left;
        pageLayer.newY = 0;
        if (CanScale())
        {
            pageLayer.styObj.transform = transSty;
            pageLayer.styObj.webkitTransform = transSty;
        } else
            transformScale = 1;
        pageLayer.styObj.transformOrigin = '0 0';
        adjustAllObjectsForFixedPosition();
    }
    setfixed();
}

//Fix required on desktop only
function lectora17Fix()
{
    displayIfDebug("Fullscreen: Lectora17fix() begins.");
    setfixed();
    if (bImage != "")
    {
        if (bRepeat)
        {
            trueDoc.body.style.backgroundRepeat = "repeat";
        }
        else
        {
            trueDoc.body.style.backgroundRepeat = "no-repeat";
        }
    }
    else
    {
        bHeight = trueJQ(fPageDiv).height() + 25;
        bWidth = trueJQ(fPageDiv).width() + 25;
    }
    if (typeof dragMgr != 'undefined')
    {
        dragMgr.mouseDown = DragMouseDown2;
        dragMgr.mouseMove = DragMouseMove2;
    }
    displayIfDebug("Fullscreen: Lectora17fix() finished.");
}

//Initialize the page when it's ready
trueJQ(trueDoc).ready(function ()
{
    displayIfDebug("Fullscreen: On Ready function begins.");
    if (is.iOS || sPlay)
    {
        docRoot = window.top.document;
    }
    else
    {
        docRoot = window;
    }
    if (bImage != "")
    {
        if (bRepeat)
        {
            trueDoc.body.style.backgroundRepeat = "repeat";
        }
        else
        {
            trueDoc.body.style.backgroundRepeat = "no-repeat";
        }
    }
    else
    {
        bHeight = trueJQ(fPageDiv).height() + 25;
        bWidth = trueJQ(fPageDiv).width() + 25;
    }
    if (bColor != "")
    {
        trueDoc.body.style.backgroundColor = bColor;
    }
    trueJQ(docRoot).scroll(function ()
    {
        update();
    });
    if (version == "17.0")
    {
        trueJQ(docRoot).scrollstart(function ()
        {
            update();
        });
    }
    setInterval(function () { update() }, 50);
    displayIfDebug("Fullscreen: On Ready function finished.");
});

//Need to overwrite the below three functions in trivantis-drag.js or else drag and drops won't work :(
function DragMouseDown2(x, y, e)
{
    x -= trueJQ(fPageDiv).position().left;
    y -= trueJQ(fPageDiv).position().top;
    for (var i = this.arrDragItems.length - 1; i >= 0; i--)
    {
        var dItem = this.arrDragItems[i]
        if (DragItemWithin2(x, y, dItem))
        {
            var targ;
            if (!e) var e = getDisplayWindow().event;
            if (e.target) targ = e.target;
            else if (e.srcElement) targ = e.srcElement;
            while (targ &&
                (!targ.id || targ.id.indexOf(dItem.name) == -1) &&
                (!targ.name || targ.name.indexOf(dItem.name) == -1))
            {
                targ = targ.parentNode
            }
            if (!targ)
                return false;

            if (targ.disabled)
                return false;
            this.item = dItem
            this.offX = (x / transformScale) - this.item.lyr.objLyr.x;
            this.offY = (y / transformScale) - this.item.lyr.objLyr.y;
            if (this.item.lyr.dropObj)
            {
                this.item.lyr.dropObj.dragItem = null
                this.item.lyr.dropObj = null
                this.onDragDrop() // Clear
            }
            this.active = true
            break
        }
    }
    if (!this.active) return false
    else return true
}

function DragMouseMove2(x, y)
{
    if (!this.active) return false
    else
    {
        this.item.lyr.objLyr.moveTo(((x - trueJQ(fPageDiv).position().left) / transformScale) - this.offX, ((y - trueJQ(fPageDiv).position().top) / transformScale) - this.offY)
        return true
    }
}

function DragItemWithin2(x, y, tempObje)
{
    if (x >= tempObje.lyr.objLyr.x * transformScale &&
        y >= tempObje.lyr.objLyr.y * transformScale &&
        x <= ((tempObje.lyr.objLyr.x + tempObje.lyr.objLyr.w) * transformScale) &&
        y <= ((tempObje.lyr.objLyr.y + tempObje.lyr.objLyr.h) * transformScale))
        return true;
    else
        return false;
}

//Overwrite function in page files to properly deal with anchored objects before page change, especially in seamless play.
var origtrivExitPage = trivExitPage;
trivExitPage = function(newPage, bFeedback)
{
    displayIfDebug("Fullscreen: Overwritten trivExitPage() begins.");
    if(newPage != "ObjLayerActionExit()")
    {
        fullscreenRemoveAll();
        anchorArray = new Array();
        anchorGroupArray = new Array();
        pinArray = new Array();
        fPageDiv = undefined;
        fPageDivFound = false;
        trueDoc.addEventListener('fReady', function (e) { fPageDivFoundFunction(); }, false);
        fDivChecking = setInterval(function () { fsCheckIfReady(); }, 16);
    }
        origtrivExitPage.call(this, newPage, bFeedback);
    displayIfDebug("Fullscreen: Overwritten trivExitPage() finished.");
}

//Correctly handle browser's forward and back buttons in seamless play.
if (sPlay)
{
    trueWindow.addEventListener("popstate", function (e)
    {
        for (var i = 0; i < anchorArray.length; i++)
        {
            trueJQ("#" + anchorArray[i].name, trueDoc).remove();
        }
        for (var i = 0; i < pinArray.length; i++)
        {
            trueJQ("#" + pinArray[i], trueDoc).remove();
        }
    });
}

//Changes the variables and 'resets' the page.
function changeFSSettings(newImage, newColor, newWidth, newHeight, newRepeat)
{
    displayIfDebug("Fullscreen: changeFSSettings() begins.");
    bImage = newImage;
    bColor = newColor;
    bHeight = newHeight;
    bWidth = newWidth;
    bRepeat = newRepeat;

    if (bImage != "")
    {
        trueDoc.body.style.backgroundImage = "url('" + bImage + "')";

        if (bRepeat)
        {
            trueDoc.body.style.backgroundRepeat = "repeat";
        }
        else
        {
            trueDoc.body.style.backgroundRepeat = "no-repeat";
        }
    }
    else
    {
        bHeight = trueJQ(fPageDiv).height() + 25;
        bWidth = trueJQ(fPageDiv).width() + 25;
    }
    if (bColor != "")
    {
        trueDoc.body.style.backgroundColor = bColor;
    }
    displayIfDebug("Fullscreen: changeFSSettings() finished.");
}

//Run update on exiting from fullscreen video
trueJQ(trueDoc).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function (e)
{
    var state = trueDoc.fullScreen || trueDoc.mozFullScreen || trueDoc.webkitIsFullScreen;
    var event = state ? 'FullscreenOn' : 'FullscreenOff';

    if (event == "FullscreenOff")
    {
        setTimeout(function () { update() }, 10);
    }
});

//Regularly check for fPageDiv's existence
var fPageDivReady;

if (typeof (Event) === 'function')
{
    fPageDivReady = new Event('fReady');
} 
else
{
    fPageDivReady = document.createEvent('Event');
    fPageDivReady.initEvent('fReady', true, true);
}

trueDoc.addEventListener('fReady', function (e) { fPageDivFoundFunction(); }, false);
var fDivChecking = setInterval(function () { fsCheckIfReady(); }, 16);
function fsCheckIfReady()
{
    if (bPageLoaded)
    {
        if (!sPlay)
        {
            fPageDiv = document.querySelector("#pageDIV");
            if (document.querySelector("#pageDIV") !== null && oldPageDiv != fPageDiv)
            {
                clearInterval(fDivChecking);
                trueDoc.dispatchEvent(fPageDivReady);
                fPageDivFound = true;
                displayIfDebug("Fullscreen: fPageDiv found.");
            }
        }
        else
        {
            fPageDiv = trueDoc.querySelector("#" + pgID);
            if (trueDoc.querySelector("#" + pgID) !== null && oldPageDiv != fPageDiv)
            {
                clearInterval(fDivChecking);
                trueDoc.dispatchEvent(fPageDivReady);
                fPageDivFound = true;
                displayIfDebug("Fullscreen: fPageDiv found: " + pgID);
            }
        }
        oldPageDiv = fPageDiv;
    }
}

function enableDebugMode(tempDebug)
{
    fsDebug = tempDebug;
    console.log("Fullscreen: Debug mode set to " + tempDebug);
}

function displayIfDebug(debugText)
{
    if(fsDebug)
    {
        console.log(debugText);
    }
}

//Add-on to ObjLayerActionGoTo to remove docked elements. Necessary for resuming a course in seamless play to work properly.
var origObjLayerActionGoTo = ObjLayerActionGoTo;
ObjLayerActionGoTo = function(destURL, destFrame, subFrame, bFeed)
{
    haltFS=true;
    fullscreenRemoveAll();
    origObjLayerActionGoTo.call(this, destURL, destFrame, subFrame, bFeed);
}

//Constantly removes all
function fullscreenRemoveAll()
{
    for (var i = 0; i < anchorArray.length; i++)
    {
        trueJQ("#" + anchorArray[i].name, trueDoc).remove();
    }
    for (var i = 0; i < pinArray.length; i++)
    {
        trueJQ("#" + pinArray[i], trueDoc).remove();
    }
    anchorArray = new Array();
    anchorGroupArray = new Array();
    pinArray = new Array();
}