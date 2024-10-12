"use client"
import { Button } from "@/src/components/chat/ui/button";
import { Input } from "@/src/components/chat/ui/input";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { messageValidate } from "@/src/lib/valid_data/message";
import * as z from "zod";
import socket from "@/src/lib/getSocket";

type ChatScreenProps = {
  friendId: string;
};

type FormData = z.infer<typeof messageValidate>;

export default function ChatScreen({ params }: { params: ChatScreenProps }) {
  const friendId = params.friendId;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(messageValidate) });

  const sendMessage = async (message: string, friendId: string) => {
    try {
      const validatedMessage = messageValidate.parse({ message });
      const res = await fetch("/api/chat/sendChat", {
        method: "post",
        body: JSON.stringify({
          friendId: friendId,
          message: validatedMessage.message,
        }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newMessage", { idToAdd: friendId }); 
        socket.emit("newFriend", { idToAdd: friendId }); 
      }
    } catch (error) {
      toast.error("There was an error! Try again");
    }
  };

  const onSubmit = (data: FormData) => {
    sendMessage(data.message, friendId);
    reset();
  };

  return (
    <>    
      <div className="p-4 border-t bg-purple-100">
        <form className="flex space-x-2" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("message")}
            id="message"
            className="flex-grow bg-white"
            placeholder="Type a message..."
          />
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            type="submit"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </>
  );
}
