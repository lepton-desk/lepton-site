import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { authorIds } from './data/authors';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
	// One file per language, `en/<slug>.md` and `tr/<slug>.md`; the same slug is the same post.
	blog: defineCollection({
		loader: glob({ base: './src/content/blog', pattern: '{en,tr}/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			date: z.coerce.date(),
			/** Who wrote it, by id in `src/data/authors.ts`; shown under the title and in the feed. */
			authors: z.array(z.enum(authorIds)).min(1),
			/** A grease-pencil note beside the title: what the post was measured on, and such. */
			note: z.string().optional(),
		}),
	}),
};
