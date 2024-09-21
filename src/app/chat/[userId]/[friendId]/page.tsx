"use client"
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
import { Send, Menu, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { messageValidate } from "@/src/lib/valid_data/message";
import * as z from "zod";
import MessageInterface from "@/src/components/chat/(chat screen)/messageInterface";

type ChatScreenProps = {
  friendId: string;
};

type FormData = z.infer<typeof messageValidate>;

export default function ChatScreen({ params }: { params: ChatScreenProps }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const router = useRouter();
  // const [friend, setFriend] = useState<User>();
  // useEffect(() => {
  //   checkPath(friendId, router);
  // }, []);
  const friendId = params.friendId;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(messageValidate) });

  // const checkPath = async (
  //   friendId: string,
  //   router: ReturnType<typeof useRouter>
  // ) => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getChat?friendId=${friendId}`,
  //       {
  //         method: "GET",
  //       }
  //     );
  //     if (!res.ok) {
  //       router.push("/chat");
  //       return;
  //     }
  //     const data = await res.json();
  //     setFriend(data);
  //     return data;
  //   } catch (error) {
  //     toast.error("Failed to fetch friend List!");
  //   }
  // };

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
        // socket.emit("", { idToAdd: resMessage.idToAdd }); emit new message
      }
    } catch (error) {
      toast.error("There was an error! Try again");
    }
  };

  const onSubmit = (data: FormData) => {
    sendMessage(data.message, friendId);
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
