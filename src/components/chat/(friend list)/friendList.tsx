"use client";
import Link from "next/link";
import { Button } from "@/src/components/chat/ui/button";
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import { UserPlus } from "lucide-react";
import { useEffect } from "react";
import socket from "@/src/lib/getSocket";
import { useState } from "react";

export default function FriendList({ userId }: { userId: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [friendList, setFriendList] = useState<User[]>([]);
  const fetchFriendList = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/friends/friendList`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setFriendList(data);
    } catch (error) {
      console.error("Failed to fetch friend List:", error);
    }
  };

  useEffect(() => {
    socket.emit("registerUsers", userId);
    fetchFriendList();
    const handleFriendList = async () => {
      await fetchFriendList();
    };
    socket.on("friends", handleFriendList);

    return () => {
      socket.off("friends", handleFriendList);
    };
  }, []);

  return (
    <div
      className={`bg-purple-700 text-white w-64 flex-shrink-0 ${
        isSidebarOpen ? "block" : "hidden"
      } md:block`}
    >
      <div className="p-4 border-b border-purple-600 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Friends</h2>
        <Link href={`/chat/add-friend`}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-purple-600"
          >
            <UserPlus className="h-5 w-5" />
            <span className="sr-only">Add Friend</span>
          </Button>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-9rem)]">
        {friendList.map((friend) => (
          <div
            key={friend.id}
            className="p-4 border-b border-purple-600 hover:bg-purple-600 cursor-pointer"
          >
            <Link href={`/chat/${userId}/${friend.id}`}>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.image} alt={friend.name} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{friend.name}</p>
                  <p className="text-xs text-purple-300 truncate">Last Message</p>
                </div>
                {/* <div className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} /> */}
              </div>
            </Link>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

function UserPlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}
