#!/usr/bin/env python3
"""
Fix CSS file paths - Replace ../images/ and ../fonts/ with just filename
"""
import re
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent
ASSETS_DIR = BASE_DIR / "assets"

def fix_css_file(css_file):
    """Fix paths in a CSS file"""
    with open(css_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix ../images/ references - remove ../images/ and keep just filename
    content = re.sub(r'url\(\.\./images/([^)]+)\)', r'url(\1)', content)
    content = re.sub(r'url\("\.\./images/([^"]+)"\)', r'url("\1")', content)
    content = re.sub(r"url\('\.\./images/([^']+)'\)", r"url('\1')", content)
    
    # Fix ../fonts/ references - remove ../fonts/ and keep just filename
    content = re.sub(r'url\(\.\./fonts/([^)]+)\)', r'url(\1)', content)
    content = re.sub(r'url\("\.\./fonts/([^"]+)"\)', r'url("\1")', content)
    content = re.sub(r"url\('\.\./fonts/([^']+)'\)", r"url('\1')", content)
    
    if content != original_content:
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("Fixing CSS file paths...")
    fixed_count = 0
    
    # Find all CSS files in assets
    for css_file in ASSETS_DIR.glob("*.css"):
        if fix_css_file(css_file):
            print(f"  Fixed: {css_file.name}")
            fixed_count += 1
    
    print(f"\nFixed {fixed_count} CSS files")

if __name__ == "__main__":
    main()

