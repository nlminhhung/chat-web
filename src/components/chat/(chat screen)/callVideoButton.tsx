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
  userImage,
  userName
}: {
  friendName: string;
  friendId: string;
  userId: string;
  userImage: string;
  userName: string;
}) {
  const [showCallInterface, setShowCallInterface] = useState(false);

  // Form a unique room/chat id using sorted user ids.
  const sortedUsers = [userId, friendId].sort();
  const chatId = sortedUsers.join(":");

  // Outgoing call initiation.
  const initiateCall = () => {
    socket.emit("join-room", chatId);
    socket.emit("call-initiate", { recipientId: friendId, recipientName: userName, chatId, recipientImage: userImage });
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
    </div>
  );
}
