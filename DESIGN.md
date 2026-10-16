---
name: Lepton
description: Desktop apps on the web engine your system already has, shown as an annotated bubble-chamber plate.
colors:
  plate: "#d5d8d0"
  plate-hi: "#e3e5de"
  plate-lo: "#b9bdb3"
  paper: "#f2f1eb"
  ink: "#1b1d1c"
  ink-soft: "#3f4441"
  ink-faint: "#6b716c"
  exposed: "#2e3331"
  pencil: "#a32b17"
  pencil-soft: "#c9533e"
  pencil-lifted: "#f0b9ab"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 14vw, 12.5rem)"
    fontWeight: 850
    lineHeight: 0.86
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 62"
  headline-close:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3.4rem, 2rem + 6vw, 6rem)"
    fontWeight: 850
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.6rem + 2.6vw, 4.2rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 66"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.25rem + 1vw, 2.1rem)"
    fontWeight: 750
    lineHeight: 1.1
    fontVariation: "'wdth' 75"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.1rem + 0.45vw, 1.45rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.12rem)"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(0.84rem, 0.8rem + 0.15vw, 0.92rem)"
    fontWeight: 650
    letterSpacing: "0.08em"
  annotation:
    fontFamily: "Kalam, Archivo, cursive"
    fontSize: "clamp(1.2rem, 1.1rem + 0.45vw, 1.45rem)"
    fontWeight: 700
    lineHeight: 1.15
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0px"
spacing:
  "1": "0.375rem"
  "2": "0.75rem"
  "3": "1.25rem"
  "4": "2rem"
  "5": "3.25rem"
  "6": "clamp(4rem, 3rem + 5vw, 8rem)"
  gutter: "clamp(1rem, 0.5rem + 2.4vw, 3.5rem)"
  frame: "clamp(0.5rem, 0.2rem + 1.2vw, 1.75rem)"
components:
  command-strip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "0.85em 1.1em"
    height: "3.4rem"
  command-strip-copy-hover:
    backgroundColor: "{colors.exposed}"
    textColor: "{colors.paper}"
  action:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 1em"
    height: "3.4rem"
  action-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  status-works:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.2em 0.6em 0.25em"
  status-experimental:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.2em 0.6em 0.25em"
  status-planned:
    textColor: "{colors.pencil}"
    typography: "{typography.annotation}"
  print:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.3}"
  lang-switch-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "0.3em 0.6em"
---

# Design System: Lepton

## Overview

**Creative North Star: "The Event Plate"**

Every surface is a photographed bubble-chamber plate as it would sit in a physicist's folder: a silver-gelatin grey ground, graphite tracks drawn as rows of bubbles, grease-pencil notes lettered by hand beside the tracks, and pale paper prints (code, data tables) laid on top. Claims are set as a single monumental, very condensed grotesk line per section; the evidence underneath is real data, set plainly.

The system is square, flat-on-the-page and evidential. Depth comes from paper resting on the plate, not from UI chrome. Red is only ever the annotator's hand: notes, leaders, the vertex ring, the "planned" mark, selection and focus. Monospace appears only where something is literally typed or printed by a machine. The film negative (graphite ground, pale ink, lifted pencil) is the inverse state, used for raw CLI output on the landing page and for the docs' dark theme.

The rejected direction, confirmed by the direction contract: the dark dev-tool hero with glowing gradient and a feature-card grid.

**Key Characteristics:**
- Plate grey ground, graphite ink, grease-pencil red annotations, paper prints.
- Fiducial crosses at the four corners of every section frame, with a scale-tick ruler along the top edge.
- One claim per section in Archivo at 62-66% width, weight 800-850, line-height under 1.
- Hand-lettered Kalam notes tied to what they describe with a short red leader.
- Zero radius everywhere; 1-2px ink rules; soft paper shadows only.
- Hover is an exposure change: a surface goes from print to ink, or a pencil underline draws in.

## Colors

A near-monochrome photographic palette with one hand-applied red; all neutrals carry a faint green-grey cast from the silver print.

### Primary
- **Grease Pencil** (pencil): the annotator's red. Hand notes, leaders, the vertex ring (also drawn on canvas), the "planned" status, nav hover underline, `::selection`, and the 2px focus outline. Code keywords use a slightly deeper variant (#a52c18) inside the code theme only.
- **Soft Pencil** (pencil-soft): pencil on ink at small decorative scale, i.e. the `$` prompt in the command strip and selection inside the film-negative section.
- **Lifted Pencil** (pencil-lifted): grease pencil on the film negative. Command captions and hand notes in the CLI section, and the "copied" state of the copy button. Used in the build as a literal, not yet a custom property.

### Neutral
- **Plate Grey** (plate): the photographic ground of the page, the first-viewport plate and the closing section; also `theme-color` and the docs' light nav.
- **Plate Highlight** (plate-hi): the lit centre of the plate (radial gradient), the event-diagram section ground, the language-switch hover.
- **Plate Shadow** (plate-lo): scrollbar track; docs' light gray-5.
- **Print Paper** (paper): code prints, the status sheet, action buttons, and text on ink.
- **Graphite Ink** (ink): all type, tracks, fiducials, rules; the ground of the film-negative section and the command strip.
- **Soft Graphite** (ink-soft): secondary copy, lead paragraphs, table headings, "Desk" in the wordmark, planned row names.
- **Faint Graphite** (ink-faint): non-text only (scrollbars, comment-adjacent greys). It fails body contrast on plate (3.5:1).
- **Exposed** (exposed): the hover state of controls sitting on ink.

### Named Rules
**The Annotator's Hand Rule.** Red marks are things a person wrote on the plate: notes, leaders, rings, the planned stamp, selection, focus. Never a fill for buttons, panels or headings (the one exception is the core label in the event diagram, which is itself an annotation).

**The Legible Pencil Rule.** Grease pencil (#a32b17) measures 5.0:1 on plate grey, 5.67:1 on plate-hi and 6.37:1 on paper, so it passes AA at any size on those grounds; it never sits on plate-lo (3.77:1). On ink, use Lifted Pencil, never base pencil.

**The Negative Rule.** Inverting to ink is the film negative, reserved for machine output (the CLI run) and the docs' dark theme. It is not a section-alternation device.

## Typography

**Display Font:** Archivo variable (width 62-125%, weight 100-900), self-hosted, with system-ui fallback
**Annotation Font:** Kalam 700, self-hosted
**Mono Font:** JetBrains Mono, self-hosted

**Character:** A tall, compressed grotesk sets the measured claims like plate captions; a quick marker hand annotates them. The width axis, not size alone, carries hierarchy: the narrower the cut, the louder the claim.

### Hierarchy
- **Display** (850, 62% width, clamp up to 12.5rem, 0.86): the single word "Lepton" as the event label in the first viewport. Once per page.
- **Headline Close** (850, 62% width, step-4, 0.9, max 12ch): the closing invitation.
- **Headline** (800, 66% width, step-3, 0.95): one claim per section.
- **Title** (750, 75% width, step-2, 1.1): rows in a track list (engine names); diagram node names use 750 at 78%.
- **Lead** (400, step-1, 1.45, 38-56ch, ink-soft): the paragraph under each claim. The offer line in the plate is step-2 at 88% width, max 30ch.
- **Body** (400, step-0, 1.55, tabular figures): everything else; notes capped at 60ch.
- **Label** (600-650, step--1, 0.04-0.08em tracking, uppercase, 80-88% width): table heads, status stamps, copy button, plate id in the index strip, engine "where" fields, EN/TR.
- **Annotation** (Kalam 700, step-1, 1.15-1.3, pencil): hand notes, figure captions on prints, the closing memory line under the status table.
- **Mono** (0.82-1.15rem): commands, code prints, CLI output, captions that are literal commands.

### Named Rules
**The Width Is the Voice Rule.** Claims are compressed (62-66%) and heavy (800-850) with negative tracking; UI labels are mildly condensed (80-88%); running text stays at normal width.

**The Typed-Only Mono Rule.** Monospace only for what a person types or a program prints. Never for labels, numbers or decoration.

**The Hand Is Not Body Rule.** Kalam is for short annotations of one or two lines. Never for paragraphs, headings or controls.

## Layout

The page is a stack of plates inside a thin outer margin (`frame`), each section a framed rectangle with horizontal padding `gutter` and vertical padding space-6. Sections alternate framing intensity rather than colour: full ink border (first plate, close), faint side rules only (claim sections), a plate-hi ground with faint border (event diagram), and the ink negative (CLI).

Two-column sections split on a 5/7 or 4/8 fraction (claim left, evidence right); code prints use 7/5 with the long file spanning two rows. Columns collapse to one at 52rem (engines, diagram) or 60rem (code, status, CLI); actions stack into full-width rows below 30rem.

The first viewport is the whole plate: at least `max(40rem, 100svh)`, an index strip on top (brand, plate id, Docs / Status / GitHub, EN|TR), the event label in the left third, and a canvas of simulated tracks from a vertex at 72% width. Below 47.5rem the nav wraps to two rows, the text column drops to the bottom (top padding 46svh) and the track field fills the upper half.

Spacing rhythm is a short geometric ramp (0.375, 0.75, 1.25, 2, 3.25rem, then a fluid 4-8rem section step). Fluid type steps scale between ~320 and 1440px.

### Named Rules
**The Registration Rule.** Every section frame carries four fiducial crosses (22px, 2px arms, 14px in from the edge) and, by default, a top ruler of major ticks every 70px and minor ticks every 14px at 55% opacity. On ink they switch to paper at 70%.

**The Clear Lettering Rule.** Tracks never pass under type: the canvas masks each line box of the text column with 12px clearance, and notes are placed where they cover the fewest bubbles, never over text, nav, the scale bar or another note.

## Elevation & Depth

Flat plate, resting paper. The plate itself has no elevation; its only depth is photographic (a lit radial centre and a 12% ink vignette at the edges). Objects that are physically "laid on" the plate (paper prints, the status sheet, action buttons, the command strip) carry a two-part soft shadow: a 1px contact line plus a long, negatively spread blur. Shadows never move on hover.

### Shadow Vocabulary
- **Contact print** (`box-shadow: 0 1px 1px rgb(27 29 28 / 0.12), 0 18px 32px -24px rgb(27 29 28 / 0.55)`): code prints.
- **Data sheet** (`box-shadow: 0 1px 1px rgb(27 29 28 / 0.12), 0 22px 40px -28px rgb(27 29 28 / 0.6)`): the status sheet.
- **Action** (`box-shadow: 0 1px 1px rgb(27 29 28 / 0.2), 0 10px 28px -16px rgb(27 29 28 / 0.55)`): paper action buttons.
- **Command strip** (`box-shadow: 0 1px 1px rgb(27 29 28 / 0.25), 0 10px 28px -14px rgb(27 29 28 / 0.6)`): the ink command strip.

### Named Rules
**The Paper On Plate Rule.** Only paper and the command strip cast shadows. Sections, the plate, and track lists are flat and bounded by rules.

## Shapes

Every corner is square (0 radius), including buttons, stamps, prints and the language switch. Boundaries are ink rules: 1px for frames and row dividers (often ink at 18-35% alpha), 1.5px for stamps and the language switch, 2px for list tops, table heads and buttons. The only curves in the system are physical: track spirals, the vertex ring, the logo's curling track. Status uses form, not colour: filled stamp (works), outline (experimental), dashed outline (next release), hand lettering (planned).

## Components

### Buttons
Paper slips pinned to the plate.
- **Shape:** square, 2px ink border, 3.4rem tall, inline 16px SVG line icon at 0.6em gap.
- **Action:** paper ground, ink text, Archivo 650 at 88% width, step-0.
- **Hover / Focus:** exposure change, background goes to ink and text to paper over 240ms with the ease-out curve; focus is a 2px pencil outline offset 3px.

### Command Strip (signature)
The one command, printed in ink.
- **Style:** ink block, paper mono text with a soft-pencil `$` prompt, `user-select: all`; a copy button divided by a 1px paper-18% rule, uppercase label at step--1.
- **States:** hover turns the button to Exposed; after copy the label reads "copied" in Lifted Pencil for 1.8s and a live region announces it; focus outline flips to paper, inset 4px. Copying fires a new track from the plate's vertex.
- **Mobile:** below 30rem the copy label is visually hidden, the icon remains.

### Status Stamps
- **Works:** filled ink stamp, paper uppercase label. **Experimental:** 1.5px ink outline. **Next release:** 1.5px dashed ink outline. **Planned:** no box, Kalam in pencil at step-0.

### Prints (cards)
- **Corner Style:** square.
- **Background:** paper on plate.
- **Shadow Strategy:** Contact print / Data sheet.
- **Border:** 1px ink at 30%; caption row divided by 1px ink at 20%.
- **Caption:** Kalam in pencil, the file path written on the print.
- **Internal Padding:** space-3 (space-4 for the status sheet).

### Navigation (index strip)
- **Style:** a single row along the top of the plate under a 1px ink-35% rule: logo mark + "Lepton Desk" (800 / 500 at 70% width), the plate id label, links at 600 / 85% width, and an EN|TR switch boxed in 1.5px ink.
- **States:** links draw a 2px pencil underline left to right on hover (320ms ease-out); the current language is a filled ink cell, the other lightens to plate-hi on hover.
- **Mobile:** below 47.5rem the links wrap to a full-width second row at step--1; the plate id hides below 60rem.

### Track List
Engines as a list of tracks: 2px ink rule on top, each row divided by 1px ink-30%, title-size name with a status stamp at the right, an uppercase "where" label, then a note in ink-soft. Planned rows soften the name to ink-soft.

### Data Sheet (table)
PDG-booklet table on paper: uppercase tracked heads over a 2px ink rule, row heads 650 at 85% width, tabular numerals, notes in ink-soft. Below 60rem rows become two-line grid blocks and the head row is visually hidden.

### Event Reconstruction
An SVG plate: dotted ink tracks (stroke 4.5, dash 0.5/7, round caps) from a pencil vertex ring, a node name in Archivo 750 per track, a Kalam note beneath it, and a 1.6px pencil leader. A separate tall composition replaces the wide one below 52rem, rather than scaling it.

### Logo
A curling track from a pencil-ringed vertex with a faint incoming beam, in currentColor ink; wordmark "Lepton" at 800, 70% width. In the index strip it is followed by "Desk" at weight 500 in ink-soft.

## Do's and Don'ts

### Do:
- **Do** frame every section with the four fiducial crosses and the tick ruler (paper tone on ink).
- **Do** state one claim per section as a headline at 66% width / 800, with a lead paragraph in ink-soft beneath.
- **Do** annotate evidence in Kalam pencil, tied to its object with a short pencil leader.
- **Do** show status with stamp form (filled, outline, dashed, hand) so it reads without colour.
- **Do** make hover an exposure change (print to ink, or a pencil underline drawing in) on the 240-320ms ease-out curve, and honour `prefers-reduced-motion` by drawing tracks finished.
- **Do** keep every corner square and every boundary an ink rule.

### Don't:
- **Don't** use the dark dev-tool hero with a glowing gradient or a feature-card grid.
- **Don't** fill buttons, panels or headings with pencil red; red is the annotator's hand only.
- **Don't** set base pencil on plate grey below the annotation step, or base pencil on ink at all.
- **Don't** use monospace for anything that is not typed or printed by a program.
- **Don't** let tracks or notes pass under type.
- **Don't** round corners or give the plate or sections a drop shadow.
