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
- User wants additional sections (like `section-loyalty-rewards`) to appear INSIDE the `main-page` container, within the same Elementor container structure

### **Critical Limitation: Why `{{ content_for_layout }}` Cannot Work Inside `main-page.liquid`**

**The Problem:**
- `main-page` is itself a **section** (defined in `sections/main-page.liquid`)
- `{{ content_for_layout }}` renders **ALL sections** from the page template, including `main-page` itself
- If you put `{{ content_for_layout }}` inside `main-page.liquid`, it would:
  1. Render `main-page` section again (duplication/infinite loop)
  2. Render all other sections inside `main-page`
  3. Cause rendering conflicts and duplicate content

**Why This Happens:**
- Shopify's `{{ content_for_layout }}` is a special Liquid variable that outputs all sections from the template's `"order"` array
- It cannot be filtered to exclude the current section
- It cannot be used conditionally to render only specific sections
- It's designed to render at the template level (`theme.liquid`), not inside individual sections

**Solution:** Use JavaScript to move sections (as described in Approach 1) - this is the only viable method that works with Shopify's section rendering system.

## Managing Main Page Schema: Full Width vs Container Width

### **Problem:**
- `main-page` section currently only has slideshow settings in its schema
- No control over page width (full width vs container width)
- Containers (`elementor-element-56401c2` and `elementor-element-9e3f199`) have fixed structure
- Need to manage width settings at the template/section level

### **Suggested Schema Settings for `main-page.liquid`:**

Add these settings to the `main-page.liquid` schema (in the `"settings"` array):

```json
{
  "type": "header",
  "content": "Page Layout Settings"
},
{
  "type": "select",
  "id": "layout_type",
  "label": "Layout Type",
  "options": [
    {
      "value": "full",
      "label": "Full Layout (with title, dividers, page.content)"
    },
    {
      "value": "minimal",
      "label": "Minimal Layout (slideshow + content container only)"
    }
  ],
  "default": "full"
},
{
  "type": "header",
  "content": "Width Settings"
},
{
  "type": "checkbox",
  "id": "page_full_width",
  "label": "Full Width Page",
  "default": false,
  "info": "If enabled, page content will span the full width of the viewport"
},
{
  "type": "range",
  "id": "page_max_width",
  "label": "Page Max Width",
  "min": 800,
  "max": 1920,
  "step": 50,
  "unit": "px",
  "default": 1200,
  "info": "Maximum width of the page container. Only applies if Full Width is disabled."
},
{
  "type": "range",
  "id": "content_container_max_width",
  "label": "Content Container Max Width (Type 1 only)",
  "min": 600,
  "max": 1400,
  "step": 50,
  "unit": "px",
  "default": 1200,
  "info": "Maximum width of the inner content container (elementor-element-9e3f199). Only applies to Full Layout."
},
{
  "type": "select",
  "id": "container_alignment",
  "label": "Container Alignment",
  "options": [
    {
      "value": "center",
      "label": "Center"
    },
    {
      "value": "left",
      "label": "Left"
    },
    {
      "value": "right",
      "label": "Right"
    }
  ],
  "default": "center"
}
```

### **Applying Width Settings to Containers:**

#### **For Type 1 (Full Layout):**

Apply settings to both containers:
1. **`elementor-element-56401c2`** (outer container with shape divider)
2. **`elementor-element-9e3f199`** (inner content container)

**Implementation in `main-page.liquid`:**

```liquid
{%- assign page_full_width = section.settings.page_full_width | default: false -%}
{%- assign page_max_width = section.settings.page_max_width | default: 1200 -%}
{%- assign content_max_width = section.settings.content_container_max_width | default: 1200 -%}
{%- assign container_align = section.settings.container_alignment | default: 'center' -%}

<div class="elementor-element-56401c2 e-flex e-con-boxed e-con e-parent e-lazyloaded" 
     data-id="56401c2" 
     data-element_type="container" 
     {%- if page_full_width -%}
       style="width: 100%; max-width: 100%;"
     {%- else -%}
       style="width: 100%; max-width: {{ page_max_width }}px; margin-left: auto; margin-right: auto;"
     {%- endif -%}>
  <div class="e-con-inner">
    <!-- Shape divider top -->
    <div class="elementor-element-9e3f199 e-flex e-con-boxed e-con e-child" 
         data-id="9e3f199" 
         data-element_type="container"
         {%- if page_full_width -%}
           style="width: 100%; max-width: 100%;"
         {%- else -%}
           style="width: 100%; max-width: {{ content_max_width }}px; margin-left: {% if container_align == 'center' %}auto{% elsif container_align == 'right' %}0{% else %}0{% endif %}; margin-right: {% if container_align == 'center' %}auto{% elsif container_align == 'right' %}0{% else %}0{% endif %};"
         {%- endif -%}>
      <!-- Page title, dividers, page.content, etc. -->
    </div>
  </div>
</div>
```

#### **For Type 2 (Minimal Layout):**

Apply settings only to `elementor-element-56401c2`:

```liquid
<div class="elementor-element-56401c2 e-flex e-con-boxed e-con e-parent e-lazyloaded" 
     data-id="56401c2" 
     data-element_type="container" 
     {%- if page_full_width -%}
       style="width: 100%; max-width: 100%;"
     {%- else -%}
       style="width: 100%; max-width: {{ page_max_width }}px; margin-left: auto; margin-right: auto;"
     {%- endif -%}>
  <div class="e-con-inner">
    <!-- Shape divider top -->
    <!-- Content insertion point here -->
  </div>
</div>
```

### **Alternative: CSS-Based Approach**

Instead of inline styles, use CSS classes and dynamic style blocks:

```liquid
<style>
  .main-page-outer-container-{{ section.id }} {
    {%- if section.settings.page_full_width -%}
      width: 100%;
      max-width: 100%;
    {%- else -%}
      width: 100%;
      max-width: {{ section.settings.page_max_width }}px;
      margin-left: auto;
      margin-right: auto;
    {%- endif -%}
  }
  
  {%- if section.settings.layout_type == 'full' -%}
  .main-page-inner-container-{{ section.id }} {
    {%- if section.settings.page_full_width -%}
      width: 100%;
      max-width: 100%;
    {%- else -%}
      width: 100%;
      max-width: {{ section.settings.content_container_max_width }}px;
      margin-left: auto;
      margin-right: auto;
    {%- endif -%}
  }
  {%- endif -%}
</style>

<div class="elementor-element-56401c2 main-page-outer-container-{{ section.id }}">
  <!-- ... -->
  {%- if section.settings.layout_type == 'full' -%}
    <div class="elementor-element-9e3f199 main-page-inner-container-{{ section.id }}">
      <!-- ... -->
    </div>
  {%- endif -%}
</div>
```

### **Template-Level Management:**

**In `templates/page.earn-rewards.json` (or other page templates):**

The `main-page` section settings can be configured per template:

```json
{
  "sections": {
    "main": {
      "type": "main-page",
      "settings": {
        "layout_type": "full",
        "page_full_width": false,
        "page_max_width": 1200,
        "content_container_max_width": 1200,
        "container_alignment": "center",
        "slide_duration": 8000,
        "transition_duration": 1000,
        "loop": true,
        "ken_burns": true,
        "ken_burns_direction": "in"
      }
    }
  }
}
```

**Benefits:**
- Each page template can have different width settings
- Settings are manageable through Shopify theme editor
- No need to edit Liquid files for width changes
- Consistent with how other sections (like `section-loyalty-rewards`) handle width

## Two Types of Main Page Layouts

### **Type 1: Full Layout (With Title, Dividers, and Page Content)**
**Structure:**
```
<div class="elementor-82">
  <div class="elementor-element-e3c6f55"> <!-- Background slideshow container -->
    <!-- Slideshow content -->
    <div class="e-con-inner">
      <!-- Shape divider bottom -->
    </div>
  </div>
  <div class="elementor-element-56401c2"> <!-- Container with shape divider top -->
    <div class="e-con-inner">
      <!-- Shape divider top -->
      <div class="elementor-element-9e3f199"> <!-- Inner content container -->
        <h2>Page Title</h2> <!-- elementor-element-7d143d1 -->
        <divider /> <!-- elementor-element-cdd93b1 -->
        {{ page.content }} <!-- Embedded page content -->
        {{ content_for_layout }} <!-- Additional sections should appear HERE -->
        <divider /> <!-- elementor-element-d496f51 -->
      </div>
    </div>
  </div>
</div>
```

**Characteristics:**
- Includes page title heading (`elementor-element-7d143d1`)
- Includes top divider (`elementor-element-cdd93b1`)
- Includes `{{ page.content }}` (embedded content)
- Includes bottom divider (`elementor-element-d496f51`)
- All wrapped in `elementor-element-9e3f199` inner container
- **Target Container for `content_for_layout`:** `.elementor-element-9e3f199` (after `{{ page.content }}`)

### **Type 2: Minimal Layout (Slideshow + Content Container Only)**
**Structure:**
```
<div class="elementor-82">
  <div class="elementor-element-e3c6f55"> <!-- Background slideshow container -->
    <!-- Slideshow content -->
    <div class="e-con-inner">
      <!-- Shape divider bottom -->
    </div>
  </div>
  <div class="elementor-element-56401c2"> <!-- Container with shape divider top -->
    <div class="e-con-inner">
      <!-- Shape divider top -->
      {{ content_for_layout }} <!-- Additional sections should appear HERE directly -->
    </div>
  </div>
</div>
```

**Characteristics:**
- NO page title heading
- NO top divider
- NO `{{ page.content }}`
- NO bottom divider
- NO `elementor-element-9e3f199` inner container
- **Target Container for `content_for_layout`:** `.elementor-element-56401c2 .e-con-inner` (directly inside, after shape divider)

### Visual Structure Comparison:

**Type 1 (Full Layout):**
```
elementor-82
  └─ elementor-element-e3c6f55 (slideshow)
  └─ elementor-element-56401c2 (shape divider container)
      └─ e-con-inner
          └─ elementor-element-9e3f199 (inner content container)
              ├─ Page Title
              ├─ Top Divider
              ├─ {{ page.content }}
              ├─ {{ content_for_layout }} ← INSERT HERE
              └─ Bottom Divider
```

**Type 2 (Minimal Layout):**
```
elementor-82
  └─ elementor-element-e3c6f55 (slideshow)
  └─ elementor-element-56401c2 (shape divider container)
      └─ e-con-inner
          ├─ Shape Divider Top
          └─ {{ content_for_layout }} ← INSERT HERE DIRECTLY
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

#### Step 1: Add Insertion Point(s) in `main-page.liquid`

**For Type 1 (Full Layout):**
After line 89 (`{{ page.content }}`), add a marker div:
```liquid
{{ page.content }}
<div id="main-page-content-insertion-point" class="main-page-content-insertion-point" style="display: none;"></div>
```

**For Type 2 (Minimal Layout):**
After the shape divider top (inside `elementor-element-56401c2 .e-con-inner`), add a marker div:
```liquid
<div class="elementor-element-56401c2">
  <div class="e-con-inner">
    <!-- Shape divider top -->
    <div id="main-page-content-insertion-point-minimal" class="main-page-content-insertion-point" style="display: none;"></div>
```

**OR:** Add both insertion points and let JavaScript detect which layout type is present.

#### Step 2: Add JavaScript to Move Sections (Handles Both Layout Types)
Add JavaScript at the end of `main-page.liquid` (before `{% schema %}`):
```javascript
<script>
(function() {
  'use strict';
  
  function moveSectionsIntoMainPage() {
    // Find the main-page section wrapper
    var mainPageSection = document.querySelector('.shopify-section[data-section-type="main-page"]');
    if (!mainPageSection) return;
    
    // Detect layout type by checking for elementor-element-9e3f199 (Type 1) or not (Type 2)
    var innerContainer = mainPageSection.querySelector('[data-id="9e3f199"]');
    var insertionPoint = document.querySelector('#main-page-content-insertion-point');
    var insertionPointMinimal = document.querySelector('#main-page-content-insertion-point-minimal');
    
    var targetContainer;
    var actualInsertionPoint;
    
    if (innerContainer && insertionPoint) {
      // Type 1: Full layout - use elementor-element-9e3f199 container
      targetContainer = innerContainer;
      actualInsertionPoint = insertionPoint;
    } else if (insertionPointMinimal) {
      // Type 2: Minimal layout - use elementor-element-56401c2 .e-con-inner container
      targetContainer = insertionPointMinimal.closest('.e-con-inner');
      actualInsertionPoint = insertionPointMinimal;
    } else {
      // Fallback: Try to detect automatically
      var container56401c2 = mainPageSection.querySelector('[data-id="56401c2"]');
      if (container56401c2) {
        targetContainer = container56401c2.querySelector('.e-con-inner');
        // Create insertion point if it doesn't exist
        if (targetContainer && !targetContainer.querySelector('.main-page-content-insertion-point')) {
          actualInsertionPoint = document.createElement('div');
          actualInsertionPoint.id = 'main-page-content-insertion-point-auto';
          actualInsertionPoint.className = 'main-page-content-insertion-point';
          actualInsertionPoint.style.display = 'none';
          targetContainer.appendChild(actualInsertionPoint);
        }
      }
    }
    
    if (!targetContainer || !actualInsertionPoint) {
      console.warn('Main page insertion point or target container not found');
      return;
    }
    
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
      if (actualInsertionPoint.nextSibling) {
        targetContainer.insertBefore(clonedSection, actualInsertionPoint.nextSibling);
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

#### Step 3: Ensure CSS Compatibility (For Both Layout Types)
Add CSS to ensure moved sections maintain proper styling within the Elementor containers:
```css
/* Type 1: Full layout - sections inside elementor-element-9e3f199 */
.elementor-element-9e3f199 .shopify-section.moved-into-main-page {
  width: 100%;
  display: block;
  position: relative;
}

/* Type 2: Minimal layout - sections inside elementor-element-56401c2 .e-con-inner */
.elementor-element-56401c2 .e-con-inner .shopify-section.moved-into-main-page {
  width: 100%;
  display: block;
  position: relative;
}
```

## Determining Layout Type

### How to Identify Which Layout Type to Use:

**Type 1 (Full Layout) - Use When:**
- Page needs a title heading (`{{ page.title }}`)
- Page has embedded content (`{{ page.content }}`)
- Page needs decorative dividers above and below content
- Content should be wrapped in a styled inner container (`elementor-element-9e3f199`)
- Example: "Earn Rewards" page with title, dividers, and embedded loyalty rewards content

**Type 2 (Minimal Layout) - Use When:**
- Page does NOT need a title heading
- Page does NOT have embedded `{{ page.content }}`
- Page only needs the slideshow background and structural containers
- All content comes from `{{ content_for_layout }}` sections
- Example: Simple content pages where all sections are added via theme editor

### Implementation Suggestions:

#### **Suggestion 1: Section Setting to Control Layout Type**
Add a section setting in `main-page.liquid` schema to toggle between layout types:
```json
{
  "type": "select",
  "id": "layout_type",
  "label": "Layout Type",
  "options": [
    {
      "value": "full",
      "label": "Full Layout (with title, dividers, page.content)"
    },
    {
      "value": "minimal",
      "label": "Minimal Layout (slideshow + content container only)"
    }
  ],
  "default": "full"
}
```

Then conditionally render based on the setting:
```liquid
{%- if section.settings.layout_type == 'full' -%}
  <div class="elementor-element-9e3f199">
    <h2>{{ page.title }}</h2>
    <divider />
    {{ page.content }}
    <div id="main-page-content-insertion-point"></div>
    <divider />
  </div>
{%- else -%}
  <div id="main-page-content-insertion-point-minimal"></div>
{%- endif -%}
```

#### **Suggestion 2: Automatic Detection Based on Content**
JavaScript can automatically detect the layout type:
- If `elementor-element-9e3f199` exists → Type 1
- If `elementor-element-9e3f199` doesn't exist but `elementor-element-56401c2` exists → Type 2

#### **Suggestion 3: Separate Section Files**
Create two separate section files:
- `main-page.liquid` - Type 1 (full layout)
- `main-page-minimal.liquid` - Type 2 (minimal layout)

Then use the appropriate section type in page templates based on needs.

#### **Suggestion 4: Conditional Rendering Based on Page Template**
Detect the page template and use appropriate layout:
```liquid
{%- if template.name == 'page.earn-rewards' -%}
  {%- comment -%} Use Type 1 (full layout) {%- endcomment -%}
{%- else -%}
  {%- comment -%} Use Type 2 (minimal layout) {%- endcomment -%}
{%- endif -%}
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
   - Both layout types must work in theme editor

2. **Performance:**
   - JavaScript execution timing
   - Avoid content flash
   - Handle late-loading sections
   - Layout type detection should be fast

3. **Maintainability:**
   - Clear code comments indicating layout type
   - Easy to understand flow for both types
   - Works with dynamic section additions
   - Easy to switch between layout types

4. **Edge Cases:**
   - Pages without main-page section
   - Pages with multiple main-page sections
   - Sections that should remain outside
   - Pages that switch between layout types
   - Missing insertion points (fallback handling)

5. **Layout Type Specific Considerations:**
   - **Type 1:** Ensure `elementor-element-9e3f199` exists before targeting it
   - **Type 2:** Ensure `elementor-element-56401c2 .e-con-inner` exists before targeting it
   - Both types need proper CSS for moved sections
   - Shape dividers must remain in correct positions

## Testing Checklist

### General Testing:
- [ ] Sections appear inside main-page container
- [ ] Theme editor live editing works for moved sections
- [ ] No duplicate content rendering
- [ ] Proper styling maintained
- [ ] Works with dynamically added sections
- [ ] No JavaScript errors in console
- [ ] Mobile responsive behavior preserved

### Type 1 (Full Layout) Testing:
- [ ] Sections appear inside `elementor-element-9e3f199` container
- [ ] Sections appear after `{{ page.content }}`
- [ ] Page title and dividers remain visible
- [ ] Bottom divider appears after moved sections
- [ ] CSS styles apply correctly within inner container

### Type 2 (Minimal Layout) Testing:
- [ ] Sections appear inside `elementor-element-56401c2 .e-con-inner` container
- [ ] Sections appear after shape divider top
- [ ] No title or dividers interfere with content
- [ ] CSS styles apply correctly within shape divider container
- [ ] Slideshow background remains functional

### Layout Detection Testing:
- [ ] JavaScript correctly detects Type 1 layout
- [ ] JavaScript correctly detects Type 2 layout
- [ ] Fallback detection works when insertion points are missing
- [ ] No errors when switching between layout types

## Summary: Two Layout Types Explained

### **Type 1: Full Layout Structure**
**Container Hierarchy:**
```
elementor-82 (outer wrapper)
  └─ elementor-element-e3c6f55 (slideshow with shape divider bottom)
  └─ elementor-element-56401c2 (content container with shape divider top)
      └─ e-con-inner
          └─ elementor-element-9e3f199 (inner content wrapper)
              ├─ Page Title (elementor-element-7d143d1)
              ├─ Top Divider (elementor-element-cdd93b1)
              ├─ {{ page.content }}
              ├─ {{ content_for_layout }} ← Target insertion point
              └─ Bottom Divider (elementor-element-d496f51)
```

**When to Use:**
- Pages that need a visible page title
- Pages with embedded `{{ page.content }}` (like loyalty rewards embedded in page editor)
- Pages that need decorative dividers around content
- Pages requiring a styled inner container for content

**Target Container:** `.elementor-element-9e3f199` (after `{{ page.content }}`)

### **Type 2: Minimal Layout Structure**
**Container Hierarchy:**
```
elementor-82 (outer wrapper)
  └─ elementor-element-e3c6f55 (slideshow with shape divider bottom)
  └─ elementor-element-56401c2 (content container with shape divider top)
      └─ e-con-inner
          ├─ Shape Divider Top
          └─ {{ content_for_layout }} ← Target insertion point (directly here)
```

**When to Use:**
- Pages that don't need a page title
- Pages without embedded `{{ page.content }}`
- Pages where all content comes from theme editor sections
- Pages that only need slideshow background and content container structure
- Simpler pages with minimal styling requirements

**Target Container:** `.elementor-element-56401c2 .e-con-inner` (directly, after shape divider)

### **Key Differences:**

| Feature | Type 1 (Full) | Type 2 (Minimal) |
|---------|---------------|------------------|
| Page Title | ✅ Yes | ❌ No |
| Top Divider | ✅ Yes | ❌ No |
| `{{ page.content }}` | ✅ Yes | ❌ No |
| Bottom Divider | ✅ Yes | ❌ No |
| Inner Container (9e3f199) | ✅ Yes | ❌ No |
| Slideshow | ✅ Yes | ✅ Yes |
| Shape Dividers | ✅ Yes | ✅ Yes |
| Content Container (56401c2) | ✅ Yes | ✅ Yes |
| **Insertion Point** | Inside 9e3f199 | Inside 56401c2 .e-con-inner |

### **Implementation Recommendation:**

1. **Add both insertion points** to `main-page.liquid` (one for each type)
2. **Use JavaScript auto-detection** to determine which layout type is present
3. **Target the appropriate container** based on detection
4. **Add CSS rules** for both container types to ensure proper styling
5. **Test both layout types** to ensure compatibility

This approach provides maximum flexibility and works regardless of which layout type is used on a particular page.

## Summary: Complete Solution Recommendations

### **1. Why `{{ content_for_layout }}` Cannot Be Used Directly**

**Key Point:** `main-page` is itself a section, and `{{ content_for_layout }}` renders ALL sections including `main-page`, causing duplication/infinite loops.

**Solution:** JavaScript-based section movement (Approach 1) is the only viable method that works with Shopify's section rendering system.

### **2. Managing Page Width Settings**

**Add to `main-page.liquid` Schema:**
- `layout_type` (full/minimal)
- `page_full_width` (checkbox)
- `page_max_width` (range: 800-1920px)
- `content_container_max_width` (range: 600-1400px, Type 1 only)
- `container_alignment` (center/left/right)

**Apply Settings:**
- Use inline styles or CSS classes with dynamic style blocks
- Apply to `elementor-element-56401c2` (outer container)
- Apply to `elementor-element-9e3f199` (inner container, Type 1 only)

**Template Management:**
- Configure settings per page template in JSON files
- Accessible through Shopify theme editor
- Consistent with other sections' width management

### **3. Complete Implementation Strategy**

**Step 1: Add Schema Settings**
- Add width and layout settings to `main-page.liquid` schema
- Include both full width and container width options

**Step 2: Apply Width Settings**
- Conditionally apply styles based on settings
- Use CSS classes or inline styles
- Support both layout types

**Step 3: Add Insertion Points**
- Add insertion point markers for both layout types
- Use JavaScript to detect layout type automatically

**Step 4: Implement JavaScript Section Movement**
- Move sections from outside `main-page` to inside appropriate container
- Handle both Type 1 and Type 2 layouts
- Maintain theme editor compatibility

**Step 5: Add CSS Compatibility**
- Ensure moved sections maintain proper styling
- Handle both container types
- Support responsive behavior

### **4. Benefits of This Approach**

✅ **No Liquid Limitations:** Avoids the `{{ content_for_layout }}` limitation  
✅ **Flexible Width Control:** Full width and container width options  
✅ **Template-Level Management:** Settings configurable per page template  
✅ **Theme Editor Compatible:** Works with Shopify's live theme editor  
✅ **Both Layout Types Supported:** Handles full and minimal layouts  
✅ **Maintainable:** Clear separation of concerns  

### **5. Implementation Priority**

1. **High Priority:** Add width settings to schema (enables immediate control)
2. **High Priority:** Apply width settings to containers (makes settings functional)
3. **Medium Priority:** Add insertion points (enables section movement)
4. **Medium Priority:** Implement JavaScript section movement (solves main issue)
5. **Low Priority:** Add CSS compatibility rules (polish and refinement)

### **6. Testing Checklist for Width Settings**

- [ ] Full width setting applies correctly to outer container
- [ ] Container width setting applies correctly when full width is disabled
- [ ] Inner container width (Type 1) respects content_container_max_width
- [ ] Container alignment works (center/left/right)
- [ ] Settings are accessible in theme editor
- [ ] Settings persist correctly in template JSON files
- [ ] Responsive behavior maintained on mobile devices
- [ ] Both layout types work with width settings
