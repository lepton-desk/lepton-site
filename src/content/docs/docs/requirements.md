---
title: System requirements
description: What a machine needs to build a Lepton app, and what a user's machine needs to run one, on each platform.
---

Lepton runs on **Linux** today. Windows (through WebView2) and macOS (through WKWebView) are planned, not built. The floors below come from the tools themselves, checked on 2026-10-17; they are not guesses at what usually works.

## Linux

| | Needs | Why |
| --- | --- | --- |
| Kernel | 5.10 or newer | Zig 0.16, which the core is written in, supports Linux 5.10 and newer. |
| Display | Wayland or X11 | The core opens its own window on either. |
| Web engine (webview apps) | WPE WebKit 2.54 or newer, with its WPE Platform API | The API the core uses; stable and on by default since 2.54. Native apps need no engine. |
| To build WPE WebKit 2.54 | GLib 2.70, ICU 70.1, GStreamer 1.18.4, Wayland 1.20, libinput 1.19; Clang 18 or GCC 12 | WebKit's own build checks. This is what decides which distributions can have 2.54 at all. |

To **develop**, add [Zig 0.16](https://ziglang.org/download/), Node 20 or newer, and npm, pnpm, Yarn or Bun. `lepton info` checks all of it.

### WPE WebKit by distribution

| Distribution | WPE WebKit 2.54 |
| --- | --- |
| Arch, EndeavourOS, Manjaro | `wpewebkit` from the distribution |
| openSUSE Tumbleweed | `wpewebkit-devel` from the distribution |
| Debian testing and unstable | `libwpewebkit-2.0-dev` from the distribution |
| Ubuntu 24.04, 26.04, 26.10 | not packaged by Ubuntu; from Lepton's own repository, being set up |
| Fedora 43, 44, 45 | retired by Fedora; from Lepton's own repository, being set up |
| Debian 13 (trixie) | the distribution has 2.48.3; its libraries are new enough for 2.54, so a Lepton build is possible but not offered yet |
| Debian 12 (bookworm), Ubuntu 22.04 | libraries meet 2.54's minimums, some only just; not offered yet |
| Ubuntu 20.04 and older | no: GLib 2.64 is below what 2.54 needs |

Where the engine is missing, `lepton info` asks your package manager what it can install and prints the command. *0.1.5* `lepton build`, `dev` and `run` do the same before a webview build and, on a terminal, offer to run it.

### Packaged apps

A package built with `lepton package` is linked against the libraries of the machine that built it, so it runs on that distribution and newer ones, not older ones. Building for older distributions means building on them; that is planned with Lepton's CI, not done yet.

## Windows *planned*

Through WebView2, the Chromium-based engine that comes with Windows; your app does not carry it.

- **Windows 10 (1709 and later, and the LTSC releases) and Windows 11**: the versions Microsoft supports WebView2 on.
- **Windows 8.1, 8 and 7: not supported.** WebView2 stopped at version 109 on them in January 2023 and gets no security fixes there; a web app on an unpatched engine would put its users at risk. Zig 0.16 also supports Windows 10 and newer only. A separate path without a web engine is being considered.

## macOS *planned*

Through WKWebView, the engine that comes with macOS. Zig 0.16 supports macOS 13 and newer, so that is the floor to expect.
