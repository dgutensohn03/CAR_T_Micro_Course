//In Lectora, set type to 'Custom DIV'
window.responsiveConfig = {
    pageWidth: 1400,
    gutterWidth: 90,
    forceDesktopMin: 480
};

window.oldDetect = window.detect;
window.handleWidthZoom = function handleWidth() {
    var width = 1400;
    try {
        width = parent.window.innerWidth;
    } catch (e) {
        width = document.body.clientWidth;
    }
    var pageEl = document.getElementById("pageDIV");
    var cropGuttersWidth =  window.responsiveConfig.pageWidth - 2 * window.responsiveConfig.gutterWidth;
    // Reset styles
    // Remove lectora shift
    pageEl.style.transform = "";
    // Remove horizontal scrollbar hidden
    document.body.style["overflow-x"] = "hidden";
    // above minimum width but below crop gutters width
    if (width >= window.responsiveConfig.forceDesktopMin
        && width < cropGuttersWidth ) { 
        var scale = width / (window.responsiveConfig.pageWidth - 2 * window.responsiveConfig.gutterWidth);
        pageEl.style.transform = "translateX(-"+scale * window.responsiveConfig.gutterWidth+"px) scale("+scale+")";
        pageEl.style["transform-origin"] = "top left";
        document.body.style["overflow-x"] = "hidden";
    }
    // above crop-gutters width and below page width
    else if (width >= cropGuttersWidth && width < window.responsiveConfig.pageWidth) {
        // Offset is half the difference between 1400 and the width of the window
        var offset = (window.responsiveConfig.pageWidth - width) / 2;
        // Disable the horizontal scrollbar
        document.body.style["overflow-x"] = "hidden";
        // Shift lectora div by offset 
        pageEl.style.transform = "translateX(-"+offset +"px)";
    }
    $("body").trigger("resize");
}
window.detect = function () {
  window.oldDetect();
  if(is.clientProp.device == "Tablet") {
    if(getScreenWidth() >= window.responsiveConfig.forceDesktopMin) {
        is.clientProp.device = "Desktop";
        is.clientProp.width = "1009";
    }
  }
  setTimeout(window.handleWidthZoom, 100);
  return true;
};
setTimeout(window.detect, 100);