import fs from "fs";
import { join } from "path";

const ignoreList = ["node_modules"];
const workDir = process.cwd();

function readFileTree(path: string) {
	const tree: Record<string, number | object> = {};
	const directs = fs.readdirSync(path);
	for (let direct of directs) {
		if (ignoreList.includes(direct)) continue;
		const directPath = join(path, direct);
		const pathStat = fs.statSync(directPath);
		if (pathStat.isDirectory()) {
			tree[direct] = readFileTree(directPath);
		}

		if (pathStat.isFile()) {
			tree[direct] = pathStat.size;
		}
	}

	return tree;
}

export function getFileTree(path: string) {
	return readFileTree(workDir);
}
