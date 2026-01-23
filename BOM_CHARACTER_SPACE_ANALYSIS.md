# Analysis: BOM Character (`&#xFEFF;`) Causing Space Before Footer

## Problem Description

On non-index pages, there is a visible space between the main content sections and the footer. In the browser console, this space is identified as the BOM (Byte Order Mark) character `&#xFEFF;` (Unicode U+FEFF), which is a zero-width no-break space character.

## What is a BOM Character?

**BOM (Byte Order Mark):**
- Unicode character: `U+FEFF` (Zero Width No-Break Space)
- HTML entity: `&#xFEFF;` or `&#65279;`
- Typically appears when files are saved with **UTF-8 BOM encoding** instead of **UTF-8 without BOM**
- Invisible in most text editors but creates unwanted whitespace in HTML output
- Can cause layout issues and spacing problems

## Root Cause Analysis

### 1. **File Encoding Issue**

**Most Likely Source:**
- One or more Liquid template files were saved with **UTF-8 BOM encoding**
- The BOM character appears at the **beginning** of the file
- When Shopify renders the file, the BOM character is output as part of the HTML
- This creates an invisible but space-occupying character in the DOM

**Files to Check:**
1. `sections/section-footer.liquid` - Most likely candidate (rendered right before footer)
2. `layout/theme.liquid` - Around line 303 where footer is rendered
3. Any section files that render before the footer

### 2. **Location in Code**

**In `layout/theme.liquid` (lines 301-303):**
```liquid
  </main>
  {%- endif -%}
  {%- section 'section-footer' -%}
```

**Possible Issues:**
- BOM character at the start of `section-footer.liquid` file
- Whitespace/newlines between `{%- endif -%}` and `{%- section 'section-footer' -%}` that includes BOM
- BOM character at the end of `{{ content_for_layout }}` output

### 3. **How BOM Characters Appear**

**Common Scenarios:**
1. **File saved with UTF-8 BOM:**
   - File starts with bytes: `EF BB BF` (UTF-8 BOM)
   - When rendered, these bytes become the `&#xFEFF;` character in HTML

2. **Copy-paste from BOM-encoded source:**
   - Content copied from a file with BOM encoding
   - BOM character gets included in the paste

3. **Editor default encoding:**
   - Some editors (like Notepad on Windows) default to UTF-8 BOM
   - Files saved without explicitly choosing "UTF-8 without BOM"

### 4. **Visual Impact**

**In HTML Output:**
```html
</main>
&#xFEFF;  <!-- BOM character creates space -->
<footer>...</footer>
```

**In Browser:**
- The BOM character is rendered as a space-like character
- Creates unwanted vertical or horizontal spacing
- Visible in browser DevTools as `&#xFEFF;` or as a blank space
- Can break layout and cause alignment issues

## Detection Methods

### 1. **Browser Console Inspection**
- Open DevTools → Elements tab
- Look for `&#xFEFF;` in the HTML structure
- Check computed styles to see if there's unexpected spacing

### 2. **File Inspection**
- Open files in a hex editor or text editor that shows BOM
- Look for `EF BB BF` at the start of files
- Use command line tools:
  ```bash
  # Check for BOM in file
  file -bi section-footer.liquid
  # Or
  head -c 3 section-footer.liquid | od -An -tx1
  ```

### 3. **Liquid Output Inspection**
- Add temporary debugging:
  ```liquid
  {%- comment -%} Check for BOM {%- endcomment -%}
  <script>console.log('Before footer:', document.querySelector('main').nextSibling);</script>
  ```

## Solution Approaches

### **Solution 1: Remove BOM from Files (Recommended)**

**Steps:**
1. **Identify files with BOM:**
   - Check `sections/section-footer.liquid`
   - Check `layout/theme.liquid` around footer rendering area
   - Check any other files that render before footer

2. **Re-save files without BOM:**
   - Open file in editor
   - Save As → Choose "UTF-8 without BOM" or "UTF-8 (no BOM)"
   - Common editors:
     - **VS Code**: File → Save with Encoding → UTF-8
     - **Notepad++**: Encoding → Convert to UTF-8 without BOM
     - **Sublime Text**: File → Save with Encoding → UTF-8

3. **Verify removal:**
   - Check file encoding after saving
   - Test in browser to confirm space is gone

### **Solution 2: Strip BOM in Liquid (Workaround)**

**Add to `layout/theme.liquid` before footer:**
```liquid
{%- comment -%} Remove any BOM characters before footer {%- endcomment -%}
{%- assign bom_check = '' -%}
{%- section 'section-footer' -%}
```

**Or use JavaScript to remove:**
```javascript
<script>
(function() {
  // Remove BOM characters from DOM
  var walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  var node;
  while (node = walker.nextNode()) {
    if (node.nodeValue) {
      node.nodeValue = node.nodeValue.replace(/\uFEFF/g, '');
    }
  }
})();
</script>
```

### **Solution 3: CSS Workaround (Not Recommended)**

**Hide BOM character with CSS:**
```css
/* This won't work - BOM is a text node, not an element */
```

**Note:** CSS cannot target text nodes, so this approach won't work. The BOM must be removed at the source.

### **Solution 4: Liquid Whitespace Control**

**Ensure no whitespace between tags:**
```liquid
  {%- endif -%}{%- section 'section-footer' -%}
```

**Or:**
```liquid
  {%- endif -%}
  {%- section 'section-footer' -%}
```

**Note:** The `{%-` and `-%}` syntax already strips whitespace, but BOM characters are not whitespace and won't be removed by Liquid's whitespace control.

## Prevention

### **Editor Settings:**
1. **VS Code:**
   - Set default encoding: `"files.encoding": "utf8"` (without BOM)
   - Add to settings.json:
     ```json
     {
       "files.encoding": "utf8",
       "files.autoGuessEncoding": false
     }
     ```

2. **Notepad++:**
   - Settings → Preferences → New Document
   - Encoding: UTF-8 (without BOM)

3. **Sublime Text:**
   - Preferences → Settings
   - Add: `"default_encoding": "UTF-8"`

### **Git Configuration:**
```bash
# Prevent BOM in git commits
git config core.autocrlf false
```

### **File Validation:**
- Add pre-commit hook to check for BOM
- Use linting tools that detect BOM characters

## Testing Checklist

- [ ] Check `sections/section-footer.liquid` for BOM at file start
- [ ] Check `layout/theme.liquid` around line 303 for BOM
- [ ] Verify file encoding is UTF-8 without BOM
- [ ] Test in browser - space should be gone
- [ ] Check console - `&#xFEFF;` should not appear
- [ ] Verify footer renders immediately after main content
- [ ] Test on multiple browsers
- [ ] Verify theme editor still works correctly

## Quick Fix Command (If Using Command Line)

```bash
# Remove BOM from a file (Linux/Mac)
sed -i '1s/^\xEF\xBB\xBF//' sections/section-footer.liquid

# Or use dos2unix
dos2unix sections/section-footer.liquid

# Check for BOM
file -bi sections/section-footer.liquid
# Should show: text/plain; charset=utf-8 (NOT utf-8-bom)
```

## Expected Result

**Before Fix:**
```html
</main>
&#xFEFF;  <!-- Creates unwanted space -->
<footer>...</footer>
```

**After Fix:**
```html
</main>
<footer>...</footer>
```

The BOM character should be completely removed, and the footer should render immediately after the main content with no spacing issues.
