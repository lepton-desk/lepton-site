---
title: System requirements
description: What a machine needs to build a Lepton app, and what a user's machine needs to run one, on each platform.
---

Lepton runs on **Linux**, and on **Windows** through WebView2 in the 0.1.9 beta. macOS is not supported. The floors below come from the tools themselves, checked on 2026-10-17; they are not guesses at what usually works.

## Linux

| | Needs | Why |
| --- | --- | --- |
| Kernel | 5.10 or newer | Zig 0.16, which the core is written in, supports Linux 5.10 and newer. |
| Display | Wayland or X11 | The core opens its own window on either. |
| Web engine (webview apps) | WPE WebKit 2.54 or newer, with its WPE Platform API | The API the core uses; stable and on by default since 2.54. Native apps need no engine. |
| To build WPE WebKit 2.54 | GLib 2.70, ICU 70.1, GStreamer 1.18.4, Wayland 1.20, libinput 1.19; Clang 18 or GCC 12 | WebKit's own build checks. This is what decides which distributions can have 2.54 at all. |
| Servo instead (`--servo`, experimental) *0.1.9-beta.2* | Linux x86-64, X11 (XWayland on Wayland); `@lepton-desk/servo-linux-x64` in the project; libX11 and libxkbcommon with their headers (`libx11-dev libxkbcommon-dev` on Debian and Ubuntu; part of `libx11` and `libxkbcommon` on Arch) | Servo draws into the core's X11 window, and the core reads keys through Xlib and xkbcommon. Windows always uses WebView2. |

To **develop**, add [Zig 0.16 or 0.17](https://ziglang.org/download/), Node 20 or newer, and npm, pnpm, Yarn or Bun. `lepton info` checks all of it. *0.1.9-beta.2* The CLI takes the first of `zig`, `zig-0.17` and `zig-0.16` on `PATH` that is 0.16 or 0.17, or the one `LEPTON_ZIG` names, and says so when it finds only another version. Both build the same core, plugins and projects (measured: core tests, a webview app with every plugin, a native app, and the Windows build, with each).

### The CLI on Arch *0.1.7*

`npm create lepton-app` works on every distribution. On Arch the CLI is also packaged: `lepton-desk` builds it from source, `lepton-desk-bin` installs the binary published to npm, and both pull in WPE WebKit. Arch's `zig` is 0.17, so both depend on the AUR's `zig0.16-bin`, which installs Zig 0.16 in `/opt/zig0.16` beside the system Zig; `lepton-desk` hands that one to the CLI, and the system's `zig` can be upgraded. New AUR accounts are closed for now, so until the packages are on the AUR, build them from the repository (`makepkg` does not fetch AUR dependencies itself):

```sh
paru -S zig0.16-bin
git clone https://github.com/lepton-desk/lepton.git
cd lepton/packaging/aur/lepton-desk-bin && makepkg -si
```

The command is `lepton-desk` (`lepton-desk new my-app`): the AUR's `lepton` is Dropbox's JPEG compressor and owns `/usr/bin/lepton`, so the two install side by side. Inside a project the `lepton` script runs the project's own CLI, as with any install.

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

## Windows *0.1.9-beta.0*

Through WebView2, the Chromium-based engine that comes with Windows; your app does not carry it. The core finds the installed runtime itself, so no `WebView2Loader.dll` ships with the app. Building needs Zig 0.16 or 0.17 and Node 20 or newer, as on Linux; `lepton info` checks for the runtime. Packages are a `.zip` and, on request, an MSI made without WiX that installs per user, without admin rights ([Packaging](/docs/packaging/)). The `os`, `fs` and `dialog` plugins were measured there *0.1.9-beta.1*, and `clipboard` *0.1.9-beta.2*: all four end to end in a WebView2 app, `fs.watch` included. The native render path runs there too *0.1.9-beta.2*: a Win32 window drawn on the CPU with DirectWrite text, at 60 frames a second; drawing on the GPU (D3D11) is next. Not there yet: MSIX. Installers are not signed, so Windows shows its SmartScreen warning.

- **Windows 10 (1709 and later, and the LTSC releases) and Windows 11**: the versions Microsoft supports WebView2 on.
- **Windows 8.1, 8 and 7: not supported.** WebView2 stopped at version 109 on them in January 2023 and gets no security fixes there; a web app on an unpatched engine would put its users at risk. Zig 0.16 also supports Windows 10 and newer only. A web view app's program says it needs Windows 10 *0.1.9-beta.3*, so these systems refuse to start it instead of failing where the page should be. Native apps are built for Windows 7 SP1 and later, but do not start there yet: Zig's standard library imports Windows 8 functions, and Lepton's own system layer that would replace them is planned.

## macOS: not supported

Lepton does not support macOS and does not plan to. Signing and notarizing for macOS needs a paid Apple developer account, and testing needs Mac hardware; Lepton cannot keep that up. `lepton build --macos` is refused with that reason.
