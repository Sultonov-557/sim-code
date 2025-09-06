import blessed, { Widgets } from "blessed";
import { Buffer } from "../core/buffer.js";

export interface EditorOptions {
	buffer: Buffer;
	startLine?: number | null;
}

export class Editor {
	private screen: Widgets.Screen;
	private box: Widgets.BoxElement;
	private buffer: Buffer;

	private cursorX = 0;
	private cursorY = 0;

	constructor(screen: Widgets.Screen, options: EditorOptions) {
		this.screen = screen;
		this.buffer = options.buffer;

		this.box = blessed.box({
			parent: screen,
			top: 0,
			left: 0,
			width: "100%",
			height: "100%-1",
			tags: false,
			keys: true,
			mouse: true,
			scrollable: true,
			alwaysScroll: true,
			style: {
				fg: "white",
				bg: "black",
			},
		});

		if (options.startLine) {
			this.cursorY = options.startLine - 1;
		}

		this.render();
		this.registerKeys();
	}

	private render() {
		const lines = this.buffer.getText().split("\n");
		this.box.setContent(lines.join("\n"));

		const clampedY = Math.max(0, Math.min(this.cursorY, lines.length - 1));
		const clampedX = Math.max(
			0,
			Math.min(this.cursorX, lines[clampedY]?.length ?? 0),
		);

		this.cursorY = clampedY;
		this.cursorX = clampedX;

		this.screen.program.move(this.cursorX, this.cursorY);
		this.screen.program.showCursor();

		this.screen.render();
	}

	private registerKeys() {
		this.screen.key("h", () => {
			this.cursorX = Math.max(0, this.cursorX - 1);
			this.render();
		});

		this.screen.key("l", () => {
			this.cursorX += 1;
			this.render();
		});

		this.screen.key("k", () => {
			this.cursorY = Math.max(0, this.cursorY - 1);
			this.render();
		});

		this.screen.key("j", () => {
			this.cursorY += 1;
			this.render();
		});

		this.screen.key("C-s", () => {
			this.buffer.save();
		});

		this.screen.key("C-x", () => {
			process.exit(0);
		});
	}

	public focus() {
		this.box.focus();
	}
}
