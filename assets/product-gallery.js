/**
 * WooCommerce Product Gallery JavaScript
 * Handles gallery slider, thumbnail navigation, image zoom, and PhotoSwipe integration
 */
(function() {
  'use strict';

  // Global: switch main image to variant's image. Defined early so product-form can call it when variant changes.
  window.updateProductGalleryForVariant = function(variantId) {
    var map = window.PRODUCT_VARIANT_IMAGES;
    if (!map) return;
    var mediaId = map[variantId] !== undefined ? map[variantId] : map[String(variantId)];
    if (mediaId === undefined) return;
    var gallery = document.querySelector('.woocommerce-product-gallery');
    if (!gallery || typeof gallery.goToSlide !== 'function') return;
    var slides = gallery.querySelectorAll('.woocommerce-product-gallery__image');
    var mediaIdStr = String(mediaId);
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute('data-media-id') === mediaIdStr) {
        gallery.goToSlide(i);
        return;
      }
    }
  };

  var galleryInitialized = false;

  function initProductGallery() {
    if (galleryInitialized) return;
    
    var gallery = document.querySelector('.woocommerce-product-gallery');
    if (!gallery) return;
    
    var wrapper = gallery.querySelector('.woocommerce-product-gallery__wrapper');
    var viewport = gallery.querySelector('.flex-viewport');
    var images = gallery.querySelectorAll('.woocommerce-product-gallery__image');
    var thumbnails = gallery.querySelectorAll('.flex-control-thumbs li');
    
    if (!wrapper || images.length === 0) return;
    
    // Get viewport width (this is the visible area)
    function getViewportWidth() {
      if (viewport) {
        return viewport.offsetWidth || 462.6;
      }
      return 462.6; // Default width
    }
    
    // Calculate gallery dimensions
    var currentIndex = 0;
    var totalImages = images.length;
    var imageWidth = getViewportWidth();
    
    // Set wrapper width based on number of images
    // Each image takes 100% of viewport width, so total is (totalImages * 100)%
    wrapper.style.width = (totalImages * 100) + '%';
    
    // Set each image to take 100% of wrapper width (which is divided by totalImages)
    images.forEach(function(image) {
      image.style.width = (100 / totalImages) + '%';
      image.style.marginRight = '0px';
      image.style.float = 'left';
    });
    
    // Update viewport height based on active image
    function updateViewportHeight() {
      var activeImage = gallery.querySelector('.woocommerce-product-gallery__image.flex-active-slide');
      if (activeImage && viewport) {
        var img = activeImage.querySelector('img');
        if (img) {
          var aspectRatio = img.naturalHeight / img.naturalWidth || 1;
          var viewportWidth = getViewportWidth();
          var newHeight = viewportWidth * aspectRatio;
          viewport.style.height = newHeight + 'px';
        }
      }
    }
    
    // Go to slide
    function goToSlide(index) {
      if (index < 0) index = 0;
      if (index >= totalImages) index = totalImages - 1;
      
      currentIndex = index;
      
      // Update wrapper transform
      var translateX = -(index * imageWidth);
      wrapper.style.transform = 'translate3d(' + translateX + 'px, 0px, 0px)';
      wrapper.style.transitionDuration = '0.5s';
      
      // Update active classes
      images.forEach(function(img, i) {
        if (i === index) {
          img.classList.add('flex-active-slide');
        } else {
          img.classList.remove('flex-active-slide');
        }
      });
      
      // Update thumbnail active class
      thumbnails.forEach(function(thumb, i) {
        var thumbImg = thumb.querySelector('img');
        if (thumbImg) {
          if (i === index) {
            thumbImg.classList.add('flex-active');
          } else {
            thumbImg.classList.remove('flex-active');
          }
        }
      });
      
      // Update viewport height
      updateViewportHeight();
    }
    
    // Thumbnail click handlers
    thumbnails.forEach(function(thumb, index) {
      thumb.addEventListener('click', function(e) {
        e.preventDefault();
        goToSlide(index);
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!gallery.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      }
    });
    
    // Image zoom functionality
    images.forEach(function(imageContainer) {
      var img = imageContainer.querySelector('img.wp-post-image, img');
      var zoomImg = imageContainer.querySelector('.zoomImg');
      
      if (!img) return;
      
      // Create zoom image if it doesn't exist
      if (!zoomImg && img.getAttribute('data-large_image')) {
        zoomImg = document.createElement('img');
        zoomImg.className = 'zoomImg';
        zoomImg.setAttribute('alt', '');
        zoomImg.setAttribute('aria-hidden', 'true');
        zoomImg.src = img.getAttribute('data-large_image') || img.src;
        imageContainer.appendChild(zoomImg);
      }
      
      if (!zoomImg) return;
      
      var largeImageSrc = img.getAttribute('data-large_image') || img.src;
      zoomImg.src = largeImageSrc;
      
      // Mouse move handler for zoom
      imageContainer.addEventListener('mousemove', function(e) {
        if (!zoomImg) return;
        
        var rect = imageContainer.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        
        var imgRect = img.getBoundingClientRect();
        var imgX = imgRect.left;
        var imgY = imgRect.top;
        
        var zoomWidth = zoomImg.naturalWidth || img.naturalWidth || 1080;
        var zoomHeight = zoomImg.naturalHeight || img.naturalHeight || 1080;
        var displayWidth = img.offsetWidth || 462.6;
        var displayHeight = img.offsetHeight || 462.6;
        
        var scaleX = zoomWidth / displayWidth;
        var scaleY = zoomHeight / displayHeight;
        
        var offsetX = (x * scaleX) - (displayWidth / 2);
        var offsetY = (y * scaleY) - (displayHeight / 2);
        
        // Constrain zoom image position
        var maxX = zoomWidth - displayWidth;
        var maxY = zoomHeight - displayHeight;
        
        offsetX = Math.max(0, Math.min(offsetX, maxX));
        offsetY = Math.max(0, Math.min(offsetY, maxY));
        
        zoomImg.style.position = 'absolute';
        zoomImg.style.top = (-offsetY) + 'px';
        zoomImg.style.left = (-offsetX) + 'px';
        zoomImg.style.width = zoomWidth + 'px';
        zoomImg.style.height = zoomHeight + 'px';
        zoomImg.style.opacity = '1';
        zoomImg.style.zIndex = '10';
      });
      
      imageContainer.addEventListener('mouseleave', function() {
        if (zoomImg) {
          zoomImg.style.opacity = '0';
        }
      });
    });
    
    // Expose goToSlide so updateProductGalleryForVariant (and thumbnails) can switch slides
    gallery.goToSlide = goToSlide;

    // On load: show featured image (first slide). On variant change: updateProductGalleryForVariant switches to variant image.
    goToSlide(0);
    
    // Update viewport height on window resize
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Recalculate image width from viewport
        imageWidth = getViewportWidth();
        goToSlide(currentIndex);
      }, 250);
    });
    
    // Update viewport height when images load
    images.forEach(function(imageContainer) {
      var img = imageContainer.querySelector('img');
      if (img) {
        if (img.complete) {
          updateViewportHeight();
        } else {
          img.addEventListener('load', updateViewportHeight);
        }
      }
    });
    
    galleryInitialized = true;
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initProductGallery, 100);
    });
  } else {
    setTimeout(initProductGallery, 100);
  }
  
  // Also try after a delay for late-loading content
  setTimeout(initProductGallery, 500);
  setTimeout(initProductGallery, 1000);
})();

