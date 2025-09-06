import blessed, { Widgets } from "blessed";

export function createScreen(): Widgets.Screen {
	const screen = blessed.screen({
		smartCSR: true,
		fullUnicode: true,
		title: "vim-js",
		dockBorders: true,
		autoPadding: true,
	});

	screen.key(["C-c", "C-q"], () => process.exit(0));

	screen.key("q", () => process.exit(0));

	screen.render();

	return screen;
}
