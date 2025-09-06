import { parseArgs } from "./cli/args";
import { createScreen } from "./ui/screen";
import { Editor } from "./ui/editor";
import { Buffer } from "./core/buffer";

const args = parseArgs(process.argv);

console.log(args);
const screen = createScreen();
if (typeof args.file == "string") {
	const buffer = new Buffer(args.file, { readonly: args.readonly });
	const editor = new Editor(screen, { buffer, startLine: args.startLine });
	editor.focus();
}
