import { defineAstroI18nConfig } from "astro-i18n"

export default defineAstroI18nConfig({
	defaultLangCode: "en",
	supportedLangCodes: ["de", "fr", "es"],
	showDefaultLangCode: true,
	translations: {
		en: "translations/en/translations.json",
		de: "translations/de/translations.json"
	},
	routeTranslations: {
		en: "translations/en/routes.json",
		de: "translations/de/routes.json"
	},
})