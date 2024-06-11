export function toggleFullScreen() {
    const docElement = document.documentElement;
  
    if (!document.fullscreenElement) {
      if (docElement.requestFullscreen) {
        docElement.requestFullscreen();
      } else if (docElement.webkitRequestFullscreen) { /* Safari */
        docElement.webkitRequestFullscreen();
      } else if (docElement.msRequestFullscreen) { /* IE11 */
        docElement.msRequestFullscreen();
      }
    //   console.log("Fullscreen mode enabled");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    //   console.log("Fullscreen mode disabled");
    }
  }
export function hideNavBar() {
    const navBar = document.getElementById('navHolder');
    navBar.style.display = 'none';
  }