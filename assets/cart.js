/**
 * Cart Page Handler
 * Handles cart updates, quantity changes, and item removal
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const cartForm = document.getElementById('cart-form');
    if (!cartForm) return;

    // Handle quantity updates
    const quantityInputs = cartForm.querySelectorAll('[data-cart-item-quantity]');
    quantityInputs.forEach(function(input) {
      input.addEventListener('change', function(e) {
        const key = e.target.dataset.cartItemQuantity;
        const quantity = parseInt(e.target.value);
        
        if (quantity < 0) {
          e.target.value = 0;
          return;
        }
        
        updateCartItem(key, quantity);
      });
    });

    // Handle item removal
    const removeButtons = cartForm.querySelectorAll('[data-cart-item-remove]');
    removeButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const key = e.target.dataset.cartItemRemove;
        
        if (confirm('Are you sure you want to remove this item from your cart?')) {
          updateCartItem(key, 0);
        }
      });
    });

    // Handle coupon code
    const couponButton = cartForm.querySelector('button[name="apply_coupon"]');
    if (couponButton) {
      couponButton.addEventListener('click', function(e) {
        e.preventDefault();
        const couponInput = cartForm.querySelector('input[name="discount"]');
        const discountCode = couponInput ? couponInput.value.trim() : '';
        
        if (discountCode) {
          applyCoupon(discountCode);
        }
      });
    }

    // Handle update cart button
    const updateButton = cartForm.querySelector('button[name="update_cart"]');
    if (updateButton) {
      updateButton.addEventListener('click', function(e) {
        e.preventDefault();
        updateCart();
      });
    }
  });

  // Update cart item quantity
  function updateCartItem(key, quantity) {
    const formData = new FormData();
    formData.append('updates[' + key + ']', quantity);

    fetch('/cart/update.js', {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(cart) {
      // Reload page to show updated cart
      window.location.reload();
    })
    .catch(function(error) {
      console.error('Cart update error:', error);
      alert('Error updating cart. Please try again.');
    });
  }

  // Apply coupon code
  function applyCoupon(code) {
    fetch('/discount/' + encodeURIComponent(code), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      if (response.ok) {
        // Reload to apply discount
        window.location.reload();
      } else {
        alert('Invalid coupon code. Please try again.');
      }
    })
    .catch(function(error) {
      console.error('Coupon error:', error);
      alert('Error applying coupon. Please try again.');
    });
  }

  // Update entire cart
  function updateCart() {
    const form = document.getElementById('cart-form');
    if (!form) return;

    const formData = new FormData(form);

    fetch('/cart/update.js', {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(cart) {
      // Reload page to show updated cart
      window.location.reload();
    })
    .catch(function(error) {
      console.error('Cart update error:', error);
      alert('Error updating cart. Please try again.');
    });
  }
})();

