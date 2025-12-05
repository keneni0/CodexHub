import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Event, { IEvent } from "@/database/event.model";

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
  ctx: { params: { slug: string } }
) {
  const params = await ctx.params;
  console.log('DEBUG [api/events/[slug]/route.ts] awaited params:', params);
  try {
    // Ensure DB is connected
    await connectDB();

    const { slug } = params;
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({
        message: 'Validation Error: Missing or invalid slug.'
      }, { status: 400 });
    }

    const event: IEvent | null = await Event.findOne({ slug });

    if (!event) {
      return NextResponse.json({
        message: `Event with slug '${slug}' not found.`
      }, { status: 404 });
    }

    // Remove sensitive or mongoose-specific fields as needed
    const eventObj = event.toObject ? event.toObject() : event;

    return NextResponse.json({ event: eventObj }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: 'An unexpected error occurred.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
