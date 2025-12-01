# Homepage Styles Documentation

## 📁 File Structure

```
components/
├── homepage.css         # Main orchestrator file
├── variables.css        # CSS variables and constants
├── hero-section.css     # Hero section styles
├── navigation.css       # Navigation menu styles
└── utilities.css        # Utility classes and components
```

## 🎨 Architecture

### 1. **Variables** (`variables.css`)

- Centralized design tokens
- Typography scales
- Spacing system
- Opacity values
- Animation timing

### 2. **Hero Section** (`hero-section.css`)

- Title typography with color segments
  - `.title-accent` - Accent color (Flik)
  - `.title-light` - Muted color (ary)
- Subtitle and body text
- Responsive adjustments

### 3. **Navigation** (`navigation.css`)

- Minimal typography-based navigation
- Hover underline effects
- Responsive grid layout

### 4. **Utilities** (`utilities.css`)

- Year badge
- Social links (if enabled)
- RSS icon (hidden by default)
- Miscellaneous helper classes

## 🔧 Usage

Import the main `homepage.css` file in your Astro component:

```astro
<style>
  @import "@styles/components/homepage.css";
</style>
```

## 🎯 Design Principles

1. **Modularity**: Each file handles a specific concern
2. **Maintainability**: Clear separation of components
3. **Scalability**: Easy to add new sections or modify existing ones
4. **Performance**: Minimal CSS with Tailwind utilities
5. **Consistency**: Shared variables ensure design consistency

## 🎨 Color System

- **Accent Color**: Used for "Flik" portion of title
- **Text Base**: Main text color with opacity variations
  - `var(--text-muted)`: 0.6 opacity
  - `var(--text-subtle)`: 0.5 opacity
  - `var(--text-ghost)`: 0.3 opacity

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Desktop: ≥ 640px

Key changes:

- Title size: 3.75rem → 8rem
- Navigation gap: 1rem → 3rem
- Padding adjustments for better mobile experience
