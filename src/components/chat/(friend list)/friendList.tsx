"use client";
import Link from "next/link";
import { Button } from "@/src/components/chat/ui/button";
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import {
  UserPlus,
  Users,
  User,
  CircleUserIcon,
} from "lucide-react";
import { useEffect } from "react";
import socket from "@/src/lib/getSocket";
import { useState } from "react";
import { useSidebar } from "@/src/lib/context/sideBarContext";
import { ChatListSkeleton } from "./friendListSkeletion";
import { toast } from "react-hot-toast";
import { IncomingCallVideo } from "../(chat screen)/incomingCallVideo";
import { CallVideoInterface } from "../(chat screen)/callVideoInterface";

interface FriendListUser extends User {
  lastMessage: string;
  onlineStatus: 0 | 1;
}

export default function FriendList({ userId }: { userId: string }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [friendList, setFriendList] = useState<FriendListUser[]>([]);
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [activeList, setActiveList] = useState<"friends" | "groups">("friends");
  const [isLoading, setIsLoading] = useState(true);
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [chatId, setChatId] = useState("");
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);

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

  const fetchGroupList = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/groupList`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setGroupList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch group List:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFriendList();
    fetchGroupList();

    const handleFriendList = async () => {
      await fetchFriendList();
    };
    const handleGroupList = async () => {
      await fetchGroupList();
    };

    socket.on("friends", handleFriendList);
    socket.on("groups", handleGroupList);
    socket.on("call-initiate", (data)=> {
      const { recipientId, recipientName, chatId } = data;
      setRecipientId(recipientId);
      setRecipientName(recipientName);
      setChatId(chatId);
      setIncomingCall(true);
      toast.success(`Incoming call from ${recipientName}`);
    });
    return () => {
      socket.off("friends", handleFriendList);
      socket.off("groups", handleGroupList);
      socket.off("call-initiate");

    };
  }, []);

  return (
    <div
      className={`bg-purple-700 text-white w-72 flex-shrink-0 ${
        isSidebarOpen ? "block" : "hidden"
      } sm:block`}
    >
      <div className="p-4 border-b border-purple-600 flex justify-between items-center">
        <div className="flex bg-purple-800 rounded-md p-1 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 transition-colors duration-200 ${
              activeList === "friends"
                ? "bg-purple-600 text-white"
                : "text-purple-300 hover:text-white hover:bg-purple-500"
            }`}
            onClick={() => setActiveList("friends")}
          >
            <User className="h-4 w-4 mr-2" />
            Friends
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 transition-colors duration-200 ${
              activeList === "groups"
                ? "bg-purple-600 text-white"
                : "text-purple-300 hover:text-white hover:bg-purple-500"
            }`}
            onClick={() => setActiveList("groups")}
          >
            <Users className="h-4 w-4 mr-2" />
            Groups
          </Button>
        </div>

        <Link
          href={
            activeList === "friends" ? `/chat/add-friend` : `/chat/new-group`
          }
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-purple-500 transition-colors duration-200"
          >
            {activeList === "friends" ? (
              <UserPlus className="h-5 w-5" />
            ) : (
              <CircleUserIcon className="h-5 w-5" />
            )}
            <span className="sr-only">
              {activeList === "friends" ? "Add Friend" : "Create Group"}
            </span>
          </Button>
        </Link>
      </div>
      {!isLoading ? <ScrollArea className="h-[calc(100vh-9rem)]">
        {activeList === 'friends' ? (
          friendList.length > 0 ? (
            friendList.map((friend) => (
              <div
                key={friend.id}
                className="p-4 border-b border-purple-600 hover:bg-purple-500 cursor-pointer transition-colors duration-200"
              >
                
                <Link href={`/chat/${userId}/${friend.id}`}>
                  <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 cursor-none">
                      <AvatarImage src={friend.image} alt={friend.name} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{friend.name}</p>
                      <p className="text-xs text-purple-300 truncate">{friend.lastMessage}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${friend.onlineStatus ? 'bg-green-400' : 'bg-gray-400'}`} />
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-purple-300">No friends added yet.</div>
          )
        ) : (
          groupList.length > 0 ? (
            groupList.map((group) => (
              <div
                key={group.id}
                className="p-4 border-b border-purple-600 hover:bg-purple-500 cursor-pointer transition-colors duration-200"
              >
                <Link href={`/chat/${userId}/group/${group.id}`}>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 cursor-none">
                      <AvatarImage src={group.image} alt={group.name} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate max-w-[120px]">{group.name}</p>
                      {/* <p className="text-xs text-purple-300 truncate">{group.lastMessage}</p> */}
                    </div>
                    <div className="text-xs text-purple-300">{group.memberCount} members</div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-purple-300">You have not joined any groups yet.</div>
          )
        )}
      </ScrollArea> : <ChatListSkeleton activeList={activeList} />}
      {<IncomingCallVideo
              friendId={recipientId}
              friendName={recipientName}
              chatId={chatId}
              incomingCall={incomingCall}
              setIncomingCall={setIncomingCall}
              showInterface={() => setShowCallInterface(true)}
        />}
      {showCallInterface && (
              <CallVideoInterface
                friendId={recipientId}
                friendName={recipientName}
                chatId={chatId}
                closeInterface={() => setShowCallInterface(false)}
              />
        )}
    </div>
  );
}
