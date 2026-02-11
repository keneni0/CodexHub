'use server';

import defaults from '@/lib/constants';

export const getSimilarEventBySlug = async (slug: string) => {
    const events = (defaults as any[]) || [];
    const target = events.find((e) => e.slug === slug) || null;
    if (!target) return [];
    const firstTag = (target.tags && target.tags[0]) || null;
    const similar = events.filter(
        (e) => e.slug !== slug && (firstTag ? (e.tags || []).includes(firstTag) : true)
    );
    return similar.slice(0, 4);
};
