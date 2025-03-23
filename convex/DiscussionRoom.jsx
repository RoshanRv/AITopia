import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewRoom = mutation({
    args:{
        coachingOptions:v.string(),
        topic:v.string(),
        expertName:v.string(),
    },
    handler:async(ctx,args)=>{
        const result = await ctx.db.insert('DiscussionRoom',{
            coachingOptions:args.coachingOptions,
            topic:args.topic,
            expertName:args.expertName
        });
        return result;
    }
})