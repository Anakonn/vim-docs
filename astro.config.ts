import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { makeLocalesConfig } from "./config/locales";
import { siteConfig } from "./config/site";

// https://astro.build/config
export default defineConfig({
	site: siteConfig.url,
	base: siteConfig.base,
	trailingSlash: "always",
	integrations: [
		starlight({
			title: siteConfig.title,
			defaultLocale: "en",
			locales: makeLocalesConfig(),
			head: [
				// Add ICO favicon fallback for Safari.
				{
					tag: "link",
					attrs: {
						rel: "icon",
						href: "/favicon.ico",
						sizes: "32x32",
					},
				},
				{
					tag: "script",
					attrs: {
						async: true,
						src: siteConfig.googleAdsSrc,
						crossorigin: "anonymous",
					},
				},
			],
			social: {
				github: siteConfig.githubUrl,
			},
			logo: {
				dark: "./src/assets/logo-dark.svg",
				light: "./src/assets/logo.svg",
				alt: "Docsforall Logo",
				// replacesTitle: true,
			},
			customCss: process.env.NO_GRADIENTS ? [] : ["./src/styles/landing.css"],
			components: {
				SiteTitle: "./src/components/starlight/SiteTitle.astro",
				Header: "./src/components/starlight/Header.astro",
				Head: "./src/components/starlight/Head.astro",
			},
			sidebar: [
				{
					label: "Guides",
					autogenerate: { directory: "guides" },
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],
});
