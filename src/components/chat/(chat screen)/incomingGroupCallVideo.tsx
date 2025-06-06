"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast";
import { Phone, PhoneOff, Video } from "lucide-react"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import socket from "@/src/lib/getSocket"
import { Dialog, DialogContent } from "../ui/dialog";
import { set } from "zod";

export function IncomingGroupCallVideo({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
    const [incomingCall, setIncomingCall] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupId, setGroupId] = useState("");

  // When a "call-initiate" event is received, indicate an incoming call.
  useEffect(() => {
    socket.on("groupCall-initiate", async (data) => {
      const { groupId, groupName, callerId } = data;
      if (callerId == userId) return; // Ignore if the caller is the current user
        setIncomingCall(true);
        setGroupName(groupName);
        setGroupId(groupId);
        console.log("Incoming call from group: ", groupName);
    });
  }, []);

  // Accept the incoming call.
  const acceptCall = async () => {
    const roomUrl = `/room?groupId=${groupId}&username=${userName}&userId=${userId}`;
    window.open(roomUrl, "_blank");
    setIncomingCall(false);
  };

  // Decline the incoming call.
  const declineCall = () => {
    toast("Call declined.");
    setIncomingCall(false);
  };

  if (!incomingCall) return null;

  return (
    <Dialog open onOpenChange={() => setIncomingCall(false)}>
      <DialogContent className="p-0 border-2 border-purple-600 max-w-md overflow-hidden [&>button]:hidden">
        <div className="bg-white px-6 py-4 text-center text-gray-900">
          <div className="mb-2 flex items-center justify-center">
            <Video className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Incoming Video Call</span>
          </div>
          <div className="flex justify-center">
            <div className="pulse-animation relative flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <Avatar className="h-16 w-16">
                <AvatarImage src={"https://lh3.googleusercontent.com/a/ACg8ocI74bJpoR7307hi-CILg6gQSDi-ZN0u8Ne5HaWbA6f92zStsw=s96-c"} />
              </Avatar>
            </div>
          </div>
          <h3 className="mt-4 text-xl font-semibold">Group: {groupName}</h3>
          <p className="text-sm text-gray-500">is having a call...</p>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 bg-black">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={declineCall}
          >
            <PhoneOff className="h-4 w-4" />
            Decline
          </Button>
          <Button
            className="flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600"
            onClick={acceptCall}
          >
            <Phone className="h-4 w-4" />
            Accept
          </Button>
        </div>
      </DialogContent>

      <style jsx global>{`
        .pulse-animation::before {
          content: '';
          position: absolute;
          border: 1px solid rgba(128, 90, 213, 0.3);
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          70% {
            transform: scale(1.1);
            opacity: 0;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </Dialog>
  )
}


