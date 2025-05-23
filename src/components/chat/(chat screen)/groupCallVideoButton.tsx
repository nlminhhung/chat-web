"use client";
import { Button } from "@/src/components/chat/ui/button";
import { Video } from "lucide-react";
import socket from "@/src/lib/getSocket";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function GroupCallVideoButton({groupName, groupId, userId, userName}: {
  groupName: string;
  groupId: string;
  userId: string;
  userName: string;
}) {
  const handleGroupCall = () => {
    socket.emit("groupCall-initiate", { groupId, groupName, userId });
    window.open(`/room?groupId=${groupId}&username=${userName}&userId=${userId}`, "_blank");
  }
    
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex gap-x-2 text-white hover:bg-purple-700"
      onClick={handleGroupCall}>
      <p className="hidden md:inline">Group Call</p><Video />
    </Button>
  )
}