# 🎨 CSS Troubleshooting Guide

## Common CSS Issues and Solutions

### Issue: CSS Not Loading on Some Pages

**Symptoms:**
- Some pages look unstyled (plain HTML)
- Tailwind classes not working
- Inconsistent styling across pages

**Solutions:**

#### 1. Clear Next.js Cache
```bash
# Stop the development server
pkill -f "next dev"

# Clear Next.js cache
rm -rf .next

# Clear node modules cache
rm -rf node_modules/.cache

# Restart the server
npm run dev
```

#### 2. Check CSS Import
Make sure `globals.css` is imported in `app/layout.tsx`:
```typescript
import './globals.css'
```

#### 3. Verify Tailwind Config
Check that `tailwind.config.ts` includes all your file paths:
```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "*.{js,ts,jsx,tsx,mdx}",
],
```

#### 4. Check PostCSS Config
Ensure `postcss.config.js` is correct:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Issue: CSS Variables Not Working

**Symptoms:**
- Custom CSS variables (like `--primary`) not applying
- Colors not matching design system

**Solutions:**

#### 1. Verify CSS Variables in globals.css
Make sure variables are defined in `:root`:
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: 222.2 47.4% 11.2%;
  /* ... other variables */
}
```

#### 2. Check Tailwind Config
Ensure variables are mapped in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // ... other colors
    },
  },
},
```

### Issue: Specific Pages Not Styled

**Symptoms:**
- Only certain pages have CSS issues
- Other pages work fine

**Solutions:**

#### 1. Check Page Structure
Ensure pages follow the correct structure:
```typescript
export default function PageName() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* content */}
    </div>
  )
}
```

#### 2. Verify Client Components
If using `'use client'`, ensure CSS is still loaded:
```typescript
'use client'

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* content */}
    </div>
  )
}
```

### Issue: Build Errors Related to CSS

**Symptoms:**
- Build fails with CSS-related errors
- Import errors for CSS files

**Solutions:**

#### 1. Check Dependencies
Ensure all required packages are installed:
```bash
npm install tailwindcss postcss autoprefixer tailwindcss-animate
```

#### 2. Verify Package Versions
Check for version conflicts:
```bash
npm list tailwindcss postcss autoprefixer
```

#### 3. Reinstall Dependencies
If issues persist:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Debug Steps

### Step 1: Test Basic CSS
Visit `/debug` to test if basic Tailwind classes work.

### Step 2: Check Browser Console
Open browser dev tools and check for CSS-related errors.

### Step 3: Verify CSS Loading
In browser dev tools, check if `globals.css` is loaded in the Network tab.

### Step 4: Test Individual Pages
Visit each page to identify which ones have issues:
- `/` - Home page
- `/dashboard` - Dashboard
- `/yc-prototype` - YC Prototype
- `/test-notion` - Notion Test
- `/debug` - CSS Debug page

## Quick Fix Commands

```bash
# Complete CSS reset
pkill -f "next dev"
rm -rf .next
rm -rf node_modules/.cache
npm install
npm run dev

# Test build
npm run build

# Check for errors
npm run lint
```

## Prevention Tips

1. **Always restart dev server** after making CSS changes
2. **Clear cache** when experiencing issues
3. **Use consistent class naming** across components
4. **Test on multiple pages** to ensure consistency
5. **Keep dependencies updated**

## Debug Pages

- **CSS Debug**: `/debug` - Test all CSS features
- **CSS Test**: `/css-test` - Basic CSS functionality
- **Home**: `/` - Landing page styling
- **Dashboard**: `/dashboard` - Complex component styling

---

**If issues persist after trying these solutions, check the browser console for specific error messages and refer to the Next.js documentation for CSS troubleshooting.** 