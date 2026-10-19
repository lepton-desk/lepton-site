---
title: "A small download is not a small app"
description: "Lepton, Tauri and Electron with the same page, the same window, measured one at a time. What each one ships, what each one uses while it runs, and the bug in Lepton the measurement found."
authors: [galaxysal]
date: 2026-10-17
note: "measured on an i3-2120 with a Radeon R7 240"
---

A Lepton package is small. The hello application packs into a 173 852-byte `.tar.gz`, and the release used below is a 736 KB tree. That number is true, and it is easy to read more into it than it says: it is what you download, not what runs. The web engine still has to run, and on Linux Lepton uses the one the system already has. So we measured what all three run: Lepton, Tauri and Electron.

## How it was measured

- **The same page in all three:** the default page of `create-vite`'s React + TypeScript template, built once (`vite build`, relative paths) and put byte for byte into each application. No framework's own template, no bridge calls.
- **Release builds:** Lepton 0.1.6 with `lepton package`, Tauri 2 with `tauri build`, Electron 44.9.0 with `@electron/packager`.
- **The same window,** 800×600, and **one application at a time**, with nothing compiling.
- **What was counted:** the application's process and every process it started. Development tools such as Vite are not included.
- **Memory as PSS:** a page shared by several processes is divided between them, so the shared parts of a library are not counted once per process. 24 samples, 5 seconds apart.
- **Idle CPU:** CPU time used by the whole tree over 30 seconds with the window open and untouched.

## What each one ships and what each one uses

| | Lepton | Tauri | Electron |
| --- | --- | --- | --- |
| What you ship | 736 KB | 5.8 MB | 284 MB |
| Memory while running (PSS, all processes) | 243 MiB | 255 MiB | 230 MiB |
| The process that draws the page | 172–175 MiB | 135 MiB | not separated |
| Idle CPU | 0.2–0.3% of a core | 0 | 0 |

Ship sizes differ by a factor of almost 400. Memory differs by about 10%, and in this round Electron used the least.

All three draw the page with a browser engine; the difference is only who brings it. Electron brings Chromium with each application. Tauri and Lepton use the engine on the system: WebKitGTK for Tauri, WPE WebKit for Lepton. Not shipping the engine saves the download and the disk space. It does not save the memory the engine uses, because the engine is still loaded; it just comes from the system.

## Read the numbers as a range

The same application moved by 10–50 MiB from one round to another during the day, and we did not measure why. Over the day the totals were Lepton 243–282, Tauri 255–306, and Electron 230–255 MiB. The order within one round tells more than any single number.

Electron's total was measured in full. What is missing is only the separate line for the process that draws the page: every Electron process has the same name, and the script could not tell them apart. In an earlier round its renderer measured 40–75 MiB and its GPU process about 46 MiB.

Electron also uses the least private memory per process (USS). Its processes are forked from one another and share most of their pages, so each one owns little of its own.

## What the measurement found in Lepton

The first runs showed Lepton's page process swinging between 175 and 207 MiB, and an idle window using 2.9% of a core. The cause was Lepton itself. The script Lepton puts into every page fetched the core's whole outbound ring, 532 608 bytes, four times a second, even when nothing had changed, and the engine allocated a fresh buffer for each fetch.

Now the page waits until the core publishes something new and receives only the new frames. The page process stays flat at 176 MiB, and idle CPU fell to 0.2–0.3%. The template's core still publishes a sample every second and the page wakes for each one, which is the likely source of what is left; we have not measured that part on its own. The fix is in [`214e48f`](https://github.com/lepton-desk/lepton/commit/214e48f) and ships with the next release.

## What we take from it

A web front end costs memory, whatever the framework. On this page it was about 230–255 MiB, mostly the engine's own processes. What Lepton changes is what you ship and what stays on disk: one engine on the machine for every Lepton application, as WebView2 is on Windows. It does not make the page itself cheaper.

The 0.2.0 plans aim at that cost too: native interfaces written with web technologies but drawn by Lepton itself, with no browser engine underneath. When they exist, they will be measured the same way, and the numbers will go here.
