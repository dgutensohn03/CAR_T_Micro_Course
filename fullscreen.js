var pageDiv = document.getElementById("pageDIV");
var anchorArray = new Array();
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0px 0px 0px 0px";
document.body.style.position = "absolute";
var bPosX = 0;
var bPosY = 0;
var docRoot;
function update()
{
	if(getDevice()=="Desktop"){
		lectora17Fix();
	}
	
    var screenHeight = window.top.innerHeight ? window.top.innerHeight : $(window.top).height();
    var screenWidth = window.top.innerWidth ? window.top.innerWidth : $(window.top).width();
    if($(pageDiv).height() < screenHeight)
    {
        $(pageDiv).css('top', (screenHeight - $(pageDiv).height()) / 2);
		bPosY = (screenHeight - bHeight) / 2;
		document.body.style.overflowY = "hidden";
    }
	else
	{
		$(pageDiv).css('top', 0);
		document.body.style.overflowY = "scroll";	
	}
	if($(pageDiv).width() < screenWidth)
    {
		$(pageDiv).css('left', (screenWidth - $(pageDiv).width()) / 2);
		bPosX = (screenWidth - bWidth) / 2;
		document.body.style.overflowX = "hidden";
    }
	else
	{
		$(pageDiv).css('left', 0);
		document.body.style.overflowX = "scroll";	
	}
	if($(pageDiv).height() < screenHeight || $(pageDiv).width() < screenWidth)
	{
	$(document.body).css('background-position', bPosX + 'px ' + bPosY + 'px');
	}
	
	for(var i = 0; i < anchorArray.length; i++)
	{
		var thisName = document.getElementById(anchorArray[i].name);
		if(anchorArray[i].xAxis == "left")
		{
			thisName.style.right = "auto";
			thisName.style.left = "0px";
			if(anchorArray[i].always)
			{
				thisName.style.left = $(docRoot, docRoot).scrollLeft() + "px";
			}
		}
		else if(anchorArray[i].xAxis == "right")
		{
			thisName.style.right = "0px";
			thisName.style.left = "auto";
			if($(pageDiv).width() > screenWidth)
			{
				thisName.style.left = ($(pageDiv).width() - $(thisName).width()) + "px";
			}
			if(anchorArray[i].always)
			{
				thisName.style.left = ($(docRoot, docRoot).scrollLeft() + screenWidth - $(thisName).width()) + "px";
			}
			if($(pageDiv).height() > screenHeight)
			{
				thisName.style.right = "0px";
				thisName.style.left = "auto";
			}
		}
		else if(anchorArray[i].xAxis == "center")
		{
			thisName.style.right = "auto";
			$(thisName).css('left', ((screenWidth - $(thisName).width()) / 2) + "px");
			if($(pageDiv).width() > screenWidth && anchorArray[i].always)
			{
				thisName.style.left = ($(docRoot, docRoot).scrollLeft() + ((screenWidth / 2) - ($(thisName).width() / 2))) + "px";
			}
		}
		
		if(anchorArray[i].yAxis == "top")
		{
			thisName.style.bottom = "auto";
			thisName.style.top = "0px";
			if(anchorArray[i].always)
			{
				thisName.style.top = $(docRoot, docRoot).scrollTop() + "px";
			}
		}
		else if(anchorArray[i].yAxis == "bottom")
		{
			thisName.style.bottom = "0px";
			thisName.style.top = "auto";
			if($(pageDiv).height() > screenHeight)
			{
				thisName.style.top = ($(pageDiv).height() - $(thisName).height()) + "px";
			}
			if(anchorArray[i].always)
			{
				thisName.style.top = ($(docRoot, docRoot).scrollTop() + screenHeight - $(thisName).height()) + "px";
			}
			if($(pageDiv).width() > screenWidth)
			{
				thisName.style.bottom = "0px";
				thisName.style.top = "auto";
			}
		}
		else if(anchorArray[i].yAxis == "center")
		{
			thisName.style.bottom = "auto";
			$(thisName).css('top', ((screenHeight - $(thisName).height()) / 2) + "px");
			if($(pageDiv).height() > screenHeight && anchorArray[i].always)
			{
				thisName.style.top = ($(docRoot, docRoot).scrollTop() + ((screenHeight / 2) - ($(thisName).height() / 2))) + "px";
			}
		}
	}
}
function ReFlow()
{
	if(getDevice()=="Desktop"||getDevice()=="Tablet"){
		//Overwrites Lectora's ReFlow which doesn't account for what we're doing here.
		var left = (winW > $("#pageDIV").css('width')) ? (winW-$("#pageDIV").css('width'))/2 : 0
		if (pageLayer)
	  {
		pageLayer.moveTo( left, 0 );
		pageLayer.hasMoved = true;
		pageLayer.newX = left;
		pageLayer.newY = 0;
	  }
		update();
	}else{
		normalReflow();
	}
	setfixed(); //anchoring
}
function anchorObject(Name, YAxis, XAxis, Always)
{
	this.name = Name;
	this.xAxis = XAxis;
	this.yAxis = YAxis;
	this.always = Always;
}
function anchorTopLeft(name, always)
{
	anchorArray.push(new anchorObject(name, "top", "left", always));
	document.body.appendChild(document.getElementById(name));
}
function anchorTopRight(name, always)
{
	anchorArray.push(new anchorObject(name, "top", "right", always));
	document.body.appendChild(document.getElementById(name));
}
function anchorBottomLeft(name, always)
{
	anchorArray.push(new anchorObject(name, "bottom", "left", always));
	document.body.appendChild(document.getElementById(name));
}
function anchorBottomRight(name, always)
{
	anchorArray.push(new anchorObject(name, "bottom", "right", always));
	document.body.appendChild(document.getElementById(name));
}
function anchorCenterLeft(name, always)
{
	anchorArray.push(new anchorObject(name, "center", "left", always));
	document.body.appendChild(document.getElementById(name));
}
function anchorCenterRight(name, always)
{
	anchorArray.push(new anchorObject(name, "center", "right", always));
	document.body.appendChild(document.getElementById(name));
}
function anchorTopCenter(name, always)
{
	anchorArray.push(new anchorObject(name, "top", "center", always));
	document.body.appendChild(document.getElementById(name));
}
function anchorBottomCenter(name, always)
{
	anchorArray.push(new anchorObject(name, "bottom", "center", always));
	document.body.appendChild(document.getElementById(name));
}
function normalReflow(){
	findWH()
  var pageEleWidth = pageLayer.ele.clientWidth;
  if (  (is.ieAny || is.edge )  && pageLayer.ele.clientWidth == 0 && isSinglePagePlayerAvail()) pageEleWidth = parseFloat(GetPageWidth()) ;
  if (pageLayer)
  {
    var left = (winW > pageEleWidth) ? (winW-pageEleWidth)/2 : 0
    transformScale = (winW > pageEleWidth) ? 1 : (winW/pageEleWidth) 
    if(is.isMobile.any())
			left = 0
    if(is.iOS && isInIframe( getDisplayWindow() , 0))
			transformScale = (getScreenWidth() > pageEleWidth) ? 1 : (getScreenWidth()/pageEleWidth) 
    var transSty = calculateScale();
    pageLayer.moveTo( left, 0 );
    pageLayer.hasMoved = true;
    pageLayer.newX = left;
    pageLayer.newY = 0;
    if(CanScale()){
       pageLayer.styObj.transform =  transSty;
       pageLayer.styObj.webkitTransform =  transSty;
    }else
       transformScale = 1;
    pageLayer.styObj.transformOrigin =  '0 0';
     adjustAllObjectsForFixedPosition();
  }
  setfixed(); //anchoring
}

function lectora17Fix(){
	setfixed(); //anchoring
		if(bImage != "")
		{
			document.body.style.backgroundImage = "url('" + bImage + "')";
			if(bRepeat)
			{
				document.body.style.backgroundRepeat = "repeat";
			}
			else
			{
				document.body.style.backgroundRepeat = "no-repeat";
			}
		}
		else
		{
			bHeight = $(pageDiv).height() + 25;
			bWidth = $(pageDiv).width() + 25;	
		}
		if(typeof dragMgr != 'undefined')
		{
			dragMgr.mouseDown = DragMouseDown2;
			dragMgr.mouseMove = DragMouseMove2;
		}
}

//Detect if iOS for fallback. True if iOS.
function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  while (iDevices.length) {
    if (navigator.platform === iDevices.pop()){ return true; }
  }

  return false;
}
$(document).ready(function(){
	/*if(getDevice()=="Desktop"){}else if(getDevice()=="Phone"){}else if(getDevice()=="Tablet"){}*/

	if(iOS())
	{
		docRoot = window.top.document;
	}
	else
	{
		docRoot = window;
	}
	if(bImage != "")
	{
		document.body.style.backgroundImage = "url('" + bImage + "')";
		if(bRepeat)
		{
			document.body.style.backgroundRepeat = "repeat";
		}
		else
		{
			document.body.style.backgroundRepeat = "no-repeat";
		}
	}
	else
	{
		bHeight = $(pageDiv).height() + 25;
		bWidth = $(pageDiv).width() + 25;	
	}
	if(bColor != "")
	{
		document.body.style.backgroundColor = bColor;
	}
	$(docRoot).scroll(function(){
		update();
	});
	$(docRoot).scrollstart(function(){
		update();
	});
	setTimeout(function(){update()}, 200);
}); 

//Need to overwrite these functions in trivantis-drag.js or else drag and drops won't work :(
function DragMouseDown2(x,y,e) {
	x -= $("#pageDIV").position().left;
	y -= $("#pageDIV").position().top;
    for (var i=this.arrDragItems.length-1;i>=0;i--) 
    {
      var dItem = this.arrDragItems[i]
      if (dItem.checkWithinItem(x,y)) 
      {
        var targ;
        if (!e) var e = window.event;
        if (e.target) targ = e.target;
        else if (e.srcElement) targ = e.srcElement;
        while( targ && 
               ( !targ.id || targ.id.indexOf( dItem.name ) == -1 ) &&
               ( !targ.name || targ.name.indexOf( dItem.name ) == -1 ) )
        {        
            targ = targ.parentNode
        }
        if( !targ )
          return false;
		  
		if( targ.disabled )
			return false;
        this.item = dItem
        this.offX = x-this.item.lyr.objLyr.x
        this.offY = y-this.item.lyr.objLyr.y
        if( this.item.lyr.dropObj ) 
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
function DragMouseMove2(x,y) {
    if (!this.active) return false
    else 
    {
      this.item.lyr.objLyr.moveTo(x-this.offX-$("#pageDIV").position().left,y-this.offY-$("#pageDIV").position().top)
      return true
    }
}