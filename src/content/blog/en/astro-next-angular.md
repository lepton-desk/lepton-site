---
title: "Astro, Next.js and Angular, and a window that waits"
description: "0.1.9-beta.0 brings templates for three frameworks that bring their own server, a setting that tells Lepton how to run any of them, and a fix for a race every Lepton project had. What each framework needed, measured on real projects."
authors: [galaxysal]
date: 2026-10-19
note: "measured on an i3-2120 with a Radeon R7 240"
---

Until now every Lepton template was a Vite project: an `index.html`, a `src/main.ts`, `vite build` into `dist/`, and `lepton dev` started Vite with Vite's flags. Astro, Next.js and Angular don't fit that shape. Each has its own pages, its own dev server and its own output folder. 0.1.9-beta.0 adds templates for all three. To get there we first measured what each one actually does, on real projects, before writing any code.

## What each framework needed

| | Output | Dev server flags | A port that is already taken |
| --- | --- | --- | --- |
| Astro 7.4 | `dist/` | `--port --host --ignore-lock` | moves to the next one, unless `strictPort` is set |
| Next.js 16.4 | `out/` (static export) | `--port --hostname` | stops with an error |
| Angular 22.2 | `dist/<name>/browser`, `dist/` once configured | `--port --host` (`ng serve`) | stops with an error |

The table hides most of the surprises:

- **Astro 7.4 moves its dev server into the background when it detects an AI agent.** It writes a lock file, and the process that started it can end while the server keeps running. Under an agent, a second `astro dev` printed "already running" and exited 0 without looking at the port it was asked for. Lepton starts the server and stops it when the window closes, so a server that leaves on its own breaks the loop. `--ignore-lock` keeps it in the foreground, and the template passes it. A taken port moved Astro to the next one silently; the template's `astro.config.mjs` turns that into an error, because the window has already been told which port to load.
- **Next.js installs `@types/node` itself during the first build when it is missing, and that build then fails** ("Cannot read properties of null (reading 'useContext')"). The second build passes, which is why we saw it once in a prototype and could not reproduce it in the builds that followed. The template now lists `@types/node`.
- **Next.js renders every page once at build time,** where there is no window. Lepton's binding attaches to the window's channel as soon as it loads, so the template's page loads the screen with `next/dynamic` and `ssr: false`.
- **pnpm 11 and newer stop an Angular install** because four dependencies (esbuild, lmdb, @parcel/watcher, msgpackr-extract) have build scripts nobody approved. They ship prebuilt binaries, and the project builds without running the scripts, so the template's `pnpm-workspace.yaml` declines them explicitly.

## One setting instead of one release per framework

The new `frontend` section in `lepton.config.json` tells Lepton where the build goes and how the dev server takes its port and address:

```json
"frontend": {
  "dist": "out",
  "devArgs": ["--port", "{port}", "--hostname", "{host}"]
}
```

Without the section a project behaves as before, as a Vite project. The flags are a list rather than a framework name, so a framework Lepton has never heard of needs one line of configuration, not a new release. `lepton build`, `run` and `dev` read it. The flags must pass both `{port}` and `{host}`; the core loads the page from exactly that address, and the CLI refuses a configuration that leaves either one out.

## The race every project had

The first Astro run under `lepton dev` opened a window whose page never connected. Each request to the core was refused with "Origin null is not allowed". `lepton dev` started the dev server, built the core, and opened the window without checking whether the server was listening yet. The core came from the build cache in 385 ms, before Astro was ready, so the page failed to load and stayed at origin `null` for the rest of the session.

This was never Astro-specific. With Vite the core build usually took longer than Vite's start-up, so the window happened to open in time. Now the window opens only once the server accepts a connection. If the server stops before that, for example on a taken port, `lepton dev` names its exit status instead of opening an empty window.

## Checked the same way as every template

Each of the five new templates (Astro and Next.js in TypeScript and JavaScript, Angular in TypeScript) was created fresh with `lepton new` and then had to pass every check:

- `biome check` with no errors, before and after a build;
- `tsc` with no errors where the template is TypeScript;
- `lepton package --verify`: the packaged app starts, runs for 3 s and closes;
- no console errors in the window under `lepton run` and under `lepton dev`;
- the port free again once the window closed.

In the window, the starter's table filled from the core's shared-memory channel in all three. A packaged app with all its processes, measured as PSS: Astro about 216 MiB, Next.js about 245 MiB, Angular about 231 MiB, next to about 232 MiB for React with Vite. Lepton now has 19 templates.

## Windows, and a schema for your editor

0.1.9-beta.0 is also the first release with Windows in it: the webview path runs on WebView2, and `lepton package` writes a `.zip` and an MSI without WiX. The [changes page](/docs/changelog/) has the measurements. A cross-build from Linux used to fail at the link step, because the build handed the Windows binary the Linux libraries it had found on the machine. A `lepton build --windows` on Linux now produces a 1.1 MB `.exe` that imports only Windows' own DLLs. It has not been started on Windows yet; that is the next thing we check. *(Update: it has. Built from a Next.js project, it opened on Windows 10, its page reached the core, and closing it left no WebView2 process behind.)*

Every project's `lepton.config.json` pointed its `$schema` at an address that never resolved, so editors could not load it. The schema is now [published with this site](/schema/config.json). It was checked against the configs of all 19 templates and 14 broken ones, and it flags a typo such as `devArg` that the CLI used to ignore. `lepton update` moves existing projects to the new address.

## Trying it

The beta is published under the `beta` tag:

```sh
npm create lepton-app@beta
```

With pnpm, name the exact version: pnpm waits a day before using a new release, so `@beta` alone may still resolve to the previous one.

```sh
pnpm dlx create-lepton-app@0.1.9-beta.1
```

---

*How this was written: every number above comes from a command run on the project's own machine (i3-2120, Radeon R7 240, Linux, Wayland); the commands and fixes are in the repository's commits from 19 October 2026. The work and this post were prepared with the help of Claude Code.*
