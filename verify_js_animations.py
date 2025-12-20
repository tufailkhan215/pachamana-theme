#!/usr/bin/env python3
"""
JavaScript and Animation Verification Script
Checks script loading order, dependencies, and animation initialization
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
LAYOUT_FILE = BASE_DIR / "layout" / "theme.liquid"

def extract_scripts(content):
    """Extract all script tags and their order"""
    scripts = []
    # Pattern for script src
    pattern = r'<script[^>]*src=["\']([^"\']+)["\'][^>]*>'
    matches = re.finditer(pattern, content, re.IGNORECASE)
    for match in matches:
        src = match.group(1)
        # Check if it's asset_url or external
        if 'asset_url' in src or src.startswith('http'):
            scripts.append({
                'src': src,
                'line': content[:match.start()].count('\n') + 1,
                'defer': 'defer' in match.group(0).lower(),
                'type': 'external' if src.startswith('http') else 'local'
            })
    return scripts

def check_script_order(scripts):
    """Verify script loading order is correct"""
    issues = []
    warnings = []
    
    # Expected order: jQuery -> Elementor -> Plugins -> Utilities
    jquery_loaded = False
    elementor_config_loaded = False
    elementor_loaded = False
    
    for i, script in enumerate(scripts):
        src = script['src']
        
        # Check jQuery loads first
        if 'jquery' in src.lower() and not jquery_loaded:
            jquery_loaded = True
        elif 'jquery' in src.lower() and jquery_loaded:
            # Check if jQuery plugins load after jQuery
            if 'jquery' in src.lower() and 'plugin' not in src.lower():
                issues.append(f"Line {script['line']}: jQuery loaded multiple times or out of order")
        
        # Check Elementor config loads before Elementor JS
        if 'elementorFrontendConfig' in src or 'elementor' in src.lower():
            if 'config' in src.lower() or 'elementorFrontendConfig' in src:
                elementor_config_loaded = True
            elif 'elementor-frontend' in src.lower() and not elementor_config_loaded:
                issues.append(f"Line {script['line']}: Elementor JS loads before config")
            elif 'elementor-frontend' in src.lower():
                elementor_loaded = True
        
        # Check jQuery plugins load after jQuery
        if 'jquery' in src.lower() and 'plugin' in src.lower():
            if not jquery_loaded:
                issues.append(f"Line {script['line']}: jQuery plugin loads before jQuery: {src}")
        
        # Check accordion script loads after jQuery
        if 'accordion' in src.lower() and not jquery_loaded:
            warnings.append(f"Line {script['line']}: Accordion script may need jQuery: {src}")
    
    return issues, warnings

def check_animation_scripts(content):
    """Check for animation-related scripts and initialization"""
    issues = []
    found = []
    
    # Check for Elementor animation support
    if 'elementor-invisible' in content:
        found.append("Elementor invisible class handling")
        if 'elementor-invisible' in content and 'remove' in content:
            # Check if there's code to remove invisible class
            if not re.search(r'\.classList\.remove\([\'"]elementor-invisible', content):
                issues.append("Missing code to remove elementor-invisible class for animations")
    
    # Check for accordion animation
    if 'theplus-accordion' in content:
        found.append("Accordion functionality")
        if 'slideUp' not in content and 'slideDown' not in content:
            issues.append("Accordion slide animations may be missing")
    
    # Check for jQuery animation support
    if 'jquery' in content.lower():
        found.append("jQuery loaded (enables animations)")
    
    # Check for Elementor animation CSS
    if 'fadeIn' in content or 'slideInDown' in content or 'zoomIn' in content:
        found.append("Animation CSS classes referenced")
    
    return issues, found

def check_dependencies(content):
    """Check for missing dependencies"""
    issues = []
    warnings = []
    
    # Check if jQuery is loaded before plugins
    jquery_line = None
    plugin_lines = []
    
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        if 'jquery.min.js' in line.lower() and 'asset_url' in line:
            jquery_line = i
        elif 'jquery' in line.lower() and ('plugin' in line.lower() or 'sticky' in line.lower() or 'smartmenus' in line.lower()):
            plugin_lines.append((i, line))
    
    if jquery_line:
        for line_num, line in plugin_lines:
            if line_num < jquery_line:
                issues.append(f"Line {line_num}: jQuery plugin loads before jQuery")
    
    # Check Elementor dependencies
    if 'elementor-frontend' in content.lower():
        if 'webpack.runtime' not in content.lower():
            issues.append("Elementor webpack.runtime may be missing")
        if 'frontend-modules' not in content.lower():
            issues.append("Elementor frontend-modules may be missing")
    
    # Check for imagesloaded (needed for galleries)
    if 'gallery' in content.lower() or 'isotope' in content.lower():
        if 'imagesloaded' not in content.lower():
            warnings.append("Gallery/Isotope may need imagesloaded library")
        else:
            # Check imagesloaded loads before isotope
            imagesloaded_line = None
            isotope_line = None
            for i, line in enumerate(lines, 1):
                if 'imagesloaded' in line.lower() and 'asset_url' in line:
                    imagesloaded_line = i
                if 'isotope' in line.lower():
                    isotope_line = i
            
            if imagesloaded_line and isotope_line and isotope_line < imagesloaded_line:
                issues.append(f"Isotope loads before imagesloaded (line {isotope_line} vs {imagesloaded_line})")
    
    return issues, warnings

def check_initialization_code(content):
    """Check for proper initialization code"""
    issues = []
    found = []
    
    # Check for DOMContentLoaded or jQuery ready
    if 'DOMContentLoaded' in content or 'document.ready' in content or 'jQuery(document).ready' in content:
        found.append("DOM ready handlers present")
    else:
        issues.append("No DOM ready handlers found - scripts may run before DOM is ready")
    
    # Check for Elementor initialization
    if 'elementorFrontend' in content:
        found.append("Elementor initialization code present")
        if 'populateActiveBreakpointsConfig' in content:
            found.append("Elementor config patching present")
    
    # Check for accordion initialization
    if 'theplus-accordion' in content:
        if 'initAccordion' in content or 'accordion' in content.lower():
            found.append("Accordion initialization code present")
        else:
            issues.append("Accordion elements found but no initialization code")
    
    # Check for animation fallback
    if 'elementor-invisible' in content:
        if 'setTimeout' in content or 'remove' in content:
            found.append("Animation fallback code present")
        else:
            warnings.append("elementor-invisible class found but no fallback removal code")
    
    return issues, found

def main():
    """Main verification function"""
    print("=" * 70)
    print("JavaScript and Animation Verification")
    print("=" * 70)
    
    if not LAYOUT_FILE.exists():
        print(f"\n[ERROR] Layout file not found: {LAYOUT_FILE}")
        return 1
    
    with open(LAYOUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract scripts
    print("\n[1] Checking Script Loading Order...")
    scripts = extract_scripts(content)
    print(f"   Found {len(scripts)} script tags")
    
    order_issues, order_warnings = check_script_order(scripts)
    if order_issues:
        print(f"   [ERRORS] {len(order_issues)} script order issues:")
        for issue in order_issues:
            print(f"     - {issue}")
    if order_warnings:
        print(f"   [WARNINGS] {len(order_warnings)} script order warnings:")
        for warning in order_warnings:
            print(f"     - {warning}")
    if not order_issues and not order_warnings:
        print("   [OK] Script loading order is correct")
    
    # Check dependencies
    print("\n[2] Checking Dependencies...")
    dep_issues, dep_warnings = check_dependencies(content)
    if dep_issues:
        print(f"   [ERRORS] {len(dep_issues)} dependency issues:")
        for issue in dep_issues:
            print(f"     - {issue}")
    if dep_warnings:
        print(f"   [WARNINGS] {len(dep_warnings)} dependency warnings:")
        for warning in dep_warnings:
            print(f"     - {warning}")
    if not dep_issues and not dep_warnings:
        print("   [OK] All dependencies are properly ordered")
    
    # Check animations
    print("\n[3] Checking Animation Scripts...")
    anim_issues, anim_found = check_animation_scripts(content)
    if anim_found:
        print(f"   [FOUND] Animation features detected:")
        for feature in anim_found:
            print(f"     + {feature}")
    if anim_issues:
        print(f"   [ERRORS] {len(anim_issues)} animation issues:")
        for issue in anim_issues:
            print(f"     - {issue}")
    if not anim_issues:
        print("   [OK] Animation scripts are properly configured")
    
    # Check initialization
    print("\n[4] Checking Initialization Code...")
    init_issues, init_found = check_initialization_code(content)
    if init_found:
        print(f"   [FOUND] Initialization code detected:")
        for feature in init_found:
            print(f"     + {feature}")
    if init_issues:
        print(f"   [ERRORS] {len(init_issues)} initialization issues:")
        for issue in init_issues:
            print(f"     - {issue}")
    if not init_issues:
        print("   [OK] Initialization code is present")
    
    # Summary
    print("\n" + "=" * 70)
    print("Verification Summary")
    print("=" * 70)
    
    total_errors = len(order_issues) + len(dep_issues) + len(anim_issues) + len(init_issues)
    total_warnings = len(order_warnings) + len(dep_warnings)
    
    if total_errors == 0 and total_warnings == 0:
        print("\n[PASS] All JavaScript and animation scripts are properly configured!")
        return 0
    elif total_errors == 0:
        print(f"\n[WARN] Theme has {total_warnings} warnings but should work.")
        return 0
    else:
        print(f"\n[FAIL] Theme has {total_errors} errors that need to be fixed!")
        return 1

if __name__ == "__main__":
    exit(main())

