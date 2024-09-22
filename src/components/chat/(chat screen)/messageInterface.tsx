"use client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import toast from "react-hot-toast";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import socket from "@/src/lib/getSocket";

interface Message {
  senderId: string;
  content: string;
  timestamp: string;
}

interface userChatInformation {
  id: string;
  name: string;
  image: string;
}

export default function MessageInterface({
  friend,
  user,
}: {
  friend: User;
  user: userChatInformation;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const getMessages = async (friendId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getMessage?friendId=${friendId}`,
        {
          method: "GET",
        }
      );
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      const parsedData = data.map((message: string) => JSON.parse(message));
      setMessages(parsedData);
      return data;
    } catch (error) {
      toast.error("Failed to fetch friend List!");
    }
  };

  useEffect(() => {
    getMessages(friend.id);
    const handleMessages = async () => {
      await getMessages(friend.id);
    };
    socket.on("messages", handleMessages);
    return () => {
      socket.off("messages", handleMessages);
    };
  }, []);

  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index} 
          className={`flex ${
            message.senderId === user.id ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex flex-col ${
              message.senderId === user.id ? "items-end" : "items-start"
            } max-w-[70%] sm:max-w-[60%]`}
          >
            <div className="flex items-center space-x-2 mb-1">
              {message.senderId === friend.id && (
                <Avatar className="w-6 h-6">
                  <AvatarImage src={friend.image} alt={friend.name} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <span className="font-semibold text-sm text-purple-800">
                {message.senderId === user.id ? user.name : friend.name}
              </span>
              {message.senderId === user.id && (
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div
              className={`p-3 rounded-lg ${
                message.senderId === user.id
                  ? "bg-purple-500 text-white"
                  : "bg-white text-purple-800"
              }`}
            >
              {message.content}
            </div>
            <div className="flex items-center mt-1 text-xs text-purple-600">
              <Clock className="w-3 h-3 mr-1" />
              {message.timestamp}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
