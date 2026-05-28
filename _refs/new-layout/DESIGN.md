---
name: Premium Glassmorphism
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#00dbe7'
  on-tertiary: '#00363a'
  tertiary-container: '#00a0a9'
  on-tertiary-container: '#002f32'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#74f5ff'
  tertiary-fixed-dim: '#00dbe7'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

This design system centers on a "Digital Obsidian" aesthetic—a sophisticated blend of deep, dark surfaces and luminous glass-like overlays. The brand personality is futuristic, premium, and immersive, targeting high-end tech, fintech, or creative platforms that require a sense of depth and tactile luxury.

The visual direction utilizes a refined **Glassmorphism** style. It moves away from flat design by introducing verticality through transparency and refraction. The UI should evoke an emotional response of clarity, exclusivity, and technological precision. Whitespace is used generously to prevent the dark theme from feeling heavy, ensuring that the vibrant accents "pop" against the charcoal foundations.

## Colors

The palette is anchored in a deep charcoal-to-black base to provide maximum contrast for the translucent glass elements. 

- **Primary & Secondary:** A duo of vibrant electric blue and purple create dynamic energy. These are used for primary actions, active states, and focus indicators.
- **Accents:** A tertiary cyan is reserved for "success" states or micro-interactions to maintain the futuristic feel.
- **Surface Strategy:** Backgrounds are deep black. Interactive surfaces use a semi-transparent white (4-8% opacity) combined with heavy backdrop blurring.
- **Glass Edge:** Borders are never solid grey; they use a semi-transparent white to simulate the refraction of light on a glass edge.

## Typography

The design system utilizes **Hanken Grotesk** for its sharp, contemporary geometry and exceptional legibility in dark environments. 

Headlines use a tighter letter-spacing and heavier weights to command attention, while body copy maintains a generous line height (1.6) to ensure readability against complex blurred backgrounds. Label styles use a slightly increased weight and subtle tracking to remain distinct at smaller sizes. For the most premium feel, ensure headers utilize high-contrast white (#FFFFFF) while secondary body text is slightly dimmed (rgba(255, 255, 255, 0.7)) to establish hierarchy.

## Layout & Spacing

This design system follows a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. The layout philosophy is centered on "Floating Modules." Instead of edge-to-edge containers, content should reside in frosted glass cards that float over the deep background.

- **Rhythm:** An 8px base unit governs all padding and margins. 
- **Gutters:** 24px gutters provide enough "air" between glass panels to maintain the illusion of depth.
- **Margins:** Desktop layouts use wide 64px side margins to focus content in the center, enhancing the premium, cinematic feel.
- **Alignment:** Consistent internal padding of 32px within cards is recommended to ensure content doesn't feel cramped against the glass edges.

## Elevation & Depth

Depth is not communicated through traditional black shadows, but through **light and blur**. 

1.  **The Base:** A solid dark background (#050505).
2.  **The Surface:** Semi-transparent layers (`rgba(255,255,255, 0.05)`) with a `backdrop-filter: blur(12px)`.
3.  **The Edge:** A 1px border (`rgba(255,255,255, 0.1)`) acts as a highlight, catching the light like the edge of a pane of glass.
4.  **The Glow:** High-elevation elements (like active buttons or modals) use a soft, diffused outer glow using the primary or secondary color (e.g., `box-shadow: 0 0 30px rgba(59, 130, 246, 0.3)`).

Layering glass panels over one another increases the opacity and blur density, naturally creating a stack order that users can perceive intuitively.

## Shapes

The shape language is consistently **Rounded (Level 2)**. 

Standard components like inputs and buttons use a 0.5rem (8px) radius. Larger containers and cards use a 1rem (16px) radius, while featured hero elements or modals use 1.5rem (24px). This soft geometry balances the "tech" feel of the colors with a more approachable, modern touch. Avoid sharp 0px corners, as they break the organic "refraction" illusion of the glass surfaces.

## Components

### Buttons
- **Primary:** Gradient fill (Electric Blue to Purple) with a soft color-matched glow on hover.
- **Secondary (Glass):** Frosted glass background with a 1px white edge and white text. 
- **Ghost:** No background, 1px glass-edge border, primary-colored text.

### Cards
- **Material:** Frosted glass effect (12px blur).
- **Border:** 1px `rgba(255,255,255, 0.12)` top and left, `rgba(255,255,255, 0.06)` bottom and right to simulate directional light.
- **Padding:** Always 24px or 32px.

### Input Fields
- **Background:** Slightly darker than the glass cards (approx 8% opacity).
- **Focus State:** Border changes to the primary Electric Blue with a subtle 4px outer glow.
- **Placeholder:** Dimmed white (40% opacity).

### Chips & Tags
- Small, pill-shaped glass surfaces. Active chips use a solid primary blue background with no blur, while inactive ones remain translucent.

### Sidebars & Navigation
- High-blur (20px+) glass panels. Navigation items use a "glow-bar" on the left side to indicate active status rather than a solid background change, keeping the transparency clear.