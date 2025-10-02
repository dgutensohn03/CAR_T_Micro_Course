//In Lectora, set Type to 'Top of file scripting'
Object.defineProperty(window, "TabletResponsive", {
  enumerable: false,
  configureable: false,
  get: function() {
    window.DesktopResponsive[785] = window.DesktopResponsive[1009];
    return window.DesktopResponsive;
  }
});