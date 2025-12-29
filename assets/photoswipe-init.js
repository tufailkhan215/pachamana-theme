/**
 * PhotoSwipe initialization for Shopify product gallery
 * This script initializes PhotoSwipe when the gallery trigger is clicked
 * 
 * Note: Browser may show "[Violation] Added non-passive event listener" warnings.
 * This is expected - PhotoSwipe requires non-passive listeners for touch/wheel events
 * to enable zoom, pan, and swipe functionality. These warnings do not affect functionality.
 */
(function() {
  'use strict';
  
  // Wait for DOM and PhotoSwipe to be ready
  function initPhotoSwipe() {
    // Check if PhotoSwipe is available
    if (typeof PhotoSwipe === 'undefined' || typeof PhotoSwipeUI_Default === 'undefined') {
      console.warn('PhotoSwipe library not loaded');
      return;
    }
    
    // Get the gallery trigger button
    var trigger = document.querySelector('.woocommerce-product-gallery__trigger');
    if (!trigger) {
      return;
    }
    
    // Get all product images
    var galleryImages = document.querySelectorAll('.woocommerce-product-gallery__image a');
    if (galleryImages.length === 0) {
      return;
    }
    
    // Build items array from product images
    var items = [];
    galleryImages.forEach(function(imgLink, index) {
      var img = imgLink.querySelector('img');
      if (img) {
        var src = imgLink.getAttribute('href') || img.getAttribute('data-large_image') || img.getAttribute('data-src') || img.src;
        var width = parseInt(img.getAttribute('data-large_image_width') || img.getAttribute('width') || '1200');
        var height = parseInt(img.getAttribute('data-large_image_height') || img.getAttribute('height') || '900');
        var alt = img.getAttribute('alt') || '';
        
        items.push({
          src: src,
          w: width,
          h: height,
          title: alt
        });
      }
    });
    
    if (items.length === 0) {
      return;
    }
    
    // Get or create PhotoSwipe container
    var pswpElement = document.getElementById('photoswipe-fullscreen-dialog');
    if (!pswpElement) {
      // Create PhotoSwipe container if it doesn't exist
      pswpElement = document.createElement('div');
      pswpElement.id = 'photoswipe-fullscreen-dialog';
      pswpElement.className = 'pswp';
      pswpElement.setAttribute('tabindex', '-1');
      pswpElement.setAttribute('role', 'dialog');
      pswpElement.setAttribute('aria-hidden', 'true');
      
      pswpElement.innerHTML = [
        '<div class="pswp__bg"></div>',
        '<div class="pswp__scroll-wrap">',
          '<div class="pswp__container">',
            '<div class="pswp__item"></div>',
            '<div class="pswp__item"></div>',
            '<div class="pswp__item"></div>',
          '</div>',
          '<div class="pswp__ui pswp__ui--hidden">',
            '<div class="pswp__top-bar">',
              '<div class="pswp__counter"></div>',
              '<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>',
              '<button class="pswp__button pswp__button--share" title="Share"></button>',
              '<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>',
              '<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>',
              '<div class="pswp__preloader">',
                '<div class="pswp__preloader__icn">',
                  '<div class="pswp__preloader__cut">',
                    '<div class="pswp__preloader__donut"></div>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
            '<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">',
              '<div class="pswp__share-tooltip"></div>',
            '</div>',
            '<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>',
            '<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>',
            '<div class="pswp__caption">',
              '<div class="pswp__caption__center"></div>',
            '</div>',
          '</div>',
        '</div>'
      ].join('');
      
      document.body.appendChild(pswpElement);
    }
    
    // Add click handler to trigger button
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Find current active slide
      var clickedIndex = 0;
      var activeImage = document.querySelector('.woocommerce-product-gallery__image.flex-active-slide');
      if (activeImage) {
        var allImages = Array.from(document.querySelectorAll('.woocommerce-product-gallery__image'));
        clickedIndex = allImages.indexOf(activeImage);
        if (clickedIndex === -1) clickedIndex = 0;
      }
      
      // Initialize PhotoSwipe with performance optimizations
      var options = {
        index: clickedIndex,
        showHideAnimationType: 'fade',
        bgOpacity: 0.8,
        history: false,
        shareButtons: [],
        // Performance optimizations
        allowPanToNext: true,
        spacing: 0.12,
        loop: false,
        pinchToClose: true,
        closeOnScroll: false,
        closeOnVerticalDrag: true,
        // Reduce scroll blocking
        wheelToZoom: true,
        escKey: true,
        arrowKeys: true
      };
      
      var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
    });
    
    // Also add click handlers to individual images
    galleryImages.forEach(function(imgLink, index) {
      imgLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        var options = {
          index: index,
          showHideAnimationType: 'fade',
          bgOpacity: 0.8,
          history: false,
          shareButtons: [],
          // Performance optimizations
          allowPanToNext: true,
          spacing: 0.12,
          loop: false,
          pinchToClose: true,
          closeOnScroll: false,
          closeOnVerticalDrag: true,
          // Reduce scroll blocking
          wheelToZoom: true,
          escKey: true,
          arrowKeys: true
        };
        
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initPhotoSwipe, 100);
    });
  } else {
    setTimeout(initPhotoSwipe, 100);
  }
  
  // Also try after a delay to ensure PhotoSwipe scripts are loaded
  setTimeout(initPhotoSwipe, 500);
  setTimeout(initPhotoSwipe, 1000);
})();

