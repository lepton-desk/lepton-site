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
| `msi` | Windows *0.1.9-beta.0*: a Windows Installer package written by Lepton itself, without WiX. It installs per user (`%LOCALAPPDATA%\Programs\<product>`) without admin rights, adds a Start menu shortcut, upgrades an older version and refuses a downgrade, and uninstalls cleanly. `bundle.icon` (an `.ico`) is its shortcut and Apps icon. It passes the Windows SDK's ICE validation with no errors. |

Packages are reproducible: sorted entries, `root:root`, and `SOURCE_DATE_EPOCH`. Each archive gets a `.sha256` file. A format that can't be built is an error, never a silent skip.

The application does not carry a browser: a React app from `lepton new` packaged to a 176,601-byte `.tar.gz` here (0.1.9-beta.1, 2026-10-20), depending on the system's `wpewebkit`.

## `--verify`

```sh
npm run lepton package -- --verify
```

Unpacks every package into an empty directory, starts the app from there, measures its memory, closes it, and fails if it does not start or leaves a process behind. On Windows the app and every process it starts are held in a job object and closed as a user would close the window.
