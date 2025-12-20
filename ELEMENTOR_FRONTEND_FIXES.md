# Elementor Frontend CSS, Background Images, and Animation Fixes

## Issues Identified

### 1. Missing Background Images
**Problem:** The colorful geometric pattern backgrounds (Peruvian textile patterns) are not showing in the Shopify theme.

**Root Cause:**
- CSS files (`post-57.css`, `post-191.css`, `post-63.css`) contain background image rules
- CSS selectors target parent classes like `.elementor-57`, `.elementor-191`, `.elementor-63`
- Elementor frontend JavaScript may not be initializing properly to apply styles from `data-settings`
- Motion effects containers may not be created

**Solution Applied:**
- Added direct CSS rules targeting elements by `data-id` attributes
- Added JavaScript to ensure Elementor frontend initializes
- Added fallback to create motion effects containers if missing
- Added JavaScript to apply background images from CSS and data-settings

### 2. Missing Colors and Styles
**Problem:** Colors and styles defined in CSS files are not being applied.

**Root Cause:**
- Elementor CSS uses CSS variables (e.g., `var(--e-global-color-secondary)`)
- These variables need to be defined or CSS needs to be applied
- Elementor frontend JS needs to initialize to apply inline styles

**Solution Applied:**
- Ensured Elementor frontend config is properly set
- Added initialization triggers for Elementor frontend
- Added fallback CSS with direct background image URLs

### 3. Missing Animations
**Problem:** Elementor animations are not triggering.

**Root Cause:**
- `elementor-invisible` class prevents elements from being visible
- Elementor frontend JS needs to remove this class and trigger animations
- Animation classes need to be added

**Solution Applied:**
- Enhanced animation JavaScript (already in place)
- Ensured Elementor frontend initializes before animations
- Added fallback to remove `elementor-invisible` classes

## Files Modified

### `layout/theme.liquid`

#### 1. Direct CSS Background Image Support
Added CSS rules that target elements directly by `data-id`:
```css
.elementor-element[data-id="f74e63a"] {
  background-image: url("peruvian_geometric_textile_pattern_3.png") !important;
}
```

**Elements with Background Images:**
- `data-id="f74e63a"` - Header background (Peruvian pattern)
- `data-id="4d8192a"` - Footer background (Peruvian pattern)
- `data-id="13691562"` - Background motion section (cacao image)
- `data-id="cd87555"` - Light gold fabric background
- `data-id="2055cbe7"` - Gold fabric background

#### 2. Elementor Frontend Initialization
Added comprehensive JavaScript to:
- Initialize Elementor frontend properly
- Trigger Elementor initialization events
- Apply background images from CSS
- Apply styles from `data-settings` attributes
- Create motion effects containers if missing
- Ensure Elementor parent classes exist

#### 3. Motion Effects Support
- Ensures motion effects containers are created
- Applies background images to motion layers
- Initializes motion effects module

## How It Works

### Background Images
1. **CSS Files:** `post-57.css`, `post-191.css`, `post-63.css` contain background image rules
2. **Direct CSS:** Added fallback CSS targeting elements by `data-id`
3. **JavaScript:** Applies background images from CSS computed styles
4. **Motion Effects:** Creates motion effects containers and applies backgrounds to layers

### Elementor Initialization
1. **Config:** Elementor frontend config is set before JS loads
2. **Init:** JavaScript ensures Elementor frontend initializes
3. **Events:** Triggers Elementor initialization events
4. **Fallback:** Applies styles even if Elementor fails to initialize

### Motion Effects
1. **Detection:** Checks for `data-settings` with motion effects
2. **Container Creation:** Creates motion effects container if missing
3. **Layer Setup:** Creates motion effects layer and applies background
4. **Initialization:** Triggers Elementor motion effects module

## CSS Files Loaded

The following CSS files are loaded in `theme.liquid`:
- `post-15.css`
- `post-48.css`
- `post-57.css` - Contains header background (Peruvian pattern)
- `post-63.css` - Contains background motion section styles
- `post-191.css` - Contains footer background (Peruvian pattern)
- `post-1197.css`

## Background Images Referenced

From CSS files:
- `peruvian_geometric_textile_pattern_3.png` - Header and footer backgrounds
- `cacao-sheny-leon-photography-maui-78.jpg` - Background motion section
- `light-gold-fabric.png` - Section backgrounds
- `gold-fabric.png` - Section backgrounds
- `cacao-fruit-isolated.png` - Section overlay

## Testing Checklist

- [ ] Header shows Peruvian pattern background
- [ ] Footer shows Peruvian pattern background
- [ ] Background motion section shows cacao image
- [ ] All section backgrounds display correctly
- [ ] Colors match the original design
- [ ] Animations trigger on page load
- [ ] Motion effects work (mouse tracking)
- [ ] No console errors related to Elementor

## Next Steps

If background images still don't show:
1. Verify all image files exist in `assets/` folder
2. Check browser console for 404 errors
3. Verify CSS files are loading (check Network tab)
4. Check that Elementor frontend JS is loading
5. Verify `data-id` attributes match CSS selectors

## Technical Details

### Elementor Class Structure
- Header: `class="elementor elementor-57 elementor-location-header"`
- Footer: `class="elementor elementor-191 elementor-location-footer"`
- Sections: May need `elementor-63` class for CSS selectors to work

### CSS Selector Priority
1. Direct `data-id` selectors (highest priority, always work)
2. Elementor parent class selectors (`.elementor-57 .elementor-element`)
3. JavaScript application (fallback)

### Motion Effects Structure
```
.elementor-element[data-settings*="motion_fx"]
  └─ .elementor-motion-effects-container
      └─ .elementor-motion-effects-layer (background image applied here)
```

---

**Status:** ✅ Background image and Elementor frontend support added
**Commit:** Latest - "Add Elementor frontend initialization, background image support, and motion effects"

