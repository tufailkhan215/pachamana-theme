/**
 * Product Form Handler
 * Handles add to cart form submission with AJAX
 */
(function() {
  'use strict';

  // Initialize variant selection on page load (set variant id + price only; do not change gallery - keep featured image)
  function initializeVariantSelection() {
    const productForms = document.querySelectorAll('form[action="/cart/add"], form[action*="/cart/add"]');
    
    productForms.forEach(function(form) {
      const optionSelects = form.querySelectorAll('select[name^="options"]');
      if (optionSelects.length > 0) {
        // Variable product - initialize variant id and price only (updateGallery: false so featured image stays)
        updateVariantSelection(form, { updateGallery: false });
      } else {
        // Simple product - ensure variant ID is set
        const variantInput = form.querySelector('input[name="id"]');
        if (!variantInput) {
          // Try to get variant ID from product data
          const productHandle = form.dataset.productHandle;
          if (productHandle) {
            fetch('/products/' + productHandle + '.js')
              .then(function(response) {
                return response.json();
              })
              .then(function(product) {
                if (product.variants && product.variants.length > 0) {
                  const variant = product.variants[0];
                  const input = document.createElement('input');
                  input.type = 'hidden';
                  input.name = 'id';
                  input.value = variant.id;
                  form.appendChild(input);
                }
              })
              .catch(function(error) {
                console.error('Variant initialization error:', error);
              });
          }
        }
      }
    });
  }

  // Attach form handlers immediately and on DOM ready
  function attachFormHandlers() {
    // Find all possible product forms - check multiple selectors
    let productForms = document.querySelectorAll('form[action*="/cart/add"]');
    
    // Also check for forms with product-form ID pattern
    const productFormById = document.querySelectorAll('form[id^="product-form"]');
    productFormById.forEach(function(form) {
      if (!Array.from(productForms).includes(form)) {
        productForms = Array.from(productForms).concat([form]);
      }
    });
    
    // Check for forms with cart class
    const cartForms = document.querySelectorAll('form.cart');
    cartForms.forEach(function(form) {
      if (!Array.from(productForms).includes(form)) {
        productForms = Array.from(productForms).concat([form]);
      }
    });
    
    // Convert to array if needed
    if (productForms.length === undefined) {
      productForms = Array.from(productForms);
    }
    
    productForms.forEach(function(form) {
      // Skip if form already has a handler
      if (form.dataset.ajaxCart === 'true') return;
      
      // Check if this is actually a product form (has add button or quantity input)
      const hasAddButton = form.querySelector('button[type="submit"][name="add"]');
      const hasQuantity = form.querySelector('input[name="quantity"]');
      const hasProductId = form.querySelector('input[name="id"]') || form.querySelector('select[name^="options"]');
      
      if (!hasAddButton && !hasQuantity && !hasProductId) {
        return; // Not a product form
      }
      
      form.dataset.ajaxCart = 'true';
      
      // Override form action to ensure it goes to /cart/add (not /cart/add.js in action, we use that in fetch)
      if (!form.action || form.action.indexOf('/cart/add') === -1) {
        form.action = '/cart/add';
      }
      
      // Attach submit handler with capture phase for early interception
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"][name="add"]');
        const originalText = submitButton ? submitButton.textContent.trim() : '';
        const originalDisabled = submitButton ? submitButton.disabled : false;
        
        // Validate variant selection for variable products
        const variantSelect = form.querySelector('select[name="id"]');
        if (!variantSelect && !form.querySelector('input[name="id"]')) {
          // Variable product without variant selected
          const optionSelects = form.querySelectorAll('select[name^="options"]');
          if (optionSelects.length > 0) {
            showCartNotification('Please select product options', 'error');
            return;
          }
        }
        
        // Disable submit button
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Adding...';
        }
        
        // Get variant ID for variable products
        let variantId = formData.get('id');
        if (!variantId) {
          // Try to find variant ID from selected options
          const optionSelects = form.querySelectorAll('select[name^="options"]');
          if (optionSelects.length > 0) {
            // Need to get variant ID - trigger variant selection update first
            updateVariantSelection(form);
            // Wait a bit for variant to be set, then try again
            setTimeout(function() {
              const newVariantId = form.querySelector('input[name="id"]');
              if (!newVariantId || !newVariantId.value) {
                showCartNotification('Please select all product options', 'error');
                if (submitButton) {
                  submitButton.disabled = originalDisabled;
                  submitButton.textContent = originalText;
                }
                return;
              }
              const newFormData = new FormData();
              newFormData.append('id', newVariantId.value);
              const quantity = formData.get('quantity') || 1;
              newFormData.append('quantity', quantity);
              submitForm(newFormData, form, submitButton, originalText, originalDisabled);
            }, 100);
            return;
          } else {
            // Simple product - form should have variant ID
            showCartNotification('Product variant not found. Please refresh the page.', 'error');
            if (submitButton) {
              submitButton.disabled = originalDisabled;
              submitButton.textContent = originalText;
            }
            return;
          }
        }
        
        submitForm(formData, form, submitButton, originalText, originalDisabled);
      }, true); // Use capture phase for early interception
    });
  }

  // Run immediately if DOM is already loaded, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initializeVariantSelection();
      attachFormHandlers();
    });
  } else {
    // DOM is already loaded
    initializeVariantSelection();
    attachFormHandlers();
  }

  // Watch for dynamically added forms - debounced so the page doesn't hang (observer would fire on every DOM change otherwise)
  function scheduleFormHandlerAttach() {
    if (scheduleFormHandlerAttach._timer) clearTimeout(scheduleFormHandlerAttach._timer);
    scheduleFormHandlerAttach._timer = setTimeout(function() {
      scheduleFormHandlerAttach._timer = null;
      attachFormHandlers();
    }, 400);
  }
  if (typeof MutationObserver !== 'undefined' && document.body && document.body.nodeType === 1) {
    var observer = new MutationObserver(function() {
      scheduleFormHandlerAttach();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } else if (typeof MutationObserver !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.body) {
        var observer = new MutationObserver(function() {
          scheduleFormHandlerAttach();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  }

  // Submit form to cart
  function submitForm(formData, form, submitButton, originalText, originalDisabled) {
    // Submit form via AJAX
    fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      if (!response.ok) {
        return response.json().then(function(data) {
          throw new Error(data.description || 'Failed to add to cart');
        });
      }
      return response.json();
    })
    .then(function(data) {
      // Success - update cart count and show success message
      updateCartCount();
      
      // Show success message
      showCartNotification('Product added to cart!', 'success');
      
      // Optionally open cart drawer if it exists
      const cartDrawer = document.getElementById('cart-drawer');
      if (cartDrawer) {
        if (typeof cartDrawer.open === 'function') {
          setTimeout(function() {
            cartDrawer.open();
          }, 500);
        } else if (cartDrawer.classList) {
          cartDrawer.classList.add('open');
          cartDrawer.setAttribute('aria-hidden', 'false');
        }
      }
      
      // Reset quantity to 1
      const quantityInput = form.querySelector('input[name="quantity"]');
      if (quantityInput) {
        quantityInput.value = 1;
      }
    })
    .catch(function(error) {
      console.error('Add to cart error:', error);
      const errorMessage = error.message || 'Error adding product to cart. Please try again.';
      showCartNotification(errorMessage, 'error');
    })
    .finally(function() {
      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = originalDisabled;
        submitButton.textContent = originalText;
      }
    });
  }

  // Update cart count in header/navigation
  function updateCartCount() {
    fetch('/cart.js')
      .then(function(response) {
        return response.json();
      })
      .then(function(cart) {
        // Update cart count elements
        const cartCountElements = document.querySelectorAll('[data-cart-count]');
        cartCountElements.forEach(function(element) {
          element.textContent = cart.item_count;
          element.style.display = cart.item_count > 0 ? '' : 'none';
        });
        
        // Update cart drawer if it exists
        const cartDrawer = document.getElementById('cart-drawer');
        if (cartDrawer && typeof cartDrawer.updateCart === 'function') {
          cartDrawer.updateCart(cart);
        }
      })
      .catch(function(error) {
        console.error('Cart count update error:', error);
      });
  }

  // Show cart notification
  function showCartNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification cart-notification--' + (type || 'success');
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#d32f2f' : '#4caf50'};
      color: white;
      padding: 15px 25px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(function() {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(function() {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Handle variant selection when user changes size/option (update gallery to variant image)
  document.addEventListener('change', function(e) {
    if (e.target.matches('.product-option-select, select[name^="options"]')) {
      const form = e.target.closest('form[action*="/cart/add"]');
      if (form) {
        updateVariantSelection(form, { updateGallery: true });
      }
    }
  });

  // Update variant selection when options change. options.updateGallery = true only when user changed the select (so featured image on load stays).
  function updateVariantSelection(form, options) {
    var updateGallery = options && options.updateGallery === true;
    const optionSelects = form.querySelectorAll('select[name^="options"]');
    if (optionSelects.length === 0) return;
    
    // Get selected option values
    const selectedOptions = Array.from(optionSelects).map(function(select) {
      return select.value;
    });
    
    // Find matching variant
    const productHandle = form.dataset.productHandle;
    if (!productHandle) return;
    
    fetch('/products/' + productHandle + '.js')
      .then(function(response) {
        return response.json();
      })
      .then(function(product) {
        // Find variant that matches selected options
        const variant = product.variants.find(function(v) {
          return v.options.every(function(option, index) {
            return option === selectedOptions[index];
          });
        });
        
        if (variant) {
          // Update hidden variant ID input
          let variantInput = form.querySelector('input[name="id"]');
          if (!variantInput) {
            variantInput = document.createElement('input');
            variantInput.type = 'hidden';
            variantInput.name = 'id';
            form.appendChild(variantInput);
          }
          variantInput.value = variant.id;
          
          // Update main product image to variant's image only when user changed the variant (not on initial page load)
          if (updateGallery && window.updateProductGalleryForVariant && typeof window.updateProductGalleryForVariant === 'function') {
            window.updateProductGalleryForVariant(variant.id);
          }
          
          // Update price display
          updateVariantPriceDisplay(form, variant);
          
          // Update availability
          const submitButton = form.querySelector('button[type="submit"][name="add"]');
          if (submitButton) {
            if (variant.available) {
              submitButton.disabled = false;
              submitButton.textContent = submitButton.dataset.addText || 'Add to cart';
            } else {
              submitButton.disabled = true;
              submitButton.textContent = 'Sold out';
            }
          }
        }
      })
      .catch(function(error) {
        console.error('Variant selection error:', error);
      });
  }

  // Update variant price display (price is in a sibling widget .elementor-widget-woocommerce-product-price, not inside the form)
  function updateVariantPriceDisplay(form, variant) {
    var productScope = form.closest('.elementor-location-single') || form.closest('[data-elementor-type="product"]') || document.body;
    var priceWidget = productScope.querySelector('.elementor-widget-woocommerce-product-price');
    if (!priceWidget) {
      priceWidget = form.closest('[data-id="7db38096"]') && form.closest('[data-id="7db38096"]').previousElementSibling;
    }
    var priceElement = priceWidget ? priceWidget.querySelector('.price') : null;
    if (!priceElement) {
      priceElement = document.querySelector('.elementor-widget-woocommerce-product-price .price');
    }

    var price = (variant.price / 100).toFixed(2);
    var currencySymbol = (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) ? window.Shopify.currency.active : '$';
    var formattedPrice = currencySymbol + price;

    if (priceElement) {
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        var comparePrice = (variant.compare_at_price / 100).toFixed(2);
        priceElement.innerHTML = '<del aria-hidden="true"><span class="woocommerce-Price-amount amount"><bdi>' + currencySymbol + comparePrice + '</bdi></span></del> <ins aria-hidden="true"><span class="woocommerce-Price-amount amount"><bdi>' + currencySymbol + price + '</bdi></span></ins>';
      } else {
        priceElement.innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + currencySymbol + price + '</bdi></span>';
      }
    }

    // RecurPay subscription widget: update selling price when variant changes (app block does not update on its own)
    var recurpayPrices = productScope.querySelectorAll('.recurpay__group_selling_price .money, .recurpay__group_price_wrapper .money');
    recurpayPrices.forEach(function (el) {
      el.textContent = formattedPrice;
    });
  }
})();

