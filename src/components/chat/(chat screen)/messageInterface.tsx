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
import Image from "next/image";
import { set } from "zod";
import { MessageListSkeleton } from "./messageInterfaceSkeleton";

export default function MessageInterface({
  friend,
  user,
  chatType,
}: {
  friend: User;
  user: UserChatInformation;
  chatType: "direct" | "group";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessage, setEditingMessage] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getMessages = async (id: string) => {
    try {
      const getMessageURL =
        chatType === "direct"
          ? `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getDirectMessage?friendId=${id}`
          : `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getGroupMessage?groupId=${id}`;

      const res = await fetch(getMessageURL, {
        method: "GET",
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setMessages(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      toast.error("Failed to fetch new messages!");
    }
  };

  const handleUpdateMessage = async (
    messageId: string,
    message: string,
    senderId: string
  ) => {
    try {
      const validatedMessage = messageValidate.parse({ message });
      const requestBody = {
        senderId: senderId,
        friendId: friend.id,
        messageId: messageId,
        message: validatedMessage.message,
        chatType: chatType,
      }
      const res = await fetch("/api/chat/updateMessage", {
        method: "post",
        body: JSON.stringify(requestBody),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newMessage", { chatType: chatType, recipientId: friend.id });
        setIsEditDialogOpen(false);
        toast.success("Your message has been updated!");
      }
    } catch (error) {
      toast.error("There was an error! Try again");
    }
    setEditingMessage("");
  };

  const handleDeleteMessage = async (
    messageId: string,
    senderId: string,
    messageType: string
  ) => {
    const requestBody = {
      senderId: senderId,
      friendId: friend.id,
      messageId: messageId,
      messageType: messageType,
      chatType: chatType,
    }
    const res = await fetch("/api/chat/deleteMessage", {
      method: "post",
      body: JSON.stringify(requestBody),
    });
    const resMessage = await res.json();
    if (!res.ok) {
      toast.error(resMessage.error);
    } else {
      socket.emit("newMessage", { chatType: chatType, recipientId: friend.id });
      toast.success("Delete message successfully!");
    }
  };

  const handleReportMessage = async (messageId: string, senderId: string) => {
    const res = await fetch("/api/chat/reportMessage", {
      method: "post",
      body: JSON.stringify({
        messageId: messageId,
        friendId: friend.id,
        senderId: senderId,
        chatType: chatType,
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
    setIsLoading(true);
    getMessages(friend.id);
    // setIsLoading(false);
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
    <>
    { !isLoading ? (
    <ScrollArea className="flex-1 p-4 h-50 overflow-auto bg-purple-50">
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
                {message.senderId !== user.id && (
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={message.senderImage} alt={message.name} />
                    <AvatarFallback>{message.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <span className="font-semibold text-sm text-purple-800">
                  {message.senderId === user.id ? user.name : message.name}
                </span>
                {message.senderId === user.id && (
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              {(message.type == "message" && (
                <div
                  className={`p-3 rounded-lg ${
                    message.senderId === user.id
                      ? "bg-purple-500 text-white"
                      : "bg-white text-purple-800"
                  }`}
                >
                  {message.content}
                </div>
              )) || (
                <Image
                  src={message.content}
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
              )}
              <div className="flex items-center mt-1 text-xs text-purple-600">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(Number(message.timestamp)).toLocaleString()}
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
                      {message.type === "message" && (
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
                      )}
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
                              message.messageId,
                              editingMessage,
                              message.senderId
                            )
                          }
                        >
                          Update Message
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem
                      onSelect={() =>
                        handleDeleteMessage(
                          message.messageId,
                          message.senderId,
                          message.type
                        )
                      }
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onSelect={() => handleReportMessage(message.messageId, message.senderId)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </ScrollArea>) : <MessageListSkeleton />}
    
    </>
    )
}
