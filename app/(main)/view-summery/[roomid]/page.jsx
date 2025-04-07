"use client";
import { api } from "@/convex/_generated/api";
import { CoachingOptions } from "@/services/Options";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import SummaryBox from "../_components/SummaryBox";
import moment from "moment";
import ChatBox from "../../discussion-room/[roomid]/_components/ChatBox";

export default function ViewSummary() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });

  const GetAbstractImages = (option) => {
    const coachingOption = CoachingOptions.find((item) => item.name === option);
    return coachingOption?.abstract ?? "/ab1.png";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {DiscussionRoomData?.coachingOptions && (
              <Image
                src={GetAbstractImages(DiscussionRoomData.coachingOptions)}
                alt="abstract"
                width={100}
                height={100}
                className="rounded-full h-[70px] w-[70px]"
              />
            )}
            <div>
              <h2 className="font-bold text-lg">{DiscussionRoomData?.topic}</h2>
              <p className="text-gray-400">{DiscussionRoomData?.coachingOptions}</p>
            </div>
          </div>
          <p className="text-gray-400">
            {moment(DiscussionRoomData?._creationTime).fromNow()}
          </p>
        </div>
        <div className="flex flex-col">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Summary Column */}
            <div className="col-span-3">
                <h2 className="text-lg font-bold mb-4">Summary of your Conversation</h2>
                <SummaryBox summery={DiscussionRoomData?.summery} />
            </div>

            {/* Conversation Column */}
            <div className="col-span-2">
                <h2 className="text-lg font-bold mb-4">Your Conversation</h2>
                {DiscussionRoomData?.conversation && (
                <ChatBox
                    conversation={DiscussionRoomData?.conversation}
                    coachingOptions={DiscussionRoomData?.coachingOptions}
                    enableFeedBackNotes={false}
                />
                )}
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}
