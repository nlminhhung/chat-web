"use client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import toast from "react-hot-toast";
import { Clock, MoreVertical, Flag, Trash, Edit } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import socket from "@/src/lib/getSocket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { messageValidate } from "@/src/lib/valid_data/message";

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
  const [editingMessage, setEditingMessage] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
      toast.error("Failed to fetch new messages!");
    }
  };

  const handleUpdateMessage = async (
    updateIndex: number,
    message: string,
    friendId: string
  ) => {
    try {
      const validatedMessage = messageValidate.parse({ message });
      const res = await fetch("/api/chat/updateMessage", {
        method: "post",
        body: JSON.stringify({
          friendId: friendId,
          updateIndex: updateIndex,
          message: validatedMessage.message,
        }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newMessage", { idToAdd: friendId });
        setIsEditDialogOpen(false);
        toast.success("Your message has been updated!");
      }
    } catch (error) {
      toast.error("There was an error! Try again");
    }
    setEditingMessage("");
  };

  const handleDeleteMessage = async (deleteIndex: number, friendId: string) => {
    const res = await fetch("/api/chat/deleteMessage", {
      method: "post",
      body: JSON.stringify({
        friendId: friendId,
        deleteIndex: deleteIndex,
      }),
    });
    const resMessage = await res.json();
    if (!res.ok) {
      toast.error(resMessage.error);
    } else {
      socket.emit("newMessage", { idToAdd: friendId });
      toast.success("Delete message successfully!");
    }
  };

  const handleReportMessage = async (message: Message) => {
    const res = await fetch("/api/chat/reportMessage", {
      method: "post",
      body: JSON.stringify({
        message: message,
        senderName: friend.name,
        reporterName: user.name
      }),
    });
    const resMessage = await res.json();
    if (!res.ok) {
      toast.error(resMessage.error);
    } else {
      toast.success(`Message has been reported!`);
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

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 h-50px overflow-auto bg-purple-50">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`flex group ${
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
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {message.senderId === user.id ? (
                  <>
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent aria-describedby={undefined}>
                        <DialogHeader>
                          <DialogTitle>Edit Message</DialogTitle>
                        </DialogHeader>
                        <Textarea
                          defaultValue={message.content}
                          onChange={(e) => setEditingMessage(e.target.value)}
                        />
                        <Button
                          onClick={() =>
                            handleUpdateMessage(
                              index,
                              editingMessage,
                              friend.id
                            )
                          }
                        >
                          Update Message
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem
                      onSelect={() => handleDeleteMessage(index, friend.id)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onSelect={() => handleReportMessage(message)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}