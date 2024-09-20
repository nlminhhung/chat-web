"use client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import { Button } from "@/src/components/chat/ui/button";
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import { Input } from "@/src/components/chat/ui/input";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Clock, Send, Menu, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { messageValidate } from "@/src/lib/valid_data/message";
import * as z from "zod";

interface Message {
  id: number;
  sender: "friend" | "user";
  name: string;
  content: string;
  avatar: string;
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

type ChatScreenProps = {
  friendId: string;
};

type FormData = z.infer<typeof messageValidate>;


export default function ChatScreen({ params }: { params: ChatScreenProps }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [friend, setFriend] = useState<User>();
  useEffect(() => {
    checkPath(friendId, router);
  }, []);
  const friendId = params.friendId;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(messageValidate) });

  const checkPath = async (
    friendId: string,
    router: ReturnType<typeof useRouter>
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getChat?friendId=${friendId}`,
        {
          method: "GET",
        }
      );
      if (!res.ok) {
        router.push("/chat");
        return;
      }
      const data = await res.json();
      setFriend(data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch friend List!");
    }
  };

  const sendMessage = async (message: string, friendId: string) => {
    try {
      const validatedMessage = messageValidate.parse({ message });
      const res = await fetch("/api/message/add", {
        method: "post",
        body: JSON.stringify({
          friendId: validatedMessage.friendId,
          message: validatedMessage.message,
        }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
      }
    } catch (error) {
      toast.error("There was an error! Try again");
    }
  };

  const onSubmit = (data: FormData) => {
    sendMessage(data.message, friendId);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-purple-600 text-white shadow-sm z-10">
        <div className="px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={friend?.image} alt={friend?.name} />
            <AvatarFallback>{friend?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{friend?.name}</h1>
            <p className="text-sm text-purple-200">Last online</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4 bg-purple-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col ${
                  message.sender === "user" ? "items-end" : "items-start"
                } max-w-[70%] sm:max-w-[60%]`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === "friend" && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={message.avatar} alt={message.name} />
                      <AvatarFallback>{message.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="font-semibold text-sm text-purple-800">
                    {message.name}
                  </span>
                  {message.sender === "user" && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={message.avatar} alt={message.name} />
                      <AvatarFallback>{message.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === "user"
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
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-purple-100">
        <form className="flex space-x-2" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("message")}
            id="message"
            className="flex-grow bg-white"
            placeholder="Type a message..."
          />
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
