// Every string on the landing page, in both languages. Claims here must match the lepton
// repository: what ships is stated plainly, what is planned says so.

export type Lang = 'en' | 'tr';

export type Status = 'works' | 'experimental' | 'next' | 'planned';

export interface LandingText {
	htmlLang: string;
	title: string;
	description: string;
	nav: { docs: string; github: string; status: string; theme: string; other: string; otherHref: string; otherLabel: string };
	plate: {
		id: string;
		offer: string;
		copy: string;
		copied: string;
		docs: string;
		docsHref: string;
		github: string;
		notes: { core: string; ipc: string; engine: string; platform: string };
		scale: string;
	};
	engine: {
		claim: string;
		body: string;
		rows: { name: string; where: string; note: string; status: Status }[];
	};
	event: {
		claim: string;
		body: string;
		page: string;
		pageNote: string;
		frames: string;
		framesNote: string;
		core: string;
		coreNote: string;
		system: string;
		systemNote: string;
		engine: string;
		engineNote: string;
	};
	code: {
		claim: string;
		body: string;
		zigCaption: string;
		tsCaption: string;
		configCaption: string;
	};
	cli: { claim: string; body: string; caption: string; packageCaption: string };
	status: {
		claim: string;
		body: string;
		head: { item: string; state: string; note: string };
		rows: { item: string; state: Status; note: string }[];
		labels: Record<Status, string>;
		memory: string;
	};
	close: { claim: string; body: string; docs: string; github: string };
	footer: { line: string; license: string };
}

const github = 'https://github.com/lepton-desk/lepton';

export const githubUrl = github;

export const landing: Record<Lang, LandingText> = {
	en: {
		htmlLang: 'en',
		title: 'Lepton — desktop apps on the web engine your system already has',
		description:
			'Lepton is a desktop application framework with a Zig core and a Rust CLI. Your web front end runs on the operating system’s own web engine; no browser ships inside your app.',
		nav: { docs: 'Docs', github: 'GitHub', status: 'Status', theme: 'Dark theme', other: 'TR', otherHref: '/tr/', otherLabel: 'Türkçe' },
		plate: {
			id: 'Plate 0.1 · Linux',
			offer: 'Desktop apps on the web engine your system already has. A Zig core, a Rust CLI, and no browser in the box.',
			copy: 'Copy',
			copied: 'Copied',
			docs: 'Read the docs',
			docsHref: '/docs/getting-started/',
			github: 'Source on GitHub',
			notes: {
				core: 'core · Zig',
				ipc: 'page ↔ core: binary frames, no JSON',
				engine: 'system web engine',
				platform: 'Linux today',
			},
			scale: 'scale: one window',
		},
		engine: {
			claim: 'No browser in the box.',
			body: 'Lepton doesn’t ship its own Chromium inside your app. It uses the web engine the operating system provides. Today that means Linux and WPE WebKit; the rest is on the way, and we say which is which.',
			rows: [
				{ name: 'WPE WebKit', where: 'Linux', note: 'The engine Lepton uses today.', status: 'works' },
				{ name: 'Servo', where: 'Linux', note: 'Optional, for those who’d rather avoid WebKit: lepton build --linux --servo.', status: 'experimental' },
				{ name: 'WKWebView', where: 'macOS', note: 'Planned.', status: 'planned' },
				{ name: 'WebView2', where: 'Windows', note: 'Planned. Chromium-based, but it comes with Windows; your app doesn’t carry it.', status: 'planned' },
			],
		},
		event: {
			claim: 'One event, three tracks.',
			body: 'Your page and the Zig core talk in binary frames over a lepton:// scheme and shared memory. No JSON is parsed on the way. The core owns the window and asks the desktop for the rest.',
			page: 'Your page',
			pageNote: 'React, Vue, Svelte, Solid or plain TypeScript, in the system web engine',
			frames: 'Binary frames',
			framesNote: 'invoke() posts one request frame; events come back numbered',
			core: 'Zig core',
			coreNote: 'window, commands, permissions, plugins',
			system: 'The desktop',
			systemNote: 'Wayland or X11, desktop portals, a systemd scope per app',
			engine: 'System web engine',
			engineNote: 'WPE WebKit draws your page; Lepton ships no browser',
		},
		code: {
			claim: 'A command is a Zig function.',
			body: 'Register it in main.zig, list it in lepton.config.json, call it from the page. A name the config doesn’t list is refused; a listed name with no command fails the build.',
			zigCaption: 'src-lepton/main.zig',
			tsCaption: 'src/App.tsx',
			configCaption: 'lepton.config.json',
		},
		cli: {
			claim: 'One command to a running window.',
			body: 'This is the real output of lepton new, unedited. The CLI is a single native Rust binary; the npm package only launches it.',
			caption: 'lepton new hello-lepton --template react-ts --target webview',
			packageCaption: 'lepton package',
		},
		status: {
			claim: 'What works, and what doesn’t yet.',
			body: 'Lepton is early. This table is the honest version.',
			head: { item: 'Item', state: 'State', note: 'Note' },
			rows: [
				{ item: 'Linux (Wayland, X11)', state: 'works', note: 'Own windows, client-side title bar.' },
				{ item: 'Templates', state: 'works', note: 'React, Vue, Svelte, Solid, vanilla; npm, pnpm, Yarn, Bun.' },
				{ item: 'Packages', state: 'works', note: '.tar.gz, .deb and Arch, reproducible, with --verify.' },
				{ item: 'Plugins', state: 'works', note: 'fs, dialog, clipboard, os.' },
				{ item: 'Native render path', state: 'works', note: 'Drawn by the core with GLES, no web engine.' },
				{ item: 'Record and replay', state: 'next', note: 'lepton record / replay, in 0.1.5.' },
				{ item: 'macOS, Windows', state: 'planned', note: 'WKWebView and WebView2.' },
				{ item: 'Native UI with web tech', state: 'planned', note: 'React, HTML/CSS and JS drawn by Lepton itself, 0.2.0.' },
				{ item: 'Direct GPU rendering', state: 'planned', note: '0.2.0.' },
			],
			labels: { works: 'works', experimental: 'experimental', next: 'next release', planned: 'planned' },
			memory: 'Web engines use memory, and WebView RAM can be high. We know that, and we won’t pretend otherwise.',
		},
		close: {
			claim: 'Try it on your machine.',
			body: 'Linux with WPE WebKit 2.54+, Node 20+ and Zig 0.16. lepton info tells you what is missing.',
			docs: 'Getting started',
			github: 'Star or watch on GitHub',
		},
		footer: { line: 'Lepton is a Lepton Desk project.', license: 'MIT or Apache-2.0' },
	},
	tr: {
		htmlLang: 'tr',
		title: 'Lepton — sisteminizdeki web motoruyla masaüstü uygulamaları',
		description:
			'Lepton, Zig çekirdekli ve Rust CLI’lı bir masaüstü uygulama çatısıdır. Web arayüzünüz işletim sisteminin kendi web motorunda çalışır; uygulamanızın içinde tarayıcı gelmez.',
		nav: { docs: 'Belgeler', github: 'GitHub', status: 'Durum', theme: 'Karanlık tema', other: 'EN', otherHref: '/', otherLabel: 'English' },
		plate: {
			id: 'Levha 0.1 · Linux',
			offer: 'Sisteminizde zaten olan web motoruyla masaüstü uygulamaları. Zig çekirdek, Rust CLI ve kutuda tarayıcı yok.',
			copy: 'Kopyala',
			copied: 'Kopyalandı',
			docs: 'Belgeleri oku',
			docsHref: '/tr/docs/getting-started/',
			github: 'Kaynak kod GitHub’da',
			notes: {
				core: 'çekirdek · Zig',
				ipc: 'sayfa ↔ çekirdek: ikili çerçeveler, JSON yok',
				engine: 'sistemin web motoru',
				platform: 'bugün Linux',
			},
			scale: 'ölçek: bir pencere',
		},
		engine: {
			claim: 'Kutuda tarayıcı yok.',
			body: 'Lepton, uygulamanızın içine kendi Chromium’unu koymaz; işletim sisteminin sağladığı web motorunu kullanır. Bugün bu, Linux ve WPE WebKit demek. Gerisi yolda ve hangisinin hangisi olduğunu açıkça yazıyoruz.',
			rows: [
				{ name: 'WPE WebKit', where: 'Linux', note: 'Lepton’un bugün kullandığı motor.', status: 'works' },
				{ name: 'Servo', where: 'Linux', note: 'WebKit istemeyenler için isteğe bağlı: lepton build --linux --servo.', status: 'experimental' },
				{ name: 'WKWebView', where: 'macOS', note: 'Planlanıyor.', status: 'planned' },
				{ name: 'WebView2', where: 'Windows', note: 'Planlanıyor. Chromium tabanlı ama Windows’la gelir; uygulamanız onu taşımaz.', status: 'planned' },
			],
		},
		event: {
			claim: 'Bir olay, üç iz.',
			body: 'Sayfanız ve Zig çekirdeği, lepton:// şeması ve paylaşılan bellek üzerinden ikili çerçevelerle konuşur. Yolda hiç JSON ayrıştırılmaz. Pencere çekirdeğindir; gerisini masaüstünden ister.',
			page: 'Sayfanız',
			pageNote: 'React, Vue, Svelte, Solid ya da düz TypeScript, sistemin web motorunda',
			frames: 'İkili çerçeveler',
			framesNote: 'invoke() tek bir istek çerçevesi gönderir; olaylar numaralı döner',
			core: 'Zig çekirdek',
			coreNote: 'pencere, komutlar, izinler, eklentiler',
			system: 'Masaüstü',
			systemNote: 'Wayland ya da X11, masaüstü portalları, her uygulamaya bir systemd kapsamı',
			engine: 'Sistemin web motoru',
			engineNote: 'Sayfanızı WPE WebKit çizer; Lepton tarayıcı taşımaz',
		},
		code: {
			claim: 'Bir komut, bir Zig fonksiyonudur.',
			body: 'main.zig’de kaydedin, lepton.config.json’da listeleyin, sayfadan çağırın. Yapılandırmada olmayan bir ad reddedilir; listelenip karşılığı olmayan bir ad derlemeyi durdurur.',
			zigCaption: 'src-lepton/main.zig',
			tsCaption: 'src/App.tsx',
			configCaption: 'lepton.config.json',
		},
		cli: {
			claim: 'Tek komutla açık bir pencereye.',
			body: 'Bu, lepton new’in gerçek ve düzenlenmemiş çıktısı. CLI tek bir yerel Rust programıdır; npm paketi yalnızca onu başlatır.',
			caption: 'lepton new hello-lepton --template react-ts --target webview',
			packageCaption: 'lepton package',
		},
		status: {
			claim: 'Ne çalışıyor, ne henüz değil.',
			body: 'Lepton erken aşamada. Bu tablo işin dürüst hali.',
			head: { item: 'Öğe', state: 'Durum', note: 'Not' },
			rows: [
				{ item: 'Linux (Wayland, X11)', state: 'works', note: 'Kendi pencereleri, kendi başlık çubuğu.' },
				{ item: 'Şablonlar', state: 'works', note: 'React, Vue, Svelte, Solid, vanilla; npm, pnpm, Yarn, Bun.' },
				{ item: 'Paketler', state: 'works', note: '.tar.gz, .deb ve Arch; tekrarlanabilir, --verify ile.' },
				{ item: 'Eklentiler', state: 'works', note: 'fs, dialog, clipboard, os.' },
				{ item: 'Yerel çizim yolu', state: 'works', note: 'Web motoru olmadan, çekirdek GLES ile çizer.' },
				{ item: 'Kayıt ve tekrar', state: 'next', note: 'lepton record / replay, 0.1.5’te.' },
				{ item: 'macOS, Windows', state: 'planned', note: 'WKWebView ve WebView2.' },
				{ item: 'Web teknolojisiyle yerel arayüz', state: 'planned', note: 'React, HTML/CSS ve JS’yi Lepton kendisi çizer, 0.2.0.' },
				{ item: 'Doğrudan GPU çizimi', state: 'planned', note: '0.2.0.' },
			],
			labels: { works: 'çalışıyor', experimental: 'deneysel', next: 'sonraki sürüm', planned: 'planlanıyor' },
			memory: 'Web motorları bellek kullanır; WebView’in RAM tüketimi yüksek olabilir. Bunu biliyoruz ve saklamıyoruz.',
		},
		close: {
			claim: 'Kendi makinenizde deneyin.',
			body: 'WPE WebKit 2.54+ olan bir Linux, Node 20+ ve Zig 0.16. Eksik bir şey varsa lepton info söyler.',
			docs: 'Başlarken',
			github: 'GitHub’da yıldızla ya da izle',
		},
		footer: { line: 'Lepton bir Lepton Desk projesidir.', license: 'MIT ya da Apache-2.0' },
	},
};
