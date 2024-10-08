"use client";
import { Button } from "@/src/components/chat/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { UserMinus } from "lucide-react";
import toast from "react-hot-toast";
import socket from "@/src/lib/getSocket";
import { redirect } from "next/navigation";

export default function DeleteFriendButton({friendId}: {friendId: string}) {
  const handleDeleteFriend = async (friendId: string) => {
    try {
      const res = await fetch("/api/friends/delete", {
        method: "post",
        body: JSON.stringify({
          id: friendId,
        }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newFriend", { idToAdd: friendId }); 
        redirect("/chat")
      }
    } catch (error) {
      toast.error("There was an error! Try again");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-purple-700"
        >
          <UserMinus/> 
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this friend?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            friend and remove all associated messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteFriend(friendId)}
          >
            Delete Friend
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
