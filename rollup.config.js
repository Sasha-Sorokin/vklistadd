import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonJS from "@rollup/plugin-commonjs";
import yaml from "@rollup/plugin-yaml";
import replace from "@rollup/plugin-replace";
import license from "rollup-plugin-license";
import pkg from "./package.json";
import path from "path";
import images from "@rollup/plugin-image";

const PATHS = {
	METADATA: path.join(__dirname, "meta", "metadata.txt"),
	INVITATION: path.join(__dirname, "meta", "invitation.txt"),
};

const GITHUB = "https://github.com/Sasha-Sorokin/vklistadd";

const URLS = {
	CHANGELOG: `${GITHUB}/blob/master/CHANGELOG.md`,
	GUIDE: `${GITHUB}/blob/master/docs/{}/GUIDE.md`,
};

export default {
	input: "src/index.tsx",

	output: [
		{
			file: pkg.main,
			format: "iife",
		},
	],

	plugins: [
		typescript({
			tsconfig: "./tsconfig.json",
		}),
		nodeResolve({
			browser: true,
		}),
		commonJS(),
		images(),
		yaml(),
		license({
			banner: {
				commentStyle: "ignored",
				content: {
					file: PATHS.INVITATION,
					encoding: "utf8",
				},
			},
		}),
		license({
			banner: {
				commentStyle: "slash",
				content: {
					file: PATHS.METADATA,
					encoding: "utf8",
				},
			},
		}),
		replace({
			values: {
				__currentVersion__: `${pkg.version}--${Date.now()}`,
				__github__: GITHUB,
				__changeLogLink__: URLS.CHANGELOG,
				__wiki__: URLS.GUIDE,
				__isProduction__: process.env["NODE_ENV"] === "production",
				// Violentmonkey patch
				"cancelAnimationFrame(":
					"unsafeWindow.cancelAnimationFrame.bind(unsafeWindow)(",
			},
			preventAssignment: true,
		}),
	],
};
