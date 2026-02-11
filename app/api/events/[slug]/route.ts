import { NextRequest, NextResponse } from "next/server";
import defaults from '@/lib/constants';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * GET /api/events/[slug]
 * Fetches event details by slug.
 * 
 * Query params:
 *   - slug (dynamic route param)
 * 
 * Returns:
 *   - 200: Event details as JSON
 *   - 400: Validation error (missing/invalid slug)
 *   - 404: Event not found
 *   - 500: Unexpected server/database error
 */
export async function GET(
  req: NextRequest,
  // `params` can be a Promise in some Next.js versions/types — accept any to match runtime
  ctx: { params: any }
) {
  const params = await ctx.params;
  try {
    const { slug } = params;
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({ message: 'Validation Error: Missing or invalid slug.' }, { status: 400 });
    }

    // Try DB if available
    if (process.env.MONGODB_URI) {
      try {
        const dynamicImport = (p: string) => new Function('p', 'return import(p)')(p);
        const m1 = await dynamicImport('@/lib/mongoose').catch(() => null);
        const m2 = await dynamicImport('@/database/event.model').catch(() => null);
        const connectDB = m1?.default;
        const Event = m2?.default;
        if (connectDB) await connectDB();
        if (Event) {
          const ev = await Event.findOne({ slug }).lean();
          if (ev) return NextResponse.json({ event: ev }, { status: 200 });
          const byId = await Event.findById(slug).lean();
          if (byId) return NextResponse.json({ event: byId }, { status: 200 });
        }
      } catch (e) {
        console.error('DB lookup failed for slug', slug, e);
      }
    }

    // Fallback to stored local file and bundled constants
    const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');
    let stored: any[] = [];
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf8');
      stored = JSON.parse(raw);
    } catch (e) {
      stored = [];
    }

    const normalize = (text: string) =>
      text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    const foundLocal = stored.find((e) => String(e.slug) === slug || String(e._id) === slug || normalize(e.title || '') === slug);
    if (foundLocal) return NextResponse.json({ event: foundLocal }, { status: 200 });

    const bundled = defaults as any[];
    const foundBundled = bundled.find((e) => String(e.slug) === slug || normalize(e.title || '') === slug);
    if (foundBundled) return NextResponse.json({ event: foundBundled }, { status: 200 });

    return NextResponse.json({ message: `Event with slug '${slug}' not found.` }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: 'An unexpected error occurred.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
