import blessed from "blessed";
import { getFileTree } from "./fileTree";

let fileTreeBoxR: blessed.Widgets.BoxElement;

export function fileTreeBox(screen: blessed.Widgets.Screen) {
	fileTreeBoxR = blessed.box({
		parent: screen,
		height: "100%",
		width: "20%",
		align: "left",
		border: { type: "line" },
		style: {
			border: {
				fg: "green",
			},
		},
	});
	updateFileTreeBox();
	return fileTreeBoxR;
}

function updateFileTreeBox() {
	const fileTree = getFileTree(process.cwd());

	const fileTreeSorted = sortFileTree(fileTree);
	for (let fileName in fileTreeSorted) {
		const fileNode = fileTreeSorted[fileName];
		addFileNode(0, fileName, fileNode);
	}
}

function addFileNode(depth = 0, name: string, node: any) {
	if (typeof node == "object") {
		fileTreeBoxR.pushLine(" ".repeat(depth) + name);
		for (let fileName in node) {
			addFileNode(depth + 1, fileName, node[fileName]);
		}
	}
	if (typeof node == "string") {
		fileTreeBoxR.pushLine(" ".repeat(depth) + name);
	}
}

function sortFileTree(obj: Record<string, any>): Record<string, any> {
	return Object.fromEntries(
		Object.entries(obj)
			// sort entries: dirs first, then files, both alphabetically
			.sort(([keyA, valA], [keyB, valB]) => {
				const isDirA = typeof valA === "object";
				const isDirB = typeof valB === "object";

				if (isDirA && !isDirB) return -1;
				if (!isDirA && isDirB) return 1;

				return keyA.localeCompare(keyB);
			})
			// recurse into subdirs
			.map(([key, val]) => [
				key,
				typeof val === "object" ? sortFileTree(val) : val,
			]),
	);
}
