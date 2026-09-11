---
name: Dosa Circularity Analyzer
description: Sacred Geometry & Polar Metrology Laboratory Design System
colors:
  primary: "#f59e0b"
  primary-deep: "#d97706"
  roast-gold: "#e69d2d"
  roast-amber: "#ca7a17"
  roast-russet: "#a0500a"
  roast-crust: "#78350f"
  roast-deep: "#451a03"
  seal-crimson: "#b91c1c"
  kolam-cyan: "#38bdf8"
  metrology-green: "#10b981"
  neutral-bg: "#0c0e12"
  surface-card: "#12151c"
  surface-elevated: "#181c25"
  chalk-ivory: "#fdfbf7"
  chalk-dim: "#94a3b8"
  border-line: "rgba(253, 251, 247, 0.12)"
typography:
  display:
    fontFamily: "Marcellus, serif"
    fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Marcellus, serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  mono:
    fontFamily: "Inconsolata, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  card-stage:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.chalk-ivory}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Dosa Circularity Analyzer

## Overview

**Creative North Star: "The National Directorate for Dosa Circularity"**

A fusion of ancient Indian sacred radial geometry (the ritual kolam drawn in fine rice-flour chalk at dawn) and the exacting precision of an unyielding national standards and calibration bureau (the cast-iron metrology comparator with laser reticles, vernier verniers, and red wax certification seals).

This design rejects generic cyberpunk SaaS templates (neon card halos, floating particle balls, and Space Grotesk/Orbitron pairings). Instead, it commits to the tangible materiality of a seasoned iron tawa, crisp golden ghee roasting amber, fine chalk-white geometric coordinates, and formal academic research typography.

**Key Characteristics:**
- **Material Authenticity**: Seasoned cast-iron anthracite canvas (`#0c0e12` / `#12151c`) with warm golden ghee accents (`#f59e0b`) and vermilion wax seals (`#b91c1c`).
- **Sacred Polar Geometry**: Concentric polar millimeter rings, 360-degree degree spokes, and authentic Kolam corner registration marks.
- **Academic Seriousness**: High typographic contrast featuring `Marcellus` for classical gravitas, `Albert Sans` for clean UI reading, and `Inconsolata` for authentic scientific telemetry.
- **Deadpan Scientific Parody**: Treating dosa circularity, batter vorticity, and grandmother approval as rigorous mathematical metrology.

## Colors

The palette draws directly from the physical culinary laboratory: cast iron, clarified butter, and rice-flour chalk.

### Primary
- **Tawa Ghee Amber** (`#f59e0b` / `#d97706`): Used for primary interactive triggers, active calibration progress, and circularity indicators. Its warmth echoes the crisp outer crust of a perfectly roasted dosa.

### Secondary
- **Wax Seal Crimson** (`#b91c1c` / `#7f1d1d`): Used exclusively for the Directorate's official verification seals, error/transgression classifications, and high-priority metrological dispatches.
- **Kolam Streamline Cyan** (`#38bdf8`): Used for hydrodynamic fluid vectors, sambar surface tension lines, and telemetry links.
- **Metrology Emerald** (`#10b981`): Active laser interferometer beacons and Class 0 benchmark passes.

### Neutral
- **Seasoned Iron Canvas** (`#0c0e12`): The foundational deep charcoal background, replicating seasoned cast iron.
- **Optical Stage Slate** (`#12151c` / `#181c25`): Card surfaces and workbench bays.
- **Rice Chalk Ivory** (`#fdfbf7`): Primary text and high-precision geometric lines.
- **Slag Dust Slate** (`#94a3b8` / `#64748b`): Secondary labels and metadata citations.

### Named Rules
**The Tawa Contrast Rule.** Text never uses gradient fills. Visual emphasis is achieved strictly through scale, weight, and the crisp contrast between chalk ivory and deep seasoned iron.

## Typography

**Display Font:** Marcellus (serif)
**Body Font:** Albert Sans (sans-serif)
**Telemetry/Mono Font:** Inconsolata (monospace)

**Character:** Dignified academic authority meets clean 21st-century computational geometry.

### Hierarchy
- **Display** (Regular 400, `clamp(2.5rem, 6vw, 4.5rem)`, 1.08 line-height): National Directorate hero statements.
- **Headline** (Regular 400, `clamp(1.75rem, 3.5vw, 2.5rem)`, 1.2 line-height): Section titles (Primary Calibration Bay, Fundamental Axioms).
- **Title** (Regular 400, `1.25rem`, 1.35 line-height): Specimen cards and metric groupings.
- **Body** (Regular 400, `1rem`, 1.65 line-height, max 68ch): Explanatory texts, disclaimers, and axiom proofs.
- **Telemetry** (Medium 500 / Bold 700, `0.75rem–0.9rem`, 1.5 line-height): Measurement readouts, degree ticks, and teletype dispatches.

## Layout

- **Workbench Grid**: 12-column responsive layout with clear hierarchical weight.
- **Generous Spacing**: Distinct vertical rhythm with 6–8rem spacing between major laboratory bays.
- **Max Width**: Standardized container at 1440px with balanced horizontal padding (24px mobile, 48px desktop).

## Elevation & Depth

- **Tonal Layering**: Depth is created primarily through tonal stepping (`#0c0e12` → `#12151c` → `#181c25`) and hairline borders (`rgba(253, 251, 247, 0.1)`), rather than heavy drop-shadows.
- **Directional Glow**: Interactive hover states carry an offset warm amber shadow (`0 4px 24px rgba(245, 158, 11, 0.25)`).
- **Wax Seal Stamp**: Rich multi-layer radial gradient with inset highlight and soft 3D offset shadow.

## Shapes

- **Polar Circles**: Circles dominate the visual language (tawa disk, reticles, radar dials, circular seals).
- **Kolam Corner Brackets**: Rectangular panels feature fine `┌ ┐ └ ┘` registration brackets representing alignment with the optical comparator.
- **Border Radii**: 12px for standard cards, 16px for workbench panels, and 9999px for circular badges.

## Components

### Buttons
- **Primary**: Bold ghee gold (`#f59e0b`), dark text (`#0c0e12`), 12px rounded corners, 16px 32px padding, subtle shadow and arrow transition on hover.
- **Secondary**: Dark iron fill (`#181c25`), hairline ivory border (`rgba(253,251,247,0.15)`), ivory text, font-mono.

### Calibration Dropzone
- Hairline dashed ivory stroke on deep iron stage (`#0e1015`), responsive to drag-and-drop states with subtle scale and golden amber border transition.

### Wax Seal Badge
- Deep crimson radial gradient with concentric embossed rim, rotated 3–6 degrees, bearing official Directorate verification insignia.

## Do's and Don'ts

### Do:
- **Do** maintain the deadpan academic research tone throughout all UI microcopy, tooltips, and data points.
- **Do** use `Marcellus` for display titles and `Inconsolata` for all numerical telemetry and citations.
- **Do** respect `prefers-reduced-motion` for scanning bars, radar sweeps, and particle grids.

### Don't:
- **Don't** use text gradients, glowing neon cyber cards, or generic SaaS marketing eyebrows.
- **Don't** use generic stock sans-serif fonts for numerical coordinates or headings.
- **Don't** upload user photos to remote servers; maintain pure browser-based client-side evaluation.
