import { NextRequest, NextResponse } from "next/server";
import defaults from "@/lib/constants";
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

async function ensureDataFile() {
    try {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.stat(DATA_FILE);
    } catch (e) {
        await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf8');
    }
}

async function readStoredEvents() {
    await ensureDataFile();
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    try {
        return JSON.parse(raw) as any[];
    } catch (e) {
        return [];
    }
}

async function writeStoredEvent(ev: any) {
    const arr = await readStoredEvents();
    arr.unshift(ev);
    await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

export async function POST(req: NextRequest) {
    const contentType = req.headers.get('content-type') || '';
    try {
        if (contentType.startsWith('multipart/form-data') || contentType.startsWith('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            let event: any = {};
            try {
                for (const [k, v] of formData.entries()) {
                    if (k === 'tags' || k === 'agenda') {
                        try {
                            event[k] = JSON.parse(v as string);
                        } catch (_) {
                            event[k] = v;
                        }
                    } else if (k === 'image') {
                        // handle below
                    } else {
                        event[k] = v as string;
                    }
                }
            } catch (e) {
                return NextResponse.json({ message: 'Invalid form data format' }, { status: 400 });
            }

            const file = formData.get('image') as File | null;
            let imageUrl = '';
            if (file) {
                try {
                    // try to save to public/uploads
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
                    await fs.mkdir(uploadsDir, { recursive: true });
                    const ext = file.type.split('/').pop() || 'png';
                    const filename = `${Date.now()}.${ext}`;
                    const filepath = path.join(uploadsDir, filename);
                    await fs.writeFile(filepath, buffer);
                    imageUrl = `/uploads/${filename}`;
                } catch (e) {
                    imageUrl = '';
                }
            }

            if (imageUrl) event.image = imageUrl;

            // Try to save to DB if available
            try {
                if (process.env.MONGODB_URI) {
                    const dynamicImport = (p: string) => new Function('p', 'return import(p)')(p);
                    const m1 = await dynamicImport('@/lib/mongoose').catch(() => null);
                    const m2 = await dynamicImport('@/database/event.model').catch(() => null);
                    const connectDB = m1?.default;
                    const EventModel = m2?.default;
                    if (connectDB) await connectDB();
                    if (EventModel) {
                        const created = await EventModel.create({ ...event });
                        return NextResponse.json({ message: 'Event created successfully', event: created }, { status: 201 });
                    }
                }
            } catch (e) {
                // fall through to file storage
                console.error('DB write failed, falling back to file storage', e);
            }

            // store to local file as fallback
            const makeSlug = (text: string) =>
                text
                    .toString()
                    .toLowerCase()
                    .trim()
                    .replace(/&/g, ' and ')
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');

            const generatedSlug = event.slug ? String(event.slug) : event.title ? makeSlug(String(event.title)) : `local-${Date.now()}`;
            const stored = { ...event, _id: `local-${Date.now()}`, slug: generatedSlug, createdAt: new Date().toISOString() };
            await writeStoredEvent(stored);
            return NextResponse.json({ message: 'Event created (local fallback)', event: stored }, { status: 201 });
        }

        return NextResponse.json({ message: 'Event Creation Failed', error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e?.message || 'Unknown' }, { status: 500 });
    }
}

export async function GET(_req: NextRequest) {
    try {
        // prefer DB if available
        if (process.env.MONGODB_URI) {
            try {
                const dynamicImport = (p: string) => new Function('p', 'return import(p)')(p);
                const m1 = await dynamicImport('@/lib/mongoose').catch(() => null);
                const m2 = await dynamicImport('@/database/event.model').catch(() => null);
                const connectDB = m1?.default;
                const EventModel = m2?.default;
                if (connectDB) await connectDB();
                if (EventModel) {
                    const events = await EventModel.find().sort({ createdAt: -1 });
                    return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
                }
            } catch (e) {
                console.error('DB read failed, falling back to bundled + local', e);
            }
        }

        const bundled = defaults as any[];
        const stored = await readStoredEvents();
        const merged = [...stored, ...bundled];
        return NextResponse.json({ message: 'Events fetched (fallback)', events: merged }, { status: 200 });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ message: 'Event Fetch Failed', error: e?.message || 'Unknown' }, { status: 500 });
    }
}