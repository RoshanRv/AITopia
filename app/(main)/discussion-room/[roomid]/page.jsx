"use client";

import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  const [expert, setExpert] = useState();
  const [transcript, setTranscript] = useState("");
  const [enableMic, setEnableMic] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      console.log("Expert:", Expert);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Your browser does not support the Speech Recognition API");
    }
  }, []);

  // Renamed connectToServer instead of startRecognition.
  const connectToServer = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in your browser.");
      return;
    }
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk + " ";
        } else {
          interimTranscript += transcriptChunk;
        }
      }
      // Combine final transcript with interim results for live updating
      setTranscript(finalTranscript + interimTranscript);
    };

    if (transcript.message_type == "finalTranscript" ){
      setConversation(prev=>[...prev,{
        role:'user',
        content:transcript.text
      }])
    }

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionInstance.onend = () => {
      console.log("Speech recognition ended");
      setEnableMic(false);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
    setEnableMic(true);
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
      setEnableMic(false);
    }
  };

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOptions}
      </h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div
            className="h-[60vh] bg-secondary border rounded-4xl
            flex flex-col items-center justify-center relative"
          >
            {expert?.avatar ? (
              <Image
                src={expert.avatar}
                alt="avatar"
                width={200}
                height={200}
                className="h-[80px] w-[80px] object-cover rounded-full animate-pulse"
              />
            ) : (
              <p>Loading expert...</p>
            )}
            <h2 className="text-gray-500">{expert?.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={stopRecognition}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <div
            className="h-[60vh] bg-secondary border rounded-4xl
            flex flex-col items-center justify-center relative"
          >
            <h2>Chat section</h2>
          </div>
          <h2 className="mt-4 text-gray-400 text-sm">
            At the end of your conversation we will automatically generate
            feedback/notes from your conversation.
          </h2>
        </div>
      </div>
      {/* Live transcript displayed in an h2 tag */}
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold">{transcript}</h2>
      </div>
    </div>
  );
}

export default DiscussionRoom;
