import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export function parseArgs(argv = process.argv) {
	const parser = yargs(hideBin(argv))
		.usage("Usage: $0 [file] [+N] [options]")
		.option("file", {
			alias: "f",
			type: "string",
			describe: "File to open",
		})
		.option("readonly", {
			alias: ["r", "R"],
			type: "boolean",
			default: false,
			describe: "Open file in read-only mode",
		})
		.help(false)
		.version(false)
		.strict(false);

	const raw = parser.parseSync();

	const args = {
		file:
			raw.file ||
			raw._.find((x) => typeof x === "string" && !x.startsWith("+")),
		startLine: 0,
		readonly: raw.readonly,
		extra: [] as string[],
	};

	for (const token of raw._) {
		if (typeof token === "string" && /^\+\d+$/.test(token)) {
			args.startLine = parseInt(token.slice(1), 10);
		} else if (token !== args.file) {
			args.extra.push(token as string);
		}
	}

	return args;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	console.log(parseArgs(process.argv));
}
