// This script helps load MediaPipe without module conflicts
(function() {
  // Store original Module if it exists
  if (typeof Module !== 'undefined') {
    window._originalModule = Module;
  }
  
  // Create a clean Module object for MediaPipe
  window.Module = {
    locateFile: function(path) {
      return 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/' + path;
    }
  };
})();
