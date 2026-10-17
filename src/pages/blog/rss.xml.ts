import type { APIContext } from 'astro';
import { feed } from '../../components/blog/rss';

export const GET = (context: APIContext) => feed('en', context);
