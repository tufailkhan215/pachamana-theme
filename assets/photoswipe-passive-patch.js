/**
 * PhotoSwipe Passive Event Listener Patch
 * This script patches addEventListener BEFORE PhotoSwipe loads to reduce passive event warnings
 * while maintaining full functionality for PhotoSwipe's zoom and pan features
 * 
 * Must load BEFORE photoswipe.min.js
 */
(function() {
  'use strict';
  
  // Check if passive events are supported
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {
    // Passive events not supported, exit
    return;
  }
  
  // Store original addEventListener
  var originalAddEventListener = EventTarget.prototype.addEventListener;
  
  // Check if element is PhotoSwipe-related
  function isPhotoSwipeElement(element) {
    if (!element) return false;
    
    // Check if element is PhotoSwipe container or has PhotoSwipe class
    if (element.classList) {
      var classList = element.classList;
      if (classList.contains('pswp') ||
          classList.contains('pswp__scroll-wrap') ||
          classList.contains('pswp__container') ||
          classList.contains('pswp__item') ||
          classList.contains('pswp__ui')) {
        return true;
      }
    }
    
    // Check if element is inside PhotoSwipe (check up to 5 levels deep)
    if (element.closest) {
      var pswp = element.closest('.pswp');
      if (pswp) return true;
    }
    
    // Check parent chain (limited depth for performance)
    var parent = element.parentElement;
    var depth = 0;
    while (parent && depth < 5) {
      if (parent.classList && parent.classList.contains('pswp')) {
        return true;
      }
      parent = parent.parentElement;
      depth++;
    }
    
    // For window/document, check if PhotoSwipe exists in DOM
    // PhotoSwipe may add listeners to window/document for wheel events
    if (element === window || element === document || element === document.body) {
      // Check if PhotoSwipe element exists (even if hidden)
      var pswpExists = document.querySelector('.pswp');
      if (pswpExists) {
        // Allow non-passive for window/document when PhotoSwipe is present
        // This is needed for PhotoSwipe's zoom functionality
        return true;
      }
    }
    
    return false;
  }
  
  // Override addEventListener to intercept wheel events
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Only handle wheel/mousewheel events
    if (type === 'wheel' || type === 'mousewheel' || type === 'DOMMouseScroll') {
      // Check if this is a PhotoSwipe element
      // PhotoSwipe needs non-passive listeners for zoom functionality
      if (isPhotoSwipeElement(this)) {
        // Allow non-passive for PhotoSwipe elements (needed for zoom)
        return originalAddEventListener.call(this, type, listener, options);
      }
      
      // For non-PhotoSwipe elements, make wheel events passive if not explicitly set
      if (options && typeof options === 'object') {
        // If passive is explicitly set, respect it
        if ('passive' in options) {
          return originalAddEventListener.call(this, type, listener, options);
        }
        // Add passive to existing options
        var newOptions = {};
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            newOptions[key] = options[key];
          }
        }
        newOptions.passive = true;
        return originalAddEventListener.call(this, type, listener, newOptions);
      }
      
      if (typeof options === 'boolean') {
        // useCapture boolean, convert to object with passive
        return originalAddEventListener.call(this, type, listener, {
          capture: options,
          passive: true
        });
      }
      
      // No options provided, make passive
      return originalAddEventListener.call(this, type, listener, { passive: true });
    }
    
    // For all other events, use original behavior
    return originalAddEventListener.call(this, type, listener, options);
  };
})();

