import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	stories: ["../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

	framework: {
		name: "@storybook/nextjs-vite",
		options: {},
	},

	addons: ["@storybook/addon-vitest"],
};
export default config;
