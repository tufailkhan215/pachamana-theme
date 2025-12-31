/**
 * Background Slider with Ken Burns Effect
 * Lightweight vanilla JavaScript implementation for Shopify
 */
(function() {
  'use strict';

  function initBackgroundSlider() {
    const slider = document.querySelector('.background-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.background-slider__slide');
    if (slides.length === 0) return;

    const settings = {
      slideDuration: parseInt(slider.dataset.slideDuration) || 5000,
      transitionDuration: parseInt(slider.dataset.transitionDuration) || 500,
      loop: slider.dataset.loop === 'true',
      kenBurns: slider.dataset.kenBurns === 'true',
      kenBurnsDirection: slider.dataset.kenBurnsDirection || 'in'
    };

    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayTimer = null;

    // Initialize slides
    function initSlides() {
      slides.forEach((slide, index) => {
        slide.style.opacity = index === 0 ? '1' : '0';
        slide.style.transition = `opacity ${settings.transitionDuration}ms ease-in-out`;
        
        if (settings.kenBurns) {
          const image = slide.querySelector('.background-slider__image');
          if (image) {
            image.classList.add('ken-burns', `ken-burns--${settings.kenBurnsDirection}`);
          }
        }
      });
    }

    // Show slide
    function showSlide(index) {
      if (isTransitioning) return;
      
      isTransitioning = true;
      const previousIndex = currentIndex;
      currentIndex = index;

      // Fade out previous slide
      slides[previousIndex].style.opacity = '0';
      
      // Remove active class from previous slide
      slides[previousIndex].classList.remove('is-active');
      const prevImage = slides[previousIndex].querySelector('.background-slider__image');
      if (prevImage) {
        prevImage.classList.remove('ken-burns--active');
      }

      // Fade in new slide
      setTimeout(() => {
        slides[currentIndex].style.opacity = '1';
        slides[currentIndex].classList.add('is-active');
        const currentImage = slides[currentIndex].querySelector('.background-slider__image');
        if (currentImage) {
          currentImage.classList.add('ken-burns--active');
        }
        
        setTimeout(() => {
          isTransitioning = false;
        }, settings.transitionDuration);
      }, 50);
    }

    // Next slide
    function nextSlide() {
      let nextIndex = currentIndex + 1;
      
      if (nextIndex >= slides.length) {
        if (settings.loop) {
          nextIndex = 0;
        } else {
          return;
        }
      }
      
      showSlide(nextIndex);
    }

    // Previous slide
    function previousSlide() {
      let prevIndex = currentIndex - 1;
      
      if (prevIndex < 0) {
        if (settings.loop) {
          prevIndex = slides.length - 1;
        } else {
          return;
        }
      }
      
      showSlide(prevIndex);
    }

    // Start autoplay
    function startAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextSlide, settings.slideDuration);
    }

    // Stop autoplay
    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Pause on hover (optional)
    if (slider.dataset.pauseOnHover === 'true') {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
    }

    // Initialize
    initSlides();
    
    if (slides.length > 1) {
      startAutoplay();
    }

    // Expose controls for manual navigation (if needed)
    slider.nextSlide = nextSlide;
    slider.previousSlide = previousSlide;
    slider.goToSlide = showSlide;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundSlider);
  } else {
    initBackgroundSlider();
  }

  // Re-initialize on section load (for Shopify theme editor)
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', initBackgroundSlider);
  }
})();
