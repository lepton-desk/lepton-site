// Every string on the landing page, in both languages. Claims here must match the lepton
// repository: what ships is stated plainly, what is planned says so.

export type Lang = 'en' | 'tr';

export type Status = 'works' | 'experimental' | 'next' | 'planned' | 'unsupported';

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
				platform: 'Linux & Windows',
			},
			scale: 'scale: one window',
		},
		engine: {
			claim: 'No browser in the box.',
			body: 'Lepton doesn’t ship its own Chromium inside your app. It uses the web engine the operating system provides: WPE WebKit on Linux, and WebView2 on Windows in the beta. The rest is on the way, and we say which is which.',
			rows: [
				{ name: 'WPE WebKit', where: 'Linux', note: 'The engine Lepton uses today.', status: 'works' },
				{ name: 'Servo', where: 'Linux', note: 'Optional, for those who’d rather avoid WebKit. Servo doesn’t cover the whole web yet, so it stays experimental. It is not in a release: --servo says so rather than building with WPE WebKit. Built in CI, it already serves a lepton:// page and carries the page’s calls to the core intact.', status: 'experimental' },
				{ name: 'WebView2', where: 'Windows', note: 'In the 0.1.9 beta: apps build, run and package on Windows 10 and 11, without Microsoft’s loader. Chromium-based, but it comes with Windows; your app doesn’t carry it.', status: 'next' },
			],
		},
		event: {
			claim: 'One event, three tracks.',
			body: 'Your page and the Zig core talk in binary frames over the app’s own scheme and shared memory. No JSON is parsed on the way. The core owns the window and asks the desktop for the rest.',
			page: 'Your page',
			pageNote: 'React, Vue, Svelte, Solid, Preact, Lit, Angular, Next.js, Astro or plain TypeScript and JavaScript, in the system web engine',
			frames: 'Binary frames',
			framesNote: 'invoke() posts one request frame; events come back numbered',
			core: 'Zig core',
			coreNote: 'window, commands, permissions, plugins',
			system: 'The desktop',
			systemNote: 'Wayland, X11 or Win32; desktop portals and a systemd scope on Linux',
			engine: 'System web engine',
			engineNote: 'WPE WebKit or WebView2 draws your page; Lepton ships no browser',
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
				{ item: 'Linux (Wayland, X11)', state: 'works', note: 'Own windows, client-side title bar, its own systemd scope; the title follows document.title.' },
				{ item: 'Templates', state: 'works', note: 'React, Vue, Svelte, Solid, vanilla in TypeScript, React and vanilla also in JavaScript; npm, pnpm, Yarn, Bun. New TypeScript projects pass tsc and biome check.' },
				{ item: 'More templates', state: 'next', note: 'Astro, Next.js, Angular, Preact and Lit, and JavaScript for every Vite template: 19 in all, each checked with biome, tsc, a package and a window. Any other framework runs with one frontend setting.' },
				{ item: 'Web engine features', state: 'works', note: 'Inspector (F12) in debug builds, downloads, permission requests, notifications, links in the desktop’s browser.' },
				{ item: 'Packages', state: 'works', note: '.tar.gz, .deb and Arch, reproducible, with --verify.' },
				{ item: 'Plugins', state: 'works', note: 'fs, dialog, clipboard, os.' },
				{ item: 'Record and replay', state: 'works', note: 'lepton record / replay: a session’s calls to the core, run again with or without the window; a recording can be a test.' },
				{ item: 'lepton update', state: 'works', note: 'Brings a project’s packages, core and src-lepton/ files to the new version and keeps your edits.' },
				{ item: 'Native render path', state: 'works', note: 'Drawn by the core on the GPU with GLES 3, no web engine; shared memory without a GPU.' },
				{ item: 'Windows', state: 'next', note: 'WebView2 apps build, run and package as .zip and an MSI made without WiX. The os, fs and dialog plugins were measured there, clipboard not yet; native drawing comes later.' },
				{ item: 'macOS', state: 'unsupported', note: 'Signing and notarizing need a paid Apple account and Mac hardware; a single maintainer cannot keep that up.' },
				{ item: 'Native UI with web tech', state: 'planned', note: 'React, HTML/CSS and JS drawn by Lepton itself, 0.2.0.' },
				{ item: 'Vulkan rendering', state: 'planned', note: '0.2.0. Its floor is measured on a Radeon R7 240: Vulkan 1.3.' },
			],
			labels: { works: 'works', experimental: 'experimental', next: 'in the beta', planned: 'planned', unsupported: 'not supported' },
			memory: 'Web engines use memory, and WebView RAM can be high. We know that, and we won’t pretend otherwise.',
		},
		close: {
			claim: 'Try it on your machine.',
			body: 'Linux with WPE WebKit 2.54+, or Windows 10 or 11 in the beta; Node 20+ and Zig 0.16. lepton info tells you what is missing.',
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
				platform: 'Linux ve Windows',
			},
			scale: 'ölçek: bir pencere',
		},
		engine: {
			claim: 'Kutuda tarayıcı yok.',
			body: 'Lepton, uygulamanızın içine kendi Chromium’unu koymaz; işletim sisteminin sağladığı web motorunu kullanır: Linux’ta WPE WebKit, betada Windows’ta WebView2. Gerisi yolda ve hangisinin hangisi olduğunu açıkça yazıyoruz.',
			rows: [
				{ name: 'WPE WebKit', where: 'Linux', note: 'Lepton’un bugün kullandığı motor.', status: 'works' },
				{ name: 'Servo', where: 'Linux', note: 'WebKit istemeyenler için isteğe bağlı. Servo henüz webin tamamını karşılamıyor, bu yüzden deneysel. Henüz bir sürümde yok: --servo, WPE WebKit ile derlemek yerine bunu söylüyor. CI’da derlenen Servo, lepton:// üzerinden bir sayfa sunuyor ve sayfanın çekirdeğe çağrılarını bozulmadan taşıyor.', status: 'experimental' },
				{ name: 'WebView2', where: 'Windows', note: '0.1.9 betasında: uygulamalar Windows 10 ve 11’de, Microsoft’un yükleyicisi olmadan derleniyor, çalışıyor ve paketleniyor. Chromium tabanlı ama Windows’la gelir; uygulamanız onu taşımaz.', status: 'next' },
			],
		},
		event: {
			claim: 'Bir olay, üç iz.',
			body: 'Sayfanız ve Zig çekirdeği, uygulamanın kendi şeması ve paylaşılan bellek üzerinden ikili çerçevelerle konuşur. Yolda hiç JSON ayrıştırılmaz. Pencere çekirdeğindir; gerisini masaüstünden ister.',
			page: 'Sayfanız',
			pageNote: 'React, Vue, Svelte, Solid, Preact, Lit, Angular, Next.js, Astro ya da düz TypeScript ve JavaScript, sistemin web motorunda',
			frames: 'İkili çerçeveler',
			framesNote: 'invoke() tek bir istek çerçevesi gönderir; olaylar numaralı döner',
			core: 'Zig çekirdek',
			coreNote: 'pencere, komutlar, izinler, eklentiler',
			system: 'Masaüstü',
			systemNote: 'Wayland, X11 ya da Win32; Linux’ta masaüstü portalları ve systemd kapsamı',
			engine: 'Sistemin web motoru',
			engineNote: 'Sayfanızı WPE WebKit ya da WebView2 çizer; Lepton tarayıcı taşımaz',
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
				{ item: 'Linux (Wayland, X11)', state: 'works', note: 'Kendi pencereleri, kendi başlık çubuğu, kendi systemd kapsamı; başlık document.title’ı izler.' },
				{ item: 'Şablonlar', state: 'works', note: 'TypeScript’le React, Vue, Svelte, Solid, vanilla; React ve vanilla JavaScript’le de; npm, pnpm, Yarn, Bun. Yeni TypeScript projeleri tsc ve biome check’ten geçer.' },
				{ item: 'Daha çok şablon', state: 'next', note: 'Astro, Next.js, Angular, Preact ve Lit, ve her Vite şablonunun JavaScript sürümü: toplam 19, her biri biome, tsc, paket ve pencereyle denetlendi. Başka bir çatı tek bir frontend ayarıyla çalışır.' },
				{ item: 'Web motoru özellikleri', state: 'works', note: 'Hata ayıklama derlemelerinde denetçi (F12), indirmeler, izin istekleri, bildirimler, bağlantılar masaüstünün tarayıcısında.' },
				{ item: 'Paketler', state: 'works', note: '.tar.gz, .deb ve Arch; tekrarlanabilir, --verify ile.' },
				{ item: 'Eklentiler', state: 'works', note: 'fs, dialog, clipboard, os.' },
				{ item: 'Kayıt ve tekrar', state: 'works', note: 'lepton record / replay: bir oturumun çekirdeğe yaptığı çağrılar, pencereyle ya da penceresiz yeniden oynatılır; bir kayıt test olabilir.' },
				{ item: 'lepton update', state: 'works', note: 'Projenin paketlerini, çekirdeğini ve src-lepton/ dosyalarını yeni sürüme getirir, düzenlemelerinizi korur.' },
				{ item: 'Yerel çizim yolu', state: 'works', note: 'Web motoru olmadan, çekirdek GPU’da GLES 3 ile çizer; GPU yoksa paylaşımlı bellekle.' },
				{ item: 'Windows', state: 'next', note: 'WebView2 uygulamaları derleniyor, çalışıyor; .zip ve WiX’siz bir MSI olarak paketleniyor. os, fs ve dialog eklentileri orada ölçüldü, clipboard henüz değil; yerel çizim sonra.' },
				{ item: 'macOS', state: 'unsupported', note: 'İmzalama ve noter onayı ücretli bir Apple hesabı ve Mac donanımı istiyor; tek geliştirici bunu sürdüremez.' },
				{ item: 'Web teknolojisiyle yerel arayüz', state: 'planned', note: 'React, HTML/CSS ve JS’yi Lepton kendisi çizer, 0.2.0.' },
				{ item: 'Vulkan ile çizim', state: 'planned', note: '0.2.0. Tabanı bir Radeon R7 240’ta ölçüldü: Vulkan 1.3.' },
			],
			labels: { works: 'çalışıyor', experimental: 'deneysel', next: 'betada', planned: 'planlanıyor', unsupported: 'desteklenmiyor' },
			memory: 'Web motorları bellek kullanır; WebView’in RAM tüketimi yüksek olabilir. Bunu biliyoruz ve saklamıyoruz.',
		},
		close: {
			claim: 'Kendi makinenizde deneyin.',
			body: 'WPE WebKit 2.54+ olan bir Linux ya da betada Windows 10 veya 11; Node 20+ ve Zig 0.16. Eksik bir şey varsa lepton info söyler.',
			docs: 'Başlarken',
			github: 'GitHub’da yıldızla ya da izle',
		},
		footer: { line: 'Lepton bir Lepton Desk projesidir.', license: 'MIT ya da Apache-2.0' },
	},
};
