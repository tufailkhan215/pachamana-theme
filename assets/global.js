/**
 * Global JavaScript for Pacha Mana Theme
 */

// Cart drawer functionality
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.overlay = this.querySelector('[data-cart-drawer-overlay]');
    this.closeButton = this.querySelector('[data-cart-drawer-close]');
    
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
    
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }
  
  open() {
    this.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  
  isOpen() {
    return this.getAttribute('aria-hidden') === 'false';
  }
}

customElements.define('cart-drawer', CartDrawer);

// Predictive search functionality
class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.overlay = this.querySelector('[data-predictive-search-overlay]');
    this.closeButton = this.querySelector('[data-predictive-search-close]');
    this.input = this.querySelector('[data-predictive-search-input]');
    this.results = this.querySelector('[data-predictive-search-results]');
    
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
    
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }
    
    if (this.input) {
      this.input.addEventListener('input', (e) => {
        this.debounceSearch(e.target.value);
      });
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }
  
  open() {
    this.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (this.input) {
      this.input.focus();
    }
  }
  
  close() {
    this.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  
  isOpen() {
    return this.getAttribute('aria-hidden') === 'false';
  }
  
  debounceSearch(query) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (query.length >= 3) {
        this.performSearch(query);
      } else {
        if (this.results) {
          this.results.innerHTML = '';
        }
      }
    }, 300);
  }
  
  async performSearch(query) {
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=4`);
      const data = await response.json();
      
      if (this.results) {
        this.renderResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }
  
  renderResults(data) {
    if (!this.results) return;
    
    if (data.resources.results.products.length === 0) {
      this.results.innerHTML = '<p>No results found</p>';
      return;
    }
    
    let html = '<div class="predictive-search__products">';
    data.resources.results.products.forEach(product => {
      html += `
        <a href="${product.url}" class="predictive-search__product">
          ${product.image ? `<img src="${product.image}" alt="${product.title}">` : ''}
          <div>
            <h3>${product.title}</h3>
            <p>${product.price}</p>
          </div>
        </a>
      `;
    });
    html += '</div>';
    
    this.results.innerHTML = html;
  }
}

customElements.define('predictive-search', PredictiveSearch);

// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
  // Open cart drawer
  document.querySelectorAll('[data-cart-drawer-open]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const cartDrawer = document.getElementById('cart-drawer');
      if (cartDrawer) {
        cartDrawer.open();
      }
    });
  });
  
  // Open predictive search
  document.querySelectorAll('[data-predictive-search-open]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const search = document.getElementById('predictive-search');
      if (search) {
        search.open();
      }
    });
  });
  
  // Cart item quantity updates
  document.querySelectorAll('[data-cart-item-quantity]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const key = e.target.dataset.cartItemQuantity;
      const quantity = parseInt(e.target.value);
      
      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: key,
            quantity: quantity
          })
        });
        
        if (response.ok) {
          location.reload();
        }
      } catch (error) {
        console.error('Cart update error:', error);
      }
    });
  });
  
  // Cart item removal
  document.querySelectorAll('[data-cart-item-remove]').forEach(button => {
    button.addEventListener('click', async (e) => {
      const key = e.target.dataset.cartItemRemove;
      
      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: key,
            quantity: 0
          })
        });
        
        if (response.ok) {
          location.reload();
        }
      } catch (error) {
        console.error('Cart removal error:', error);
      }
    });
  });
});

