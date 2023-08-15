// 1. Import utilities from `astro:content`
import { defineCollection, reference } from "astro:content";
import { z } from "zod";
import { ReviewCategories } from "~/lib/ReviewCategories";
// 2. Define your collection(s)

export const collections = {
	spotlight: defineCollection({
		type: "content",
		schema: z.object({
			title: z.string(),
			cover: z.string(),
			date: z.date(),
			tags: z.array(z.string()),
			category: z.enum(Object.keys(ReviewCategories) as unknown as [string, ...string[]]),
			author: reference("authors"),
		}),
	}),
	brands: defineCollection({
		type: "content",
		schema: z.object({
			name: z.string(),
			logo: z.string(),
			link: z.string(),
			author: z.string(),
			category: z.enum(Object.keys(ReviewCategories) as unknown as [string, ...string[]]),
			"logo-small": z.string(),
		}),
	}),
	reviews: defineCollection({
		type: "content",
		schema: z.object({
			title: z.string(),
			cover: z.string(),
			link: z.string(),
			author: reference("authors"),
			date: z.date(),
			logo: z.string(),
			recommendation: z.boolean(),
			category: z.enum(Object.keys(ReviewCategories) as unknown as [string, ...string[]]),
		}),
	}),
	authors: defineCollection({
		type: "content",
		schema: z.object({
			name: z.string(),
			image: z.string(),
			twitter: z.string(),
			instagram: z.string(),
			website: z.string(),
			bio: z.string(),
			date_joined: z.date(),
		})
	}),
	blog: defineCollection({
		type: "content",
		schema: z.object({
			title: z.string(),
			cover: z.string(),
			author: reference("authors"),
			date: z.date(),
			category: z.enum(Object.keys(ReviewCategories) as unknown as [string, ...string[]]),
		}),
	})
};
