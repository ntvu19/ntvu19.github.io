import { defineCollection, z } from 'astro:content';

const company = defineCollection({
  type: 'data',
  schema: z.object({
    company: z.string(),
    order: z.number(),
    logoLight: z.string().optional(),
    logoDark: z.string().optional(),
    meta: z.string(),
    website: z.string().url().optional(),
    roles: z.array(
      z.object({
        title: z.string(),
        dates: z.string(),
        duration: z.string(),
        current: z.boolean().default(false),
        promotion: z.boolean().default(false),
        summary: z.string(),
        keywords: z.array(z.string()),
        stack: z.array(z.string()),
      }),
    ),
  }),
});

const project = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['shipped', 'in progress']),
    year: z.string(),
    role: z.string(),
    thumb: z.string().nullable().optional(),
    skills: z.array(z.string()),
    problem: z.string(),
    solved: z.array(z.string()),
    links: z.object({
      details: z.string().optional(),
      demo: z.string().optional(),
      source: z.string().optional(),
    }),
  }),
});

const skill = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        category: z.enum([
          'Languages',
          'Systems & Performance',
          'Backend & Architecture',
          'Platform & Tooling',
        ]),
        level: z.number().int().min(1).max(5),
        years: z.number(),
      }),
    ),
  }),
});

const oss = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(
      z.object({
        org: z.string(),
        repo: z.string(),
        desc: z.string(),
        stars: z.number(),
        lang: z.string(),
        url: z.string().url(),
      }),
    ),
  }),
});

export const collections = { company, project, skill, oss };
