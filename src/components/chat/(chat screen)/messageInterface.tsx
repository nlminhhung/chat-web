"use client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import toast from "react-hot-toast";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

interface Message {
  id: number;
  sender: "friend" | "user";
  name: string;
  content: string;
  avatar: string;
  timestamp: string;
}

interface MessageReal {
    senderId: string;
    content: string;
    timestamp: string;
  }

const messages: Message[] = [
  {
    id: 1,
    sender: "friend",
    name: "Alice",
    content: "Hey there! How's it going?",
    avatar: "/placeholder.svg?height=40&width=40",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    sender: "user",
    name: "You",
    content: "Hi Alice! I'm doing great, thanks for asking. How about you?",
    avatar: "/placeholder.svg?height=40&width=40",
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    sender: "friend",
    name: "Alice",
    content:
      "I'm good too! Just working on some projects. Anything exciting happening on your end?",
    avatar: "/placeholder.svg?height=40&width=40",
    timestamp: "10:35 AM",
  },
  {
    id: 4,
    sender: "user",
    name: "You",
    content:
      "Actually, yes! I'm planning a trip next month. It's been a while since I've traveled.",
    avatar: "/placeholder.svg?height=40&width=40",
    timestamp: "10:38 AM",
  },
];

interface userChatInformation {
    id: string,
    name: string,
    image: string
}

export default function MessageInterface({friend, user} : {friend: User, user: userChatInformation}) {
  const [messages, setMessages] = useState<MessageReal[]>([])
  // const [user, setUser] = useState<userChatInformation>({
  //   id: '',
  //   name: '',
  //   image: '',
  // })
  

    const getMessages = async (friendId: string) => {
    try {
      // console.log({id: session?.user.id, name: session?.user.name, image: session?.user.image})
      // setUser({id: session?.user.id, name: session?.user.name, image: session?.user.image});
    // setUser({id: "123", name: "Hung", image: "a"});
    const session = await getSession();
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
      console.log("data: ", data)
      const parsedData = data.map((message: string) => JSON.parse(message))
      console.log("parsedData: ", parsedData)
      setMessages(parsedData);
      return data;
    } catch (error) {
      toast.error("Failed to fetch friend List!");
    }
  };

  useEffect(() => {
    console.log("friend:", friend)
    getMessages(friend.id);
  }, []);
  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index} // this key is not unique, make the message index a key
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
