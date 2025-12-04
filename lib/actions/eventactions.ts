'use server'; //all the code within this file will be executed on the server without exposing sensitive info

import Even from '@/database/event.model';
import connectDB from '../mongoose';

export const getSimilarEventBySlug = async (slug: string) => {
    try{
        await connectDB();

        const event = await Event.findOne({slug});
        return await Event.find({_id: {$ne: event._id, tags: {$in: event.tags}}});
    }
    catch(error){
        return[];
    }
}