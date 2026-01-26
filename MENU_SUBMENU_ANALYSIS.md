# Menu Submenu Dropdown Analysis & Suggestions

## Problem Summary
- ✅ **First-level dropdown works** - Clicking parent menu items opens their dropdown menus
- ❌ **Second-level submenu does not show** - Clicking items with nested children does not open submenu dropdowns

## Root Cause Analysis

### **1. Missing `dropdown-toggle` Class on Submenu Items**

**Issue in `snippets/menu.liquid`:**
- **Line 11:** First-level items with children have `class="dropdown-toggle"` on the `<a>` tag
- **Line 19:** Second-level items with children do NOT have `dropdown-toggle` class on the `<a>` tag
- **Result:** JavaScript cannot find submenu items to attach click handlers

**Current Code:**
```liquid
{%- for child_link in link.links -%}
  <li class="menu-item {% if child_link.links.size > 0 %}menu-item-has-children dropdown-submenu{% endif %}">
    <a href="{{ child_link.url }}" data-text="{{ child_link.title }}">
      {{ child_link.title }}
    </a>
```

**Missing:** The `<a>` tag should have `class="dropdown-toggle"` when `child_link.links.size > 0`

---

### **2. JavaScript Only Targets `.dropdown-toggle` Elements**

**Issue in `layout/theme.liquid` (Line 2497):**
```javascript
var dropdownToggles = document.querySelectorAll('.plus-navigation-menu .dropdown-toggle');
```

**Problem:**
- Only finds first-level dropdown toggles (which have the class)
- Submenu items don't have this class, so they're never found
- No event handlers are attached to submenu items

**Current Behavior:**
- First-level: ✅ Works (has `dropdown-toggle` class)
- Second-level: ❌ Doesn't work (missing `dropdown-toggle` class)

---

### **3. JavaScript Closes ALL Dropdowns Including Nested Ones**

**Issue in `layout/theme.liquid` (Line 2511):**
```javascript
var allDropdowns = document.querySelectorAll('.plus-navigation-menu .dropdown-menu');
allDropdowns.forEach(function(dropdown) {
  if (dropdown !== dropdownMenu && dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
    // ...
  }
});
```

**Problem:**
- When opening a first-level dropdown, it closes ALL other `.dropdown-menu` elements
- This includes nested submenu dropdowns that should remain open
- Should only close dropdowns at the same level, not nested children

**Expected Behavior:**
- When opening a first-level dropdown, close other first-level dropdowns
- Keep nested submenus open if their parent is still open

---

### **4. CSS Positioning for Nested Dropdowns**

**Issue in `layout/theme.liquid` (Lines 1940-1947):**
```css
.plus-navigation-menu .dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 160px;
}
```

**Problem:**
- All `.dropdown-menu` elements are positioned `left: 0` (aligned to left edge of parent)
- Nested submenus should be positioned to the right of their parent item
- No specific CSS rule for `.dropdown-submenu > .dropdown-menu`

**Missing CSS:**
- Rule for `.dropdown-submenu > .dropdown-menu` to position to the right
- Higher z-index for nested dropdowns
- Positioning relative to parent menu item, not parent dropdown

---

### **5. Mobile Menu Submenu Handling**

**Issue in `layout/theme.liquid` (Lines 2635-2664):**
- Mobile menu click handler also only works for items with `.dropdown-toggle`
- Submenu items in mobile menu won't trigger dropdowns
- Same issue: missing class and no event handlers

---

## Detailed Suggestions

### **Suggestion 1: Add `dropdown-toggle` Class to Submenu Items**

**File:** `snippets/menu.liquid`  
**Line:** 19

**Change:**
```liquid
<a href="{{ child_link.url }}" data-text="{{ child_link.title }}">
```

**To:**
```liquid
<a href="{{ child_link.url }}" 
   {% if child_link.links.size > 0 %}class="dropdown-toggle" aria-haspopup="true"{% endif %}
   data-text="{{ child_link.title }}">
```

**Why:** This allows JavaScript to find and attach click handlers to submenu items.

---

### **Suggestion 2: Update JavaScript to Handle Nested Dropdowns**

**File:** `layout/theme.liquid`  
**Lines:** 2510-2520

**Current Code:**
```javascript
// Close other open dropdowns
var allDropdowns = document.querySelectorAll('.plus-navigation-menu .dropdown-menu');
allDropdowns.forEach(function(dropdown) {
  if (dropdown !== dropdownMenu && dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
    var otherMenuItem = dropdown.closest('.menu-item');
    if (otherMenuItem) {
      otherMenuItem.classList.remove('open');
    }
  }
});
```

**Suggested Change:**
```javascript
// Close other open dropdowns at the same level only
// Don't close nested dropdowns if their parent is still open
var allDropdowns = document.querySelectorAll('.plus-navigation-menu .dropdown-menu');
allDropdowns.forEach(function(dropdown) {
  if (dropdown !== dropdownMenu && dropdown.style.display === 'block') {
    // Check if this dropdown is a child of the current menuItem
    // If so, don't close it (it's a nested submenu)
    var dropdownParent = dropdown.closest('.menu-item');
    var currentParent = menuItem;
    
    // Only close if it's at the same level or a sibling
    if (dropdownParent && !currentParent.contains(dropdownParent)) {
      dropdown.style.display = 'none';
      if (dropdownParent) {
        dropdownParent.classList.remove('open');
      }
    }
  }
});
```

**Why:** Prevents closing nested submenus when opening parent dropdowns.

---

### **Suggestion 3: Add CSS for Nested Submenu Positioning**

**File:** `layout/theme.liquid`  
**After Line 1947**

**Add:**
```css
/* Nested submenu positioning - position to the right of parent item */
.plus-navigation-menu .dropdown-submenu > .dropdown-menu {
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 0;
  z-index: 1001; /* Higher than parent dropdown */
  min-width: 160px;
}

/* Alternative: Position to the left if near right edge of screen */
.plus-navigation-menu .dropdown-submenu.dropdown-submenu-left > .dropdown-menu {
  left: auto;
  right: 100%;
  margin-right: 0;
}

/* Ensure parent menu item is positioned relatively for absolute children */
.plus-navigation-menu .dropdown-submenu {
  position: relative;
}
```

**Why:** Positions nested submenus correctly to the right of their parent item.

---

### **Suggestion 4: Update JavaScript to Handle Submenu Clicks**

**File:** `layout/theme.liquid`  
**Lines:** 2497-2533

**Current Code:**
```javascript
var dropdownToggles = document.querySelectorAll('.plus-navigation-menu .dropdown-toggle');
```

**Suggested Enhancement:**
```javascript
// Handle both first-level and nested dropdown toggles
var dropdownToggles = document.querySelectorAll('.plus-navigation-menu .dropdown-toggle');

dropdownToggles.forEach(function(toggle) {
  toggle.addEventListener('click', function(e) {
    var navInner = toggle.closest('.plus-navigation-inner');
    if (navInner && navInner.classList.contains('menu-click')) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling to parent dropdown
      
      var menuItem = toggle.closest('.menu-item');
      var dropdownMenu = menuItem ? menuItem.querySelector('.dropdown-menu') : null;
      
      if (dropdownMenu) {
        // Check if this is a nested submenu
        var isSubmenu = menuItem.classList.contains('dropdown-submenu');
        
        if (isSubmenu) {
          // For submenus, only close other submenus at the same level
          var parentDropdown = menuItem.closest('.dropdown-menu');
          if (parentDropdown) {
            var siblingSubmenus = parentDropdown.querySelectorAll('.dropdown-submenu > .dropdown-menu');
            siblingSubmenus.forEach(function(sibling) {
              if (sibling !== dropdownMenu && sibling.style.display === 'block') {
                sibling.style.display = 'none';
                var siblingItem = sibling.closest('.menu-item');
                if (siblingItem) {
                  siblingItem.classList.remove('open');
                }
              }
            });
          }
        } else {
          // For first-level dropdowns, close other first-level dropdowns
          var allFirstLevelDropdowns = document.querySelectorAll('.plus-navigation-menu > ul > .menu-item > .dropdown-menu');
          allFirstLevelDropdowns.forEach(function(dropdown) {
            if (dropdown !== dropdownMenu && dropdown.style.display === 'block') {
              dropdown.style.display = 'none';
              var otherMenuItem = dropdown.closest('.menu-item');
              if (otherMenuItem) {
                otherMenuItem.classList.remove('open');
              }
            }
          });
        }
        
        // Toggle current dropdown
        if (dropdownMenu.style.display === 'block') {
          dropdownMenu.style.display = 'none';
          menuItem.classList.remove('open');
        } else {
          dropdownMenu.style.display = 'block';
          menuItem.classList.add('open');
        }
      }
    }
  });
});
```

**Why:** Properly handles clicks on both first-level and nested submenu items, preventing conflicts.

---

### **Suggestion 5: Update Mobile Menu Submenu Handling**

**File:** `layout/theme.liquid`  
**Lines:** 2620-2664

**Similar Issues:**
- Mobile menu also needs to handle submenu items with `dropdown-toggle` class
- Should use same logic as desktop but with mobile-specific positioning

**Suggested Addition:**
```javascript
// Mobile menu submenu handling
var mobileSubmenuToggles = document.querySelectorAll('.plus-mobile-menu .dropdown-toggle');
mobileSubmenuToggles.forEach(function(toggle) {
  toggle.addEventListener('click', function(e) {
    var menuItem = toggle.closest('.menu-item');
    var dropdownMenu = menuItem ? menuItem.querySelector('.dropdown-menu') : null;
    
    if (dropdownMenu) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle submenu
      if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
        menuItem.classList.remove('open');
      } else {
        // Close other submenus at same level
        var parent = menuItem.parentElement;
        if (parent) {
          var siblings = parent.querySelectorAll('.menu-item');
          siblings.forEach(function(sibling) {
            if (sibling !== menuItem) {
              var siblingDropdown = sibling.querySelector('.dropdown-menu');
              if (siblingDropdown) {
                siblingDropdown.style.display = 'none';
                sibling.classList.remove('open');
              }
            }
          });
        }
        
        dropdownMenu.style.display = 'block';
        menuItem.classList.add('open');
      }
    }
  });
});
```

**Why:** Enables submenu functionality in mobile menu as well.

---

### **Suggestion 6: Add Hover Support for Submenus (Optional)**

**File:** `layout/theme.liquid`  
**Lines:** 2680-2707

**Current Code:**
- Only handles `.menu-item-has-children` for hover
- Should also work for nested submenus

**Suggested Enhancement:**
```javascript
// Hover functionality should also work for nested submenus
var navMenus = document.querySelectorAll('.plus-navigation-inner:not(.menu-click) .plus-navigation-menu');
navMenus.forEach(function(navMenu) {
  // Handle both first-level and nested menu items
  var menuItems = navMenu.querySelectorAll('.menu-item-has-children');
  
  menuItems.forEach(function(menuItem) {
    var newMenuItem = menuItem.cloneNode(true);
    menuItem.parentNode.replaceChild(newMenuItem, menuItem);
    
    newMenuItem.addEventListener('mouseenter', function() {
      var dropdownMenu = newMenuItem.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'block';
        newMenuItem.classList.add('open');
      }
    });
    
    newMenuItem.addEventListener('mouseleave', function(e) {
      // Check if mouse is moving to a child submenu
      var relatedTarget = e.relatedTarget;
      if (relatedTarget && newMenuItem.contains(relatedTarget)) {
        return; // Don't close if moving to child
      }
      
      var dropdownMenu = newMenuItem.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
        newMenuItem.classList.remove('open');
      }
    });
  });
});
```

**Why:** Enables hover functionality for nested submenus in non-click menus.

---

## Summary of Missing Elements

1. ❌ **`dropdown-toggle` class missing on submenu `<a>` tags**
2. ❌ **JavaScript doesn't find submenu items (no class to target)**
3. ❌ **JavaScript closes nested dropdowns when opening parent**
4. ❌ **CSS doesn't position nested submenus correctly**
5. ❌ **No specific handling for submenu clicks vs parent clicks**
6. ❌ **Mobile menu doesn't handle submenus**

## Priority Fix Order

1. **HIGH:** Add `dropdown-toggle` class to submenu items (Suggestion 1)
2. **HIGH:** Update JavaScript to handle submenu clicks (Suggestion 4)
3. **MEDIUM:** Add CSS for nested submenu positioning (Suggestion 3)
4. **MEDIUM:** Fix JavaScript to not close nested dropdowns (Suggestion 2)
5. **LOW:** Update mobile menu submenu handling (Suggestion 5)
6. **LOW:** Enhance hover support for submenus (Suggestion 6)

## Testing Checklist

After implementing fixes:
- [ ] First-level dropdown opens on click
- [ ] Second-level submenu opens on click
- [ ] Opening first-level doesn't close open submenus
- [ ] Opening submenu doesn't close parent dropdown
- [ ] Nested submenus position correctly (to the right)
- [ ] Mobile menu submenus work correctly
- [ ] Hover works for submenus (if not click-based menu)
- [ ] Clicking outside closes all dropdowns
- [ ] Z-index allows submenus to appear above parent dropdowns
