import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string().optional()
  })
});

const figures = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/figures' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    subcategory: z.string().optional(),
    birth: z.object({ year: z.number().nullable(), note: z.string().optional() }).optional(),
    death: z.object({ year: z.number().nullable(), note: z.string().optional() }).optional(),
    lineage: z.string().optional(),
    bio: z.string(),
    achievements: z.array(z.string()).default([]),
    significance: z.string().optional(),
    facts: z.array(z.string()).default([]),
    gallery: z.array(z.object({
      src: z.string(),
      type: z.enum(['portrait', 'historical', 'illustration']),
      caption: z.string().optional(),
      source: z.string().optional(),
      license: z.string()
    })).default([]),
    references: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
      publisher: z.string().optional()
    })).default([]),
    location: z.object({
      name: z.string().optional(),
      lat: z.number().nullable(),
      lng: z.number().nullable()
    }).optional(),
    timeline: z.array(z.object({ year: z.string(), event: z.string() })).default([]),
    verified: z.boolean().default(false),
    disputed: z.boolean().default(false),
    disputeNote: z.string().optional()
  })
});

export const collections = { categories, figures };