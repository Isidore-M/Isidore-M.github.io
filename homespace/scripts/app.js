
// boolean holds true or false
let menuOpen = false;

function toggleMenu(val) {
  if(val) {
    // do anything
    // called from the logo, false alarm
  }
  else {
    if(!menuOpen) { // open the menu
      $('#menu').animate({
        right: 0
      }, 420, 'swing');
    }
    else { // close the menu
      $('#menu').animate({
        right: -360
      }, 420, 'swing');
    }
    menuOpen = !menuOpen;
  }
} // toggleMenu()