"use client";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/chat/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import toast from "react-hot-toast";
import socket from "@/src/lib/getSocket";

export default function SuggestedFriends({sessionId, suggestedFriends}: {sessionId: string, suggestedFriends: User[]} ) {
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>(suggestedFriends.filter((user: User) => user.id != sessionId));
  const handleAddFriend = async (email: string, friendId: string) => {
    const res = await fetch("/api/friends/add", {
      method: "post",
      body: JSON.stringify({
        email: email,
        message: "I see you online!",
      }),
    });
    const resMessage = await res.json();
    if (!res.ok) {
      toast.error(resMessage.error);
    } else {
      socket.emit("newFriendRequest", { idToAdd: resMessage.idToAdd });
      toast.success("Your request has been filed!");
      setSuggestedUsers(suggestedUsers.filter((user) => user.id !== friendId));
    }
  };
  return suggestedUsers.map((user) => (
    <div
      key={user.id}
      className="flex flex-col items-center space-y-2 transition-opacity duration-300 ease-in-out"
    >
      <Avatar className="w-15 h-12">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <span className="truncate text-sm font-medium text-purple-800">
        {user.name}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => handleAddFriend(user.email, user.id)}
      >
        Add
      </Button>
    </div>
  ));
}
