"use client";
import { Button } from "@/src/components/chat/ui/button";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import "dotenv/config";
import socket from "@/src/lib/getSocket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export const Notification = ({userId} : {userId: string}) => {
  const [newFriendRequests, setNewFriendRequests] = useState<FriendRequest[]>(
    []
  );

  const fetchFriendRequests = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/notifications/getReqs`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setNewFriendRequests(data);
    } catch (error) {
      console.error("Failed to fetch friend requests:", error);
    }
  };
  useEffect(() => {
    socket.emit("registerUsers", userId);
    fetchFriendRequests();
    const handleFriendsRequest = async () => {
      await fetchFriendRequests();
    };
    socket.on("friendsRequest", handleFriendsRequest);

    return () => {
      socket.off("friendsRequest", handleFriendsRequest);
    };
  }, []);

  const acceptClick = async (id: string) => {
    try {
      const res = await fetch("/api/friends/accept", {
        method: "post",
        body: JSON.stringify({ id: id }),
      });
      // const resMessage = await res.json();
      if (!res.ok) {
        toast.error("Already friends or request doesn't exist!");
      } else {
        socket.emit("newFriendRequest", { idToAdd: id });
        socket.emit("newFriend", { idToAdd: id });
        setNewFriendRequests((list) =>
          list.filter((req) => req.user.id !== id)
        );
        toast.success("You are now friends!");
      }
    } catch (error) {
      if (error) {
        toast.error("Something gone wrong!");
        return;
      }
    }
  };

  const denyClick = async (id: string) => {
    try {
      const res = await fetch("/api/friends/deny", {
        method: "post",
        body: JSON.stringify({ id: id }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newFriendRequest", { idToAdd: id });
        setNewFriendRequests((list) =>
          list.filter((req) => req.user.id !== id)
        );
        toast.success("You have denied the request!");
      }
    } catch (error) {
      toast.error("Something gone wrong!");
      return;
    }
  };

  return (
    <>
      <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-purple-700">
                <Bell className="h-5 w-5" />
                {newFriendRequests.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center bg-red-500 text-white">
                    {newFriendRequests.length}
                  </Badge>
                )}
                <span className="sr-only">Friend Requests</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="font-normal">
                <h2 className="text-lg font-semibold">Friend Requests</h2>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {newFriendRequests.map((request) => (
                  <DropdownMenuItem key={request.user.id} className="p-4 focus:bg-purple-100">
                    <div className="flex flex-col space-y-2 w-full">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={request.user.image} alt={request.user.name} />
                          <AvatarFallback>{request.user.name}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">{request.user.name}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{request.message}</p>
                      <div className="flex justify-between mt-2">
                        <Button size="sm" variant="outline" className="w-[45%]" onClick={() => denyClick(request.user.id)}>
                          Deny
                        </Button>
                        <Button size="sm" className="w-[45%]" onClick={() => acceptClick(request.user.id)}>
                          Accept
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
    </>
  );
};
