"use client";

import { api } from "@/convex/_generated/api";
import { CoachingExpert, coachingOptions } from "@/services/Options"; // Ensure coachingOptions is imported if needed.
import { UserButton } from "@stackframe/stack";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { AIModel } from "@/services/GlobalServices";

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
  const [expert, setExpert] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [enableMic, setEnableMic] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set expert data when DiscussionRoomData is available
  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      console.log("Expert:", Expert);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  // Check if browser supports SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Your browser does not support the Speech Recognition API");
    }
  }, []);

  // Async helper to call the AI model with a final transcript chunk
  const callAI = async (message) => {
    try {
      // Call your AIModel function passing the topic, coachingOptions (or coachingOption name), and the user's message
      const aiResponse = await AIModel(
        DiscussionRoomData.topic,
        DiscussionRoomData.coachingOptions, // or pass a specific coaching option name
        message
      );
      console.log("AI Response:", aiResponse);
      // Optionally update conversation state with the AI response:
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error calling AI model:", error);
    }
  };

  const connectToServer = async () => {
    setLoading(true);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in your browser.");
      setLoading(false);
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
          // Add final chunk to conversation as user message
          setConversation((prev) => [
            ...prev,
            { role: "user", content: transcriptChunk },
          ]);
          // Call the AI model for this final transcript chunk
          callAI(transcriptChunk);
        } else {
          interimTranscript += transcriptChunk;
        }
      }
      // Update the displayed transcript
      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionInstance.onerror = (event) => {
      if (event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognitionInstance.onend = () => {
      console.log("Speech recognition ended");
      setEnableMic(false);
      setLoading(false);
    };

    recognitionInstance.start();
    // Once recognition starts, set loading to false so that the spinner stops
    setLoading(false);
    setRecognition(recognitionInstance);
    setEnableMic(true);
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
      setEnableMic(false);
      setLoading(false);
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
              <Button onClick={connectToServer} disabled={loading}>
                {loading && <Loader2Icon className="animate-spin" />} Connect
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={stopRecognition}
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" />} Disconnect
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
            {/* Optionally render conversation messages */}
            <div className="mt-4 w-full overflow-auto max-h-[40vh]">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`p-2 ${msg.role === "assistant" ? "bg-blue-100" : "bg-green-100"}`}>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
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
