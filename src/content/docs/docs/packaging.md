---
title: Packaging
description: tar.gz, .deb and Arch packages from one command.
---

```sh
npm run lepton package
```

`lepton package` builds a release and lays it out under `src-lepton/bundle/<name>-<version>-linux-<arch>/`, with a desktop entry, then writes each format listed in `bundle.targets`. The default is `tar.gz`.

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

Packages are reproducible: sorted entries, `root:root`, and `SOURCE_DATE_EPOCH`. Each archive gets a `.sha256` file. A format that can't be built is an error, never a silent skip.

The application does not carry a browser: a React app from `lepton new` packaged to a 173,852-byte `.tar.gz` here, depending on the system's `wpewebkit`.

## `--verify`

```sh
npm run lepton package -- --verify
```

Unpacks every package into an empty directory, starts the app from there, measures its memory, closes it, and fails if it does not start or leaves a process behind.
