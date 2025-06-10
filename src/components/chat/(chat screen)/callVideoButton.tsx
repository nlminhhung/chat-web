"use client";
import { Button } from "@/src/components/chat/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { Video } from "lucide-react"
import socket from "@/src/lib/getSocket";
import { CallVideoInterface } from "./callVideoInterface";
import { IncomingCallVideo } from "./incomingCallVideo";

export function CallVideoButton({
  friendName,
  friendId,
  userId,
}: {
  friendName: string;
  friendId: string;
  userId: string;
}) {
  const [showCallInterface, setShowCallInterface] = useState(false);

  // Form a unique room/chat id using sorted user ids.
  const sortedUsers = [userId, friendId].sort();
  const chatId = sortedUsers.join(":");

  // Outgoing call initiation.
  const initiateCall = () => {
    socket.emit("join-room", chatId);
    socket.emit("call-initiate", { recipientId: friendId, recipientName: friendName, chatId });
    toast.success("Calling...");
    setShowCallInterface(true);
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="flex gap-x-2 text-white hover:bg-purple-700"
        onClick={initiateCall}
      >
        <p className="hidden md:inline">Call Video</p>
        <Video />
      </Button>

      {showCallInterface && (
        <CallVideoInterface
          friendId={friendId}
          friendName={friendName}
          chatId={chatId}
          closeInterface={() => setShowCallInterface(false)}
        />
      )}

      {/* Always render the incoming call UI so that it can listen for incoming calls */}
      {/* <IncomingCallVideo
        showInterface={() => setShowCallInterface(true)}
      /> */}
    </div>
  );
}
