---
title: Packaging
description: tar.gz, .deb and Arch packages on Linux, .zip and MSI on Windows, from one command.
---

```sh
npm run lepton package
```

`lepton package` builds a release and lays it out under `src-lepton/bundle/<name>-<version>-<os>-<arch>/` (on Linux with a desktop entry), then writes each format listed in `bundle.targets`. The default is `tar.gz` on Linux and `zip` on Windows; the Linux packages are refused on Windows before anything is built.

```json
{
  "bundle": {
    "targets": ["tar.gz", "deb", "arch"],
    "maintainer": "Your Name <you@example.com>"
  }
}
```

| Format | |
| --- | --- |
| `tar.gz` | The install prefix, unpackable anywhere. |
| `arch` | An Arch Linux package (`.pkg.tar.zst`). Dependencies come from the binary's linked libraries. |
| `deb` | A Debian package. Needs `bundle.maintainer`. Dependency names come from `dpkg-query`, or from `bundle.deb.depends` on a machine without it — never guessed. |
| `zip` | Windows *0.1.9-beta.0*: the install prefix, `bin\<name>.exe` and the front end beside it. |
| `msi` | Windows *0.1.9-beta.0*: a Windows Installer package written by Lepton itself, without WiX. It installs per user (`%LOCALAPPDATA%\Programs\<product>`) without admin rights, adds a Start menu shortcut, upgrades an older version, replaces another build of the same version *0.1.9-beta.2* (Windows Installer compares only `major.minor.build`, so `1.0.0-beta.1` → `1.0.0-beta.2` is the same version to it), refuses a downgrade, and uninstalls cleanly. `bundle.icon` (an `.ico`) is its shortcut and Apps icon. It passes the Windows SDK's ICE validation with no errors. |

**Icon.** `lepton new` puts Lepton's mark in `src-lepton/icon.svg` *0.1.9-beta.2*; replace it with your own. On Linux the package installs it as `share/icons/hicolor/scalable/apps/<identifier>.svg` and the desktop entry names it (`Icon=<identifier>`); `lepton dev` and `run` install it beside the entry they write. `bundle.icon` names your own: one path or a list, an `.ico` for Windows (the program, the MSI) and an `.svg` for Linux, for example `"icon": ["assets/app.ico", "assets/app.svg"]`; the `.svg` there wins over `src-lepton/icon.svg`. Linux icons are scalable, so a `.png` is refused rather than installed at one size. Without one, each system gets Lepton's mark.

Packages are reproducible: sorted entries, `root:root`, and `SOURCE_DATE_EPOCH`. Each archive gets a `.sha256` file. A format that can't be built is an error, never a silent skip.

The application does not carry a browser: a React app from `lepton new` packaged to a 176,601-byte `.tar.gz` here (0.1.9-beta.1, 2026-10-20), depending on the system's `wpewebkit`.

## `--verify`

```sh
npm run lepton package -- --verify
```

Unpacks every package into an empty directory, starts the app from there, measures its memory, closes it, and fails if it does not start or leaves a process behind. On Windows the app and every process it starts are held in a job object and closed as a user would close the window.

### What an app costs in memory *0.1.9-beta.3*

`--verify` prints it, three seconds after the start: on Windows the private working set of the app and every process it started, the figure Task Manager's Memory column shows (on Linux the tree's PSS). Measured on Windows Server 2025 in Lepton's CI, the same `vanilla-ts` template built both ways:

| App | Processes | Memory |
|---|---|---|
| Web view (WebView2) | 7 | 69.4 MB |
| Native, GPU (Direct3D 11) | 1 | 6.9 MB |
| Native, CPU (`LEPTON_GPU=cpu`) | 1 | 5.9 MB |

The web view's figure is WebView2's processes as much as your page's: two earlier runs gave 70.6 and 72.9 MB. The CI machine has no GPU, so Direct3D 11 there runs on Microsoft's software renderer (WARP, loaded in the process); a machine with a graphics card was not measured yet, nor Linux.
