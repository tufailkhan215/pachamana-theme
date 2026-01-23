# Prompt: Integrate `{{ content_for_layout }}` Inside `main-page.liquid` Section Container

## Problem Analysis

### Current Structure:
1. **`theme.liquid`** (line 298-301):
   - For non-index, non-article pages, renders `{{ content_for_layout }}` in a simple `<main>` tag
   - This renders ALL sections from the page template in order

2. **`main-page.liquid`** section:
   - Contains Elementor wrapper structure (`elementor-82`)
   - Has background slideshow, shape dividers, page title
   - Renders `{{ page.content }}` at line 89 (which contains the loyalty rewards section embedded in page content)
   - Closes with a divider

3. **Page Template** (`page.earn-rewards.json`):
   - Section order: `["main", "section_loyalty_rewards_9LhgjB"]`
   - `main` = `main-page` section (renders first)
   - `section_loyalty_rewards_9LhgjB` = standalone loyalty rewards section (renders second, OUTSIDE main-page)

### The Issue:
- `{{ page.content }}` renders the loyalty rewards content (embedded in page editor)
- `{{ content_for_layout }}` in `theme.liquid` renders sections in order:
  1. `main-page` section (with `{{ page.content }}` inside)
  2. `section-loyalty-rewards` section (rendered OUTSIDE, after main-page closes)
- User wants additional sections (like `section-loyalty-rewards`) to appear INSIDE the `main-page` container, right after `{{ page.content }}`, within the same Elementor container structure

### Visual Structure Desired:
```
<div class="elementor-82">
  <div class="elementor-element-e3c6f55"> <!-- Background slideshow -->
  <div class="elementor-element-56401c2"> <!-- Container with shape divider -->
    <div class="elementor-element-9e3f199"> <!-- Inner container -->
      <h2>Page Title</h2>
      <divider />
      {{ page.content }} <!-- Loyalty rewards (embedded) -->
      {{ content_for_layout }} <!-- Additional sections should appear HERE -->
      <divider />
    </div>
  </div>
</div>
```

## Solution Approaches

### **Approach 1: JavaScript-Based Section Movement (Recommended)**
**Concept:** Use JavaScript to find sections rendered outside `main-page` and move them inside the container.

**Implementation:**
1. Add a placeholder/marker div after `{{ page.content }}` in `main-page.liquid`
2. Use JavaScript to:
   - Find all `.shopify-section` elements that are siblings of the `main-page` section
   - Filter out the `main-page` section itself
   - Move these sections inside the `elementor-element-9e3f199` container, after `{{ page.content }}`
   - Ensure sections maintain their Shopify section wrapper structure for theme editor compatibility

**Pros:**
- Works with Shopify's section rendering system
- Maintains theme editor compatibility
- No changes to `theme.liquid` structure
- Handles dynamic section additions/removals

**Cons:**
- Requires JavaScript execution
- May have brief flash of content in wrong position
- Needs careful handling of section IDs for theme editor

### **Approach 2: Liquid-Based Section Filtering**
**Concept:** Use Liquid to iterate through sections and render only non-main-page sections inside `main-page.liquid`.

**Implementation:**
1. Access sections via `template.sections` or similar Liquid object
2. Loop through sections and filter out `main-page` type
3. Render filtered sections after `{{ page.content }}`
4. Modify `theme.liquid` to NOT render `content_for_layout` for page templates, or render it conditionally

**Pros:**
- No JavaScript required
- Clean server-side rendering
- No content flash

**Cons:**
- Shopify Liquid may not provide direct access to template sections array
- May require custom section rendering logic
- More complex to maintain

### **Approach 3: Template Structure Modification**
**Concept:** Restructure how sections are organized in the template.

**Implementation:**
1. Keep `main-page` as the only section in template order
2. Add other sections as blocks within `main-page` section
3. Render blocks after `{{ page.content }}` inside `main-page.liquid`

**Pros:**
- Cleanest structure
- All content in one section
- Easy to manage

**Cons:**
- Requires converting sections to blocks
- May lose section-specific settings
- Less flexible for theme editor

## Recommended Solution: Approach 1 (JavaScript-Based)

### Detailed Implementation Plan:

#### Step 1: Add Insertion Point in `main-page.liquid`
After line 89 (`{{ page.content }}`), add a marker div:
```liquid
{{ page.content }}
<div id="main-page-content-insertion-point" class="main-page-content-insertion-point" style="display: none;"></div>
```

#### Step 2: Add JavaScript to Move Sections
Add JavaScript at the end of `main-page.liquid` (before `{% schema %}`):
```javascript
<script>
(function() {
  'use strict';
  
  function moveSectionsIntoMainPage() {
    // Find the main-page section wrapper
    var mainPageSection = document.querySelector('.shopify-section[data-section-type="main-page"]');
    if (!mainPageSection) return;
    
    // Find the insertion point inside main-page
    var insertionPoint = document.querySelector('#main-page-content-insertion-point');
    if (!insertionPoint) return;
    
    // Find the target container (elementor-element-9e3f199)
    var targetContainer = insertionPoint.closest('.elementor-element-9e3f199');
    if (!targetContainer) {
      // Fallback: find by data-id
      targetContainer = document.querySelector('[data-id="9e3f199"]');
    }
    if (!targetContainer) return;
    
    // Find all sections that are siblings of main-page section (rendered outside)
    var allSections = document.querySelectorAll('.shopify-section');
    var sectionsToMove = [];
    
    allSections.forEach(function(section) {
      // Skip if it's the main-page section itself
      if (section === mainPageSection) return;
      
      // Skip if already inside main-page
      if (mainPageSection.contains(section)) return;
      
      // Check if section comes after main-page in DOM
      var sectionIndex = Array.from(section.parentNode.children).indexOf(section);
      var mainPageIndex = Array.from(mainPageSection.parentNode.children).indexOf(mainPageSection);
      
      if (sectionIndex > mainPageIndex) {
        sectionsToMove.push(section);
      }
    });
    
    // Move sections into target container, after insertion point
    sectionsToMove.forEach(function(section) {
      // Clone to preserve original for theme editor
      var clonedSection = section.cloneNode(true);
      clonedSection.classList.add('moved-into-main-page');
      
      // Insert after insertion point
      if (insertionPoint.nextSibling) {
        targetContainer.insertBefore(clonedSection, insertionPoint.nextSibling);
      } else {
        targetContainer.appendChild(clonedSection);
      }
      
      // Hide original (but keep for theme editor compatibility)
      if (!Shopify || !Shopify.designMode) {
        section.style.display = 'none';
      }
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(moveSectionsIntoMainPage, 500);
    });
  } else {
    setTimeout(moveSectionsIntoMainPage, 500);
  }
  
  // Re-run on section load (for Shopify theme editor)
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', function() {
      setTimeout(moveSectionsIntoMainPage, 500);
    });
  }
  
  // Also try after window load
  window.addEventListener('load', function() {
    setTimeout(moveSectionsIntoMainPage, 1000);
  });
})();
</script>
```

#### Step 3: Ensure CSS Compatibility
Add CSS to ensure moved sections maintain proper styling within the Elementor container:
```css
.elementor-element-9e3f199 .shopify-section.moved-into-main-page {
  width: 100%;
  display: block;
  position: relative;
}
```

## Alternative: Liquid-Based Approach (If JavaScript Not Preferred)

### Modify `main-page.liquid` to Accept Section Blocks:
1. Add a block type in schema for "additional_section"
2. Use `{% section %}` tag (but this causes "Cannot render sections inside sections" error)
3. Use JavaScript workaround (same as Approach 1)

### Modify `theme.liquid` to Conditionally Render:
1. Check if template has `main-page` section
2. If yes, don't render `content_for_layout` in else block
3. Let `main-page` section handle rendering of other sections via JavaScript

## Key Considerations

1. **Theme Editor Compatibility:**
   - Sections must maintain `.shopify-section` wrapper
   - Section IDs must be preserved
   - Live editing must work for moved sections

2. **Performance:**
   - JavaScript execution timing
   - Avoid content flash
   - Handle late-loading sections

3. **Maintainability:**
   - Clear code comments
   - Easy to understand flow
   - Works with dynamic section additions

4. **Edge Cases:**
   - Pages without main-page section
   - Pages with multiple main-page sections
   - Sections that should remain outside

## Testing Checklist

- [ ] Sections appear inside main-page container after page.content
- [ ] Theme editor live editing works for moved sections
- [ ] No duplicate content rendering
- [ ] Proper styling maintained
- [ ] Works with dynamically added sections
- [ ] No JavaScript errors in console
- [ ] Mobile responsive behavior preserved
