import connectDB from "@/lib/mongoose";
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

export async function POST(req: NextRequest){
    try{
        await connectDB();

        const contentType = req.headers.get("content-type") || "";
        if (
            contentType.startsWith("multipart/form-data") ||
            contentType.startsWith("application/x-www-form-urlencoded")
        ) {
            const formData = await req.formData();
            let event;
            try {
                event = Object.fromEntries(formData.entries());
            } catch(e) {
                return NextResponse.json({message: 'Invalid form data format'}, {status: 400});
            }
            const file = formData.get('image') as File;

            if(!file) {
                return NextResponse.json({ message: 'Image file is required'}, {status: 400})
            }
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'DevEvent' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });
            event.image = (uploadResult as { secure_url: string }).secure_url;

            const createdEvent = await Event.create(event);
            return NextResponse.json({message:'Event created successfully', event: createdEvent}, {status:201});
        } else {
            return NextResponse.json({
                message: 'Event Creation Failed',
                error: 'Content-Type must be "multipart/form-data" or "application/x-www-form-urlencoded".'
            }, {status: 400});
        }
    }catch(e){
        console.error(e);
        return NextResponse.json({message:'Event Creation Failed', error: e instanceof Error ? e.message: 'Unknown' },{status: 500});
    }
}


/* create a function to get all events */
export async function GET(req: NextRequest){
    try{
        await connectDB();
        const events = await Event.find().sort({createdAt: -1});
        return NextResponse.json({message: 'Events fetched successfully', events}, {status: 200});
    }catch(e){
        console.error(e);
        return NextResponse.json({message:'Event Fetch Failed', error: e instanceof Error ? e.message: 'Unknown' },{status: 500});
    }
}