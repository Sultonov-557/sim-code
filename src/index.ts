import blessed from "blessed";
import { fileTreeBox } from "./filetree/fileTreeBox";

const screen = blessed.screen({ smartCSR: true });

screen.append(fileTreeBox(screen));

screen.key(["escape", "q", "C-c"], function (ch, key) {
	return process.exit(0);
});

screen.render();
