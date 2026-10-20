// Captured from real runs on 2026-10-20 (Linux x86_64) of the CLI built from trunk, which
// reports 0.1.9-beta.1: `NO_COLOR=1 lepton new hello-lepton --template react-ts --target
// webview --non-interactive`, then `pnpm install` and `lepton package`. The CLI chose pnpm
// because it is installed. The package lines keep only the facts, as before. Recapture when
// the output changes.
export const leptonNew = "\n  \u25c9 lepton  create an app \u00b7 v0.1.9-beta.1\n\n  \u25c6 Project     hello-lepton\n  \u25c6 Frontend    React \u00b7 TypeScript\n  \u25c6 Render      webview \u00b7 your page in WPE WebKit\n  \u25c6 Plugins     none\n  \u25c6 Identifier  hello-lepton\n\n  \u2714 Scaffolded the React \u00b7 TypeScript frontend      6 files\n  \u2714 Added the Lepton core                           117 files\n  \u2714 Wired the window, commands and permissions      12 files\n\n  Your app is ready in hello-lepton\n\n    cd hello-lepton\n    pnpm install            install the dependencies\n    pnpm lepton dev         open the window, with hot reload\n    pnpm lepton build       build a release binary\n\n  docs  https://github.com/lepton-desk/lepton";

export const leptonPackage = "built src-lepton/zig-out/bin\npackaged src-lepton/bundle/hello-lepton-0.1.0-linux-x86_64\n  depends  glib2 glibc libsoup3 libxcb wayland wpewebkit\n  src-lepton/bundle/hello-lepton-0.1.0-linux-x86_64.tar.gz  176601 bytes  sha256 2ef7df5ad2f1c47490a0dfcbd081ddc78702f50144f3fc4bad804c4e05ae8e97";
