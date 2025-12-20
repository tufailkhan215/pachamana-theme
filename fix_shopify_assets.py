#!/usr/bin/env python3
"""
Fix Shopify theme structure - Move all files from subfolders to assets root
Shopify doesn't allow subfolders in assets directory
"""
import os
import shutil
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
ASSETS_DIR = BASE_DIR / "assets"

def move_files_to_root():
    """Move all files from subfolders to assets root"""
    moved_files = {}
    
    # Process each subfolder
    for subfolder in ['css', 'js', 'images', 'fonts', 'webfonts']:
        subfolder_path = ASSETS_DIR / subfolder
        if not subfolder_path.exists():
            continue
            
        print(f"Moving files from {subfolder}/ to assets root...")
        for file_path in subfolder_path.iterdir():
            if file_path.is_file():
                # Check for name conflicts
                dest_path = ASSETS_DIR / file_path.name
                if dest_path.exists():
                    # Add prefix to avoid conflicts
                    new_name = f"{subfolder}_{file_path.name}"
                    dest_path = ASSETS_DIR / new_name
                    moved_files[file_path] = (dest_path, new_name, subfolder)
                    print(f"  {file_path.name} -> {new_name} (conflict resolved)")
                else:
                    moved_files[file_path] = (dest_path, file_path.name, subfolder)
                    print(f"  {file_path.name} -> {file_path.name}")
                
                shutil.move(str(file_path), str(dest_path))
        
        # Remove empty subfolder
        try:
            subfolder_path.rmdir()
        except:
            pass
    
    return moved_files

def update_references(moved_files):
    """Update all references in theme files"""
    # Create mapping: old_path -> new_path
    path_mapping = {}
    for old_path, (new_path, new_name, subfolder) in moved_files.items():
        old_ref = f"{subfolder}/{old_path.name}"
        new_ref = new_name
        path_mapping[old_ref] = new_ref
    
    # Files to update
    files_to_update = []
    
    # Layout file
    layout_file = BASE_DIR / "layout" / "theme.liquid"
    if layout_file.exists():
        files_to_update.append(layout_file)
    
    # All section files
    sections_dir = BASE_DIR / "sections"
    if sections_dir.exists():
        files_to_update.extend(sections_dir.glob("*.liquid"))
    
    # All snippet files
    snippets_dir = BASE_DIR / "snippets"
    if snippets_dir.exists():
        files_to_update.extend(snippets_dir.glob("*.liquid"))
    
    print(f"\nUpdating references in {len(files_to_update)} files...")
    
    for file_path in files_to_update:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Update CSS references: 'css/filename.css' -> 'filename.css'
        for old_ref, new_ref in path_mapping.items():
            if old_ref.startswith('css/'):
                # Pattern: 'css/filename.css' | asset_url
                pattern = rf"'{old_ref}'"
                replacement = f"'{new_ref}'"
                content = re.sub(pattern, replacement, content)
                
                # Pattern: "css/filename.css" | asset_url
                pattern = rf'"{old_ref}"'
                replacement = f'"{new_ref}"'
                content = re.sub(pattern, replacement, content)
        
        # Update JS references: 'js/filename.js' -> 'filename.js'
        for old_ref, new_ref in path_mapping.items():
            if old_ref.startswith('js/'):
                # Pattern: 'js/filename.js' | asset_url
                pattern = rf"'{old_ref}'"
                replacement = f"'{new_ref}'"
                content = re.sub(pattern, replacement, content)
                
                # Pattern: "js/filename.js" | asset_url
                pattern = rf'"{old_ref}"'
                replacement = f'"{new_ref}"'
                content = re.sub(pattern, replacement, content)
        
        # Update image references: 'images/filename.png' -> 'filename.png'
        for old_ref, new_ref in path_mapping.items():
            if old_ref.startswith('images/'):
                # Pattern: "images/filename.png" | asset_url
                pattern = rf'"images/{old_ref.split("/")[1]}"'
                replacement = f'"{new_ref}"'
                content = re.sub(pattern, replacement, content)
                
                # Pattern: 'images/filename.png' | asset_url
                pattern = rf"'images/{old_ref.split('/')[1]}'"
                replacement = f"'{new_ref}'"
                content = re.sub(pattern, replacement, content)
        
        # Update font references: 'fonts/filename.woff2' -> 'filename.woff2'
        for old_ref, new_ref in path_mapping.items():
            if old_ref.startswith('fonts/') or old_ref.startswith('webfonts/'):
                # Pattern: "fonts/filename.woff2" | asset_url
                pattern = rf'"{old_ref}"'
                replacement = f'"{new_ref}"'
                content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  Updated: {file_path.name}")

def fix_liquid_syntax_error():
    """Fix the Liquid syntax error in section-image-text-dynamicbg.liquid"""
    section_file = BASE_DIR / "sections" / "section-image-text-dynamicbg.liquid"
    if not section_file.exists():
        return
    
    with open(section_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the quote issue - replace smart quotes with regular quotes
    # The issue is with the em dash and smart quotes in the default text
    old_line = '{{ section.settings.text | default: \'<p>At Pacha Mana, cacao is not a commodity — it\'s a sacred relationship. We work directly with a multi-generational, family-run collective in the highlands of Peru who cultivate heirloom Chuncho cacao with devotion and care. Grown in harmony with native species, this cacao preserves both culture and ecosystem.</p><p>We believe true ceremonial cacao begins with integrity — from seed to ceremony.</p>\' }}'
    
    # Use proper escaping
    new_line = '{{ section.settings.text | default: "<p>At Pacha Mana, cacao is not a commodity — it\'s a sacred relationship. We work directly with a multi-generational, family-run collective in the highlands of Peru who cultivate heirloom Chuncho cacao with devotion and care. Grown in harmony with native species, this cacao preserves both culture and ecosystem.</p><p>We believe true ceremonial cacao begins with integrity — from seed to ceremony.</p>" }}'
    
    if old_line in content:
        content = content.replace(old_line, new_line)
        with open(section_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed Liquid syntax error in section-image-text-dynamicbg.liquid")

def fix_settings_schema():
    """Fix settings_schema.json URLs"""
    settings_file = BASE_DIR / "config" / "settings_schema.json"
    if not settings_file.exists():
        return
    
    with open(settings_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace empty URLs with placeholder URLs
    content = content.replace('"theme_documentation_url": ""', '"theme_documentation_url": "https://pachamana.com"')
    content = content.replace('"theme_support_url": ""', '"theme_support_url": "https://pachamana.com"')
    
    with open(settings_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed settings_schema.json URLs")

def main():
    print("=" * 70)
    print("Fixing Shopify Theme Structure")
    print("=" * 70)
    print("\n[1] Moving files from subfolders to assets root...")
    moved_files = move_files_to_root()
    
    print(f"\n[2] Updating references in theme files...")
    update_references(moved_files)
    
    print(f"\n[3] Fixing Liquid syntax errors...")
    fix_liquid_syntax_error()
    
    print(f"\n[4] Fixing settings schema...")
    fix_settings_schema()
    
    print("\n" + "=" * 70)
    print("✅ All fixes applied!")
    print("=" * 70)
    print(f"\nMoved {len(moved_files)} files to assets root")
    print("\nNext steps:")
    print("1. Verify all files are in assets/ (no subfolders)")
    print("2. Upload theme to Shopify")
    print("3. Test theme functionality")

if __name__ == "__main__":
    main()

