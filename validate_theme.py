#!/usr/bin/env python3
"""
Theme Validation Script
Checks for broken CSS, JS, and image references
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
ASSETS_DIR = BASE_DIR / "assets"
CSS_DIR = ASSETS_DIR / "css"
JS_DIR = ASSETS_DIR / "js"
IMAGES_DIR = ASSETS_DIR / "images"
LAYOUT_DIR = BASE_DIR / "layout"
SECTIONS_DIR = BASE_DIR / "sections"

errors = []
warnings = []

def check_file_exists(file_path, file_type="file"):
    """Check if a file exists"""
    if not file_path.exists():
        return False
    return True

def extract_css_references(content):
    """Extract CSS file references from Liquid templates"""
    pattern = r"\{\{\s*['\"](css/[^'\"]+)['\"]\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}"
    matches = re.findall(pattern, content)
    return matches

def extract_js_references(content):
    """Extract JS file references from Liquid templates"""
    pattern = r"src=[\"']\{\{\s*['\"](js/[^'\"]+|global\.js)['\"]\s*\|\s*asset_url[^\"']*[\"']"
    matches = re.findall(pattern, content)
    # Also check for global.js
    pattern2 = r"\{\{\s*['\"](global\.js)['\"]\s*\|\s*asset_url"
    matches2 = re.findall(pattern2, content)
    return matches + matches2

def extract_image_references(content):
    """Extract image file references from Liquid templates"""
    # Pattern for asset_url with images/
    pattern1 = r"\{\{\s*['\"]images/([^'\"]+)['\"]\s*\|\s*asset_url"
    matches1 = re.findall(pattern1, content)
    # Pattern for background-image in CSS
    pattern2 = r"background-image:\s*url\([\"']\{\{\s*['\"]images/([^'\"]+)['\"]\s*\|\s*asset_url"
    matches2 = re.findall(pattern2, content)
    return matches1 + matches2

def validate_css_files():
    """Validate all CSS file references"""
    print("Checking CSS files...")
    layout_file = LAYOUT_DIR / "theme.liquid"
    if not layout_file.exists():
        errors.append(f"Layout file not found: {layout_file}")
        return
    
    with open(layout_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    css_files = extract_css_references(content)
    for css_file in css_files:
        # css_file is like "css/style.min.css", need to check in assets/css/
        filename = css_file.replace("css/", "")
        file_path = CSS_DIR / filename
        if not check_file_exists(file_path):
            errors.append(f"Missing CSS file: {css_file}")
        else:
            print(f"  [OK] {css_file}")

def validate_js_files():
    """Validate all JS file references"""
    print("\nChecking JS files...")
    layout_file = LAYOUT_DIR / "theme.liquid"
    if not layout_file.exists():
        return
    
    with open(layout_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    js_files = extract_js_references(content)
    for js_file in js_files:
        if js_file == "global.js":
            file_path = ASSETS_DIR / js_file
        elif js_file.startswith("js/"):
            # js_file is like "js/jquery.min.js", need to check in assets/js/
            filename = js_file.replace("js/", "")
            file_path = JS_DIR / filename
        else:
            file_path = JS_DIR / js_file
        if not check_file_exists(file_path):
            errors.append(f"Missing JS file: {js_file}")
        else:
            print(f"  [OK] {js_file}")

def validate_image_files():
    """Validate all image file references"""
    print("\nChecking image files...")
    missing_images = set()
    
    # Check layout file
    layout_file = LAYOUT_DIR / "theme.liquid"
    if layout_file.exists():
        with open(layout_file, 'r', encoding='utf-8') as f:
            content = f.read()
        images = extract_image_references(content)
        for img in images:
            file_path = IMAGES_DIR / img
            if not check_file_exists(file_path):
                missing_images.add(img)
    
    # Check all section files
    if SECTIONS_DIR.exists():
        for section_file in SECTIONS_DIR.glob("*.liquid"):
            with open(section_file, 'r', encoding='utf-8') as f:
                content = f.read()
            images = extract_image_references(content)
            for img in images:
                file_path = IMAGES_DIR / img
                if not check_file_exists(file_path):
                    missing_images.add(img)
    
    for img in sorted(missing_images):
        warnings.append(f"Missing image file: images/{img}")
        print(f"  [MISSING] images/{img}")
    
    # List existing images
    if IMAGES_DIR.exists():
        existing = [f.name for f in IMAGES_DIR.iterdir() if f.is_file()]
        print(f"\n  Found {len(existing)} image files in assets/images/")

def check_liquid_syntax():
    """Check for basic Liquid syntax errors"""
    print("\nChecking Liquid syntax...")
    liquid_files = []
    
    if LAYOUT_DIR.exists():
        liquid_files.extend(LAYOUT_DIR.glob("*.liquid"))
    if SECTIONS_DIR.exists():
        liquid_files.extend(SECTIONS_DIR.glob("*.liquid"))
    
    for liquid_file in liquid_files:
        with open(liquid_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for unclosed Liquid tags
        open_tags = content.count('{%')
        close_tags = content.count('%}')
        if open_tags != close_tags:
            errors.append(f"Unclosed Liquid tags in {liquid_file.name}: {open_tags} open, {close_tags} close")
        
        # Check for unclosed HTML tags (basic check)
        open_divs = content.count('<div')
        close_divs = content.count('</div>')
        if abs(open_divs - close_divs) > 5:  # Allow some difference for conditionals
            warnings.append(f"Possible unclosed div tags in {liquid_file.name}: {open_divs} open, {close_divs} close")

def main():
    """Main validation function"""
    print("=" * 60)
    print("Shopify Theme Validation")
    print("=" * 60)
    
    # Check directory structure
    if not ASSETS_DIR.exists():
        errors.append(f"Assets directory not found: {ASSETS_DIR}")
        return
    
    if not CSS_DIR.exists():
        errors.append(f"CSS directory not found: {CSS_DIR}")
    
    if not JS_DIR.exists():
        errors.append(f"JS directory not found: {JS_DIR}")
    
    if not IMAGES_DIR.exists():
        warnings.append(f"Images directory not found: {IMAGES_DIR}")
    
    # Run validations
    validate_css_files()
    validate_js_files()
    validate_image_files()
    check_liquid_syntax()
    
    # Print summary
    print("\n" + "=" * 60)
    print("Validation Summary")
    print("=" * 60)
    
    if errors:
        print(f"\n[ERRORS] ({len(errors)}):")
        for error in errors:
            print(f"  - {error}")
    else:
        print("\n[OK] No errors found!")
    
    if warnings:
        print(f"\n[WARNINGS] ({len(warnings)}):")
        for warning in warnings:
            print(f"  - {warning}")
    else:
        print("\n[OK] No warnings!")
    
    print("\n" + "=" * 60)
    
    if errors:
        print("[FAIL] Theme has errors that need to be fixed!")
        return 1
    elif warnings:
        print("[WARN] Theme has warnings but should work.")
        return 0
    else:
        print("[PASS] Theme validation passed!")
        return 0

if __name__ == "__main__":
    exit(main())

