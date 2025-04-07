'use client'
import { api } from "@/convex/_generated/api";
import { CoachingOptions } from "@/services/Options";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from 'next/navigation';
import React from 'react'
import SummaryBox from "../_components/SummaryBox";

function viewSummary() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    console.log("Discussion Room Data in summery : ", DiscussionRoomData);

    const GetAbstractImages = (option)=>{
    const coachingOption = CoachingOptions.find((item) => item.name == option);
    return coachingOption?.abstract??"/ab1.png";

}

  return (
    <div className="-mt-10">
        <div className="flex justify-between items-center">
            <div className="flex gap-7 item-center">
                <Image src={GetAbstractImages(DiscussionRoomData.coachingOptions)} alt='abstract'
                width={100}
                height={100}
                className='rounded-full h-[70px] w-[70px] '
                />
                <div>
                    <h2 className='font-bold text-lg'>{DiscussionRoomData?.topic}</h2>
                    <h2 className='text-gray-400'>{DiscussionRoomData?.coachingOptions}</h2>   
                </div>
                <h2 className='text-gray-400 '>{moment( DiscussionRoomData?._creationTime).fromNow()}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5">
                <div className="col-span-3">
                    <h2 className="text-lg font-bold mb-6">Summery of your Conversation</h2>
                    <SummaryBox summery = {DiscussionRoomData.summery}/>
                </div>
                <div className="col-span-2">
                    <h2 className="text-lg font-bold mb-6">Your Conversation</h2>
                    {DiscussionRoomData?.conversation && <ChatBox conversation={DiscussionRoomData.conversation}
                    coachingOptions={DiscussionRoomData.coachingOptions}
                    enableFeedBackNotes={false}
                    />}

                </div>
            </div>        
      </div>
    </div>
  )
}

export default viewSummary
