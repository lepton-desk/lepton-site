---
title: "How this site got to 100, by measuring instead of guessing"
description: "Lighthouse kept marking the site down for things no guess could fix. What fixed it was recomputing Lighthouse's own numbers from its traces and following them to the cause."
authors: [galaxysal]
date: 2026-10-17
note: "measured on an i3-2120 with a Radeon R7 240"
---

The Lepton site is small: a landing page, seven pages of docs, two languages. It still took two days to make Lighthouse score it 100 on every page, and most of that time went into one lesson: a guess, even a plausible one, is not a cause. This post is the record of what was measured and what each measurement changed.

## The method that worked

Lighthouse's mobile score is not measured directly. It records a trace of one page load and then *simulates* a slow phone and a slow network over that trace (the simulator is called Lantern). So a number in the report can move for reasons that never show up on screen.

What finally worked:

1. Run Lighthouse with `--save-assets`, which keeps the trace and the network log next to the report.
2. Load Lighthouse's own Lantern code in a script and recompute the metric from those files. It matched the report to the millisecond every time.
3. Walk the simulated graph node by node: which CPU task or download ends the metric, and how long it is in the simulation.

Only then change something, and measure the same way again.

What did *not* work, and cost time: changing things because they sounded right (inline the CSS, defer a script), bisecting with three page loads (a "fix" that turned out to be noise), and optimising a stand-in number that never predicted the real outcome.

## The landing page under load

With other programs keeping three cores busy, Lighthouse sometimes reported a page that took over a second to show anything. 18 of 30 runs stalled like this.

Comparing a stalled trace and a clean one event by event showed why. Lighthouse resizes the view while the page is loading. After the resize, Chrome only draws the page's frames once the page has produced one at the new size; until then it keeps them back, for up to a second. The page's first frame at the new size was late because its raster was slow, and two thirds of that raster was the plate's background: two large radial gradients.

The gradients are now the same image rendered once at 64 pixels and stretched (at most 3 of 255 off in any channel). That raster went from 98 to 20 ms, and stalls from 18 of 30 runs to 3 of 30.

## The fonts nobody asked for

On the live site, almost all of Lighthouse's Total Blocking Time turned out to be **system font lookups**. When the first layout ran before the web fonts had arrived, Chrome fell back to its default font and asked the system's font matcher for "Times New Roman" once for every font description on the page. On a Linux desktop with many fonts installed, each of those lookups is expensive.

Three changes, each measured:

- **No generic families.** `sans-serif` and `monospace` at the end of a stack are resolved through the same matcher; removing them took the first frame from 375 to 273 ms (median, under load).
- **A fallback face matched by name.** `'Plate Fallback'` is an `@font-face` that picks an installed sans with `local()`. With the fonts held back past the first layout, lookups fell from 101 to 59 ms and Lighthouse TBT from 51 to 23 ms. Its last source is the site's own Archivo file, so on a system without any of the named fonts the face is still valid instead of becoming another lookup.
- **No `ch` units in the first viewport.** A width in `ch` needs the font's metrics while styles are computed; before the fonts arrive that again meant the default font. `30ch` became `15.44em`, the same width, and that style pass went from 19 to 10 ms.

## Layout shift in the docs

The docs scored 89 to 95 because text moved when the fonts arrived (CLS 0.17 to 0.22). The landing page's first paint is tuned around `font-display: swap`, so the docs got their own copy of the faces with `font-display: optional`: a font that misses the browser's short wait is not swapped in, and the next page uses it from the cache. JetBrains Mono, which arrived 100 to 150 ms after Archivo, is now preloaded, and code falls back to a monospace face matched by name so lines keep their length. Measured with the fonts 300 ms late, CLS went to 0.

## The last point

After all that, docs pages with code blocks still scored 99 locally. Recomputing Lantern's LCP showed the simulated metric ending with one download: the Archivo font file, 65 KB. On a page with code, the code styles and scripts shared the simulated connection with it, and it finished later.

The font is now cut to the characters the site actually uses: all of ASCII, the Turkish letters, and every character in the built pages, with both variable axes and the features the site needs kept. It went from 65 to 38 KB, the pages are pixel-identical, and the simulated LCP of a docs page went from 1966 to 1667 ms.

## Where it stands

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Landing (EN, TR) | 100 | 100 | 100 | 100 |
| Docs (10 pages measured live) | 100 | 100 | 100 | 100 |

Every change above is in the [site's repository](https://github.com/lepton-desk/lepton-site), with the measurement in the commit message or next to the code it explains. The same rule runs through Lepton itself: a claim is something a command printed.
