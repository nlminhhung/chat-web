"use client";
import { Button } from "@/src/components/chat/ui/button";
import { Input } from "@/src/components/chat/ui/input";
import toast from "react-hot-toast";
import { Send, Smile } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { messageValidate } from "@/src/lib/valid_data/message";
import * as z from "zod";
import socket from "@/src/lib/getSocket";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/chat/ui/popover"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import ImageUpload from "@/src/components/chat/(chat screen)/imageUpload";

type GroupScreenProps = {
  groupId: string;
  userId: string;
};

type FormData = z.infer<typeof messageValidate>;

const emojis = [
  "😀", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
  "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
  "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
]


export default function GroupScreen({ params }: { params: GroupScreenProps }) {
  const groupId = params.groupId;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(messageValidate) });

  const sendMessage = async (message: string, groupId: string) => {
    try {
      const validatedMessage = messageValidate.parse({ message });
      const res = await fetch("/api/chat/sendGroupMessage", {
        method: "post",
        body: JSON.stringify({
          groupId: groupId,
          message: validatedMessage.message,
        }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newMessage", {chatType: "group", recipientId: groupId});
      }
    } catch (error) {
      toast.error("There was an error! Try again");
    }
  };

  const onSubmit = (data: FormData) => {
    if (data.message.trim()) {
      sendMessage(data.message, groupId);
      reset();
    }
  };

  const onSubmitEmoji = (emoji: string) => {
    if (emoji.trim()) {
      sendMessage(emoji, groupId);
      reset();
    }
  };

  return (
    <>
      <div className="p-4 border-t bg-purple-100">
        <form className="flex space-x-2" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("message")}
            id="message"
            className="flex-grow bg-white"
            autoComplete="off"
            placeholder="Type a message..."
          />
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            type="submit"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
          <ImageUpload friendId={groupId} chatType="group"/>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button"
                variant="outline" 
                size="icon" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Smile className="h-4 w-4" />
                <span className="sr-only">Open emoji picker</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 bg-purple-50 border border-purple-200">
              <ScrollArea className="h-72 w-full p-2">
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-purple-200 text-lg"
                      onClick={() => onSubmitEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </form>
      </div>
    </>
  );
}
