import blessed, { Widgets } from "blessed";
import { Buffer } from "../core/buffer.js";

export interface StatusBarOptions {
	buffer: Buffer;
}

export class StatusBar {
	private box: Widgets.BoxElement;
	private buffer: Buffer;
	private screen: Widgets.Screen;

	private mode: string = "NORMAL";
	private cursorX: number = 0;
	private cursorY: number = 0;

	constructor(screen: Widgets.Screen, options: StatusBarOptions) {
		this.screen = screen;
		this.buffer = options.buffer;

		this.box = blessed.box({
			parent: screen,
			bottom: 0,
			left: 0,
			width: "100%",
			height: 1,
			tags: false,
			style: {
				fg: "black",
				bg: "green",
			},
		});

		this.render();
	}

	public setMode(mode: string) {
		this.mode = mode.toUpperCase();
		this.render();
	}

	public setCursor(x: number, y: number) {
		this.cursorX = x;
		this.cursorY = y;
		this.render();
	}

	private render() {
		const info = this.buffer.info();
		const left = `--${this.mode}--`;
		const mid = `${info.filename ?? "[No Name]"}${info.readonly ? " [RO]" : ""}`;
		const right = `${this.cursorY + 1},${this.cursorX + 1}`;

		const width = this.screen.width ?? 80;
		const space = width - (left.length + mid.length + right.length + 2); // spaces in between

		const line = left + " " + mid + " ".repeat(Math.max(1, space)) + right;

		this.box.setContent(line);
		this.screen.render();
	}
}
