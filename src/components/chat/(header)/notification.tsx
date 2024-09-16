"use client";

import { Button } from "@/src/components/chat/ui/button";
import {FC, useEffect, useState} from "react"
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import toast from "react-hot-toast";
import 'dotenv/config';
import socket from "@/src/lib/getSocket";


export const Notification = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [newFriendRequests, setNewFriendRequests] = useState<FriendRequest[]>([])
  
  const fetchFriendRequests = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/notifications/getReqs`, {
        method: 'GET',
      });
      const data = await res.json();
      setNewFriendRequests(data);
    } catch (error) {
      console.error('Failed to fetch friend requests:', error);
    }
  };
  useEffect(() => {
    fetchFriendRequests();
    const handleFriendsRequest = async () => {
      await fetchFriendRequests();
    };
    socket.on('friendsRequest', handleFriendsRequest);

    return () => {
      socket.off('friendsRequest', handleFriendsRequest);
    };
  }, []);
  
  const nOfRequest = newFriendRequests.length;  
  const acceptClick = async (id: string) => {
    try {
      const res = await fetch("/api/friends/accept", {
        method: "post",
        body:JSON.stringify({id: id})});       
      const resMessage =  await res.json();
      if (!res.ok)
      {
        toast.error(resMessage.error);
      }
      else {
        socket.emit('newFriendRequest', { idToAdd: id });
        setNewFriendRequests(list => list.filter(req => req.user.id !== id ))
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
      const res = await fetch("/api/friends/deny", 
        {method: "post",
        body:JSON.stringify({id: id})});
      const resMessage =  await res.json();
      if (!res.ok)
      {
        toast.error(resMessage.error);
      }
      else {
        socket.emit("newFriendRequest", { idToAdd: id });
        setNewFriendRequests(list => list.filter(req => req.user.id !== id ))
        toast.success("You have denied the request!");
      }
    } catch (error) {
        toast.error("Something gone wrong!");
        return;
    }
  };


  return (
    <>
      <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <BellIcon className="h-6 w-6" />
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 rounded-full px-1.5 py-0.5 text-xs font-medium"
            >
              {nOfRequest}
            </Badge>
          </Button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-[400px] rounded-md bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsNotificationsOpen(false)}
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6">
                <>
                {newFriendRequests.map((req)=>(
                  <div className="flex items-start justify-between" key={req.user.id}>
                    <div className="flex items-start">
                      <Avatar className="mr-4">
                        <AvatarImage src={req.user.image} alt="Avatar" />
                        <AvatarFallback>:)</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{req.user.name} </p>
                        <p className="text-muted-foreground">{req.message}</p>
                        <div className="flex gap-2 mt-2 justify-between">
                        <Button className="bg-green-500" size="sm" onClick={() => acceptClick(req.user.id)}>
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button variant="destructive" size="sm" className="ml-auto" onClick={() => denyClick(req.user.id)}>
                          <XIcon className="h-4 w-4 mr-2" />
                          Deny
                        </Button>
                      </div>

                      </div>
                    </div>
                  </div>
                ))}
                </>
              </div>
            </div>
          )}
        </div>
    </>
  );
};


function CheckIcon(props : any) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function BellIcon(props: any) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function XIcon(props: any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}