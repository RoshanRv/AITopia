"use client";

import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function DiscussionRoom() {
    const {roomid} = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom,{id:roomid})
    const [expert,setExpert]= useState();

    useEffect(()=>{
      if(DiscussionRoomData){
        const Expert = CoachingExpert.find(item => item.name == DiscussionRoomData.expertName);
        console.log(Expert);
        setExpert(Expert);
      }
    },[DiscussionRoomData])

  return (
    <div>
      <h2 className='text-lg font-bold '>{DiscussionRoomData?.coachingOptions}</h2>
      <div className='mt-5 grid grid-cols-1 lg:grid-cols-4 gap-10'>
        <div className='lg:col-span-3 h-[60vh] bg-secondary border rounded-4xl
        flex flex-col items-center justify-center'>
          <Image src={expert?.avatar} alt = 'avatar' width={200} height={200} className='h-[80px] w-[80px] object-cover rounded-full' />
        </div>
        <div>

        </div>
      </div>
    </div>
  )
}

export default DiscussionRoom
