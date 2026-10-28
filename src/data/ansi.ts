// The colour codes the CLI writes (SGR: bold, 24-bit, 256-colour and basic foregrounds,
// resets), turned into runs of text the landing renders as spans. Anything else in an
// escape sequence is dropped, so a code this does not know leaves plain text, never junk.

export interface Run {
	text: string;
	color?: string;
	bold: boolean;
}

const basic = [
	'#000000',
	'#cd3131',
	'#0dbc79',
	'#e5e510',
	'#2472c8',
	'#bc3fbc',
	'#11a8cd',
	'#e5e5e5',
];
const bright = [
	'#666666',
	'#f14c4c',
	'#23d18b',
	'#f5f543',
	'#3b8eea',
	'#d670d6',
	'#29b8db',
	'#ffffff',
];

/** The xterm 256-colour palette entry `n` as a CSS colour. */
function extended(n: number): string | undefined {
	if (n < 8) return basic[n];
	if (n < 16) return bright[n - 8];
	if (n < 232) {
		const i = n - 16;
		const level = (v: number) => (v === 0 ? 0 : 55 + v * 40);
		return `rgb(${level(Math.floor(i / 36))} ${level(Math.floor(i / 6) % 6)} ${level(i % 6)})`;
	}
	if (n < 256) {
		const grey = 8 + (n - 232) * 10;
		return `rgb(${grey} ${grey} ${grey})`;
	}
	return undefined;
}

export function runs(input: string): Run[] {
	const out: Run[] = [];
	let color: string | undefined;
	let bold = false;
	const push = (text: string) => {
		if (!text) return;
		const last = out[out.length - 1];
		if (last && last.color === color && last.bold === bold) last.text += text;
		else out.push({ text, color, bold });
	};
	// biome-ignore lint/suspicious/noControlCharactersInRegex: ESC is the escape sequence being parsed.
	const pattern = /\x1b\[([0-9;]*)([A-Za-z])/g;
	let at = 0;
	for (const match of input.matchAll(pattern)) {
		push(input.slice(at, match.index));
		at = (match.index ?? 0) + match[0].length;
		if (match[2] !== 'm') continue;
		const codes = (match[1] || '0').split(';').map(Number);
		for (let i = 0; i < codes.length; i++) {
			const code = codes[i];
			if (code === 0) {
				color = undefined;
				bold = false;
			} else if (code === 1) bold = true;
			else if (code === 22) bold = false;
			else if (code === 39) color = undefined;
			else if (code >= 30 && code <= 37) color = basic[code - 30];
			else if (code >= 90 && code <= 97) color = bright[code - 90];
			else if (code === 38 && codes[i + 1] === 2) {
				color = `rgb(${codes[i + 2]} ${codes[i + 3]} ${codes[i + 4]})`;
				i += 4;
			} else if (code === 38 && codes[i + 1] === 5) {
				color = extended(codes[i + 2]);
				i += 2;
			}
		}
	}
	push(input.slice(at));
	return out;
}
