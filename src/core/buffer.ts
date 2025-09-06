import fs from "fs";

export interface BufferOptions {
	readonly?: boolean;
}

export class Buffer {
	private filename: string | null;
	private lines: string[];
	private readonly: boolean;

	constructor(filename?: string | null, options: BufferOptions = {}) {
		this.filename = filename ?? null;
		this.readonly = options.readonly ?? false;
		this.lines = [];

		if (this.filename) {
			this.load(this.filename);
		}
	}

	private load(filename: string) {
		try {
			const text = fs.readFileSync(filename, "utf-8");
			this.lines = text.split(/\r?\n/);
		} catch (err: any) {
			if (err.code === "ENOENT") {
				this.lines = [""];
			} else {
				throw err;
			}
		}
	}

	public getText(): string {
		return this.lines.join("\n");
	}

	public setText(text: string) {
		if (this.readonly) return;
		this.lines = text.split(/\r?\n/);
	}

	public getLine(n: number): string | null {
		if (n < 1 || n > this.lines.length) return null;
		return this.lines[n - 1] || null;
	}

	public setLine(n: number, value: string) {
		if (this.readonly) return;
		if (n >= 1 && n <= this.lines.length) {
			this.lines[n - 1] = value;
		}
	}

	public appendLine(value: string) {
		if (this.readonly) return;
		this.lines.push(value);
	}

	public save(filename?: string) {
		if (this.readonly) return;
		const target = filename ?? this.filename;
		if (!target) {
			throw new Error("No filename specified for save");
		}
		fs.writeFileSync(target, this.getText(), "utf-8");
	}

	public info() {
		return {
			filename: this.filename,
			lines: this.lines.length,
			readonly: this.readonly,
		};
	}
}
