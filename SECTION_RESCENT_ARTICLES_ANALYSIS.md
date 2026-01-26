# Section Recent Articles Analysis: UTF-8 Encoding & Display Issues

## Analysis Results

### **1. UTF-8 Encoding Check:**
✅ **File encoding is correct** - No BOM (Byte Order Mark) detected
- File starts with `3C 64 69` (`<di`) - Normal UTF-8 without BOM
- No `EF BB BF` (UTF-8 BOM) at the beginning
- File encoding is clean

### **2. Display Issue - Missing Variable Assignment:**

**Problem Found:**
The section uses `selected_blog` variable but it's **never assigned** from the schema setting `blog_handle`.

**Current Code:**
- Line 7: Uses `selected_blog` in conditional
- Line 22: Checks `selected_blog and selected_blog.articles.size > 0`
- Line 24: Loops through `selected_blog.articles`
- **BUT:** `selected_blog` is never assigned from `section.settings.blog_handle`

**Schema Has:**
- `blog_handle` setting (line 115) - Blog handle from theme editor

**Missing Code:**
The section needs to assign `selected_blog` from `section.settings.blog_handle` at the beginning of the file.

### **3. Comparison with Other Sections:**

Looking at `main-blog.liquid` (lines 88-105), it properly assigns the blog:
```liquid
{%- liquid
  assign current_blog = blank
  
  if section.settings.blog != blank
    assign current_blog = blogs[section.settings.blog]
  endif
  
  if current_blog == blank and blog != blank
    assign current_blog = blog
  endif
-%}
```

### **4. Root Cause:**

The section will **not display** because:
1. `selected_blog` is undefined (never assigned)
2. The condition `{%- if selected_blog and selected_blog.articles.size > 0 -%}` always evaluates to false
3. The section falls back to the "No articles found" message (line 78)
4. Even if that message shows, the main content (articles) won't render

### **5. Additional Issues Found:**

1. **Schema Setting Mismatch:**
   - Schema uses `"id": "blog_handle"` (line 115)
   - Code should access it as `section.settings.blog_handle`
   - Then assign to `selected_blog` using `blogs[section.settings.blog_handle]`

2. **Missing Fallback Logic:**
   - No fallback to default blog if `blog_handle` is empty
   - Should check for `blogs.first` or a default blog handle

3. **Heading Not Using Schema Setting:**
   - Line 7: Hardcoded "Recent Articles" text
   - Schema has `heading` setting (line 110) but it's not used
   - Should use `{{ section.settings.heading | default: 'Recent Articles' }}`

## Recommended Fixes

### **Fix 1: Add Blog Variable Assignment**
Add at the beginning of the file (after opening div, before content):
```liquid
{%- liquid
  comment
    Get blog from section settings
  endcomment
  assign selected_blog = blank
  
  if section.settings.blog_handle != blank
    assign selected_blog = blogs[section.settings.blog_handle]
  endif
  
  if selected_blog == blank and blogs.first != blank
    assign selected_blog = blogs.first
  endif
-%}
```

### **Fix 2: Use Schema Heading Setting**
Change line 7 to use the schema setting:
```liquid
<h2 class="elementor-heading-title elementor-size-default">
  <a href="{% if selected_blog %}{{ selected_blog.url }}{% else %}{{ routes.blogs_url }}{% endif %}">
    {{ section.settings.heading | default: 'Recent Articles' }}
  </a>
</h2>
```

### **Fix 3: Ensure UTF-8 Without BOM**
The file encoding is already correct, but to be safe:
- Save file as UTF-8 without BOM
- No special characters that could cause issues

## Summary

**Encoding Status:** ✅ Clean (no BOM detected)
**Display Issue:** ❌ Missing `selected_blog` variable assignment
**Root Cause:** Variable `selected_blog` is used but never assigned from `section.settings.blog_handle`
**Impact:** Section will not display articles, only shows "No articles found" message

## Testing After Fix

- [ ] Section displays articles when blog is selected in theme editor
- [ ] Section shows fallback message when no blog selected
- [ ] Heading uses schema setting value
- [ ] No encoding issues (no BOM characters)
- [ ] Articles render correctly with images, titles, excerpts
- [ ] "Read More" buttons link correctly
