/**
 * Ice Pack upsell toggle.
 * Wires [data-ice-pack-toggle] checkboxes on the cart page and drawer
 * to /cart/add.js and /cart/change.js, mirroring the reload pattern
 * already used by assets/cart.js.
 */
(function () {
  'use strict';

  function setLoading(wrapper, loading) {
    wrapper.setAttribute('data-ice-pack-loading', loading ? 'true' : 'false');
  }

  function revert(input, prevChecked) {
    input.checked = prevChecked;
  }

  function fetchCart() {
    return fetch('/cart.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); });
  }

  function addIcePack(variantId) {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    }).then(function (r) {
      if (!r.ok) { return r.json().then(function (e) { throw new Error(e.description || 'Add failed'); }); }
      return r.json();
    });
  }

  function removeIcePack(itemKey) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: itemKey, quantity: 0 })
    }).then(function (r) {
      if (!r.ok) { return r.json().then(function (e) { throw new Error(e.description || 'Remove failed'); }); }
      return r.json();
    });
  }

  function findItemKey(cart, variantId) {
    var vid = String(variantId);
    for (var i = 0; i < cart.items.length; i++) {
      if (String(cart.items[i].variant_id) === vid) return cart.items[i].key;
    }
    return null;
  }

  function init() {
    var wrappers = document.querySelectorAll('[data-ice-pack-upsell]');
    if (!wrappers.length) return;

    wrappers.forEach(function (wrapper) {
      var input = wrapper.querySelector('[data-ice-pack-toggle]');
      if (!input || input.dataset.icePackBound === 'true') return;
      input.dataset.icePackBound = 'true';

      input.addEventListener('change', function (e) {
        var nextChecked = e.target.checked;
        var prevChecked = !nextChecked;
        var variantId = wrapper.dataset.icePackVariantId;
        var itemKey = wrapper.dataset.icePackItemKey;

        if (!variantId) {
          console.error('[ice-pack] missing variant id');
          revert(input, prevChecked);
          return;
        }

        setLoading(wrapper, true);

        var action;
        if (nextChecked) {
          action = addIcePack(variantId);
        } else if (itemKey) {
          action = removeIcePack(itemKey);
        } else {
          // unchecking but we don't know the key — look it up
          action = fetchCart().then(function (cart) {
            var key = findItemKey(cart, variantId);
            if (!key) throw new Error('Ice pack not found in cart');
            return removeIcePack(key);
          });
        }

        action
          .then(function () { window.location.reload(); })
          .catch(function (err) {
            console.error('[ice-pack]', err);
            setLoading(wrapper, false);
            revert(input, prevChecked);
            alert('Could not update the ice pack. Please try again.');
          });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
