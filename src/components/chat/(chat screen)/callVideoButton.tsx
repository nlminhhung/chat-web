"use client";
import { Button } from "@/src/components/chat/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { Video, Phone, Mic, MicOff, VideoOff, VideoIcon } from "lucide-react"
import { cn } from "@/src/lib/utils";
import socket from "@/src/lib/getSocket";

export default function CallVideoButton({ friendId, userId }: { friendId: string, userId: string }) {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    
    const [open, setOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    
    const sortedUsers = [userId, friendId].sort(); 
    const chatId = sortedUsers.join(":"); 
    
    // --- Create Peer Connection --- //
    const createPeerConnection = () => {
      if (peerConnection.current) return; 
      const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
      peerConnection.current = new RTCPeerConnection(configuration);
      
      // peerConnection.current.onconnectionstatechange = () => {
      //   console.log("Connection state:", peerConnection.current!.connectionState);
      // };

      // peerConnection.current.onicegatheringstatechange = () => {
      //       console.log("ICE Gathering State:", peerConnection.current!.iceGatheringState);
      // };

      peerConnection.current.onicecandidate = (event) => {
        // console.log("ICE Candidate Event Triggered:", event.candidate);
        if (event.candidate) {
          socket.emit("ice-candidate", { candidate: event.candidate, roomId: chatId });
        }
      };
    
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          } else {
            console.error("remoteVideoRef.current is null");
          }
      };
    };
    
    // --- Open Media Devices --- //
    const openMediaDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
    
        if (!peerConnection.current) createPeerConnection();

        stream.getTracks().forEach((track) => {
          peerConnection.current?.addTrack(track, stream);
        });
        toast.success("Media devices activated!");
      } catch (error) {
        toast.error("Could not access camera or microphone.");
        console.error("Error accessing media devices:", error);
      }
    };
    
    // --- Initiate a Call --- //
    const initiateCall = async () => {
        setOpen(true);
        
        socket.emit("join-room", chatId); 
        socket.emit("call-initiate", { recipientId: friendId });
      
        createPeerConnection(); 
      
        await openMediaDevices();
      
        if (!peerConnection.current) return;
      
        try {
            // console.log("Starting ICE candidate gathering...");
            const offer = await peerConnection.current.createOffer();
            // console.log("Created offer, setting local description...");
            await peerConnection.current.setLocalDescription(offer);
            socket.emit("offer", { offer, roomId: chatId });
            toast.success("Calling...");
            // console.log("Local description set, ICE candidates should be gathering...");
        } catch (error) {
            toast.error("Failed to initiate call.");
            console.error("Error creating offer:", error);
        }
      };
      
    
    // --- Accept Incoming Call --- //
    const acceptCall = async () => {
        setOpen(true);
        socket.emit("join-room", chatId);
        await openMediaDevices();
    };
    
    // --- Hang Up Call --- //
    const hangUpCall = async () => {
      setOpen(false);
      socket.emit("hangup", { roomId: chatId });

      if (localVideoRef.current?.srcObject) {
        (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current?.srcObject) {
        (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        remoteVideoRef.current.srcObject = null;
      }
      peerConnection.current?.close();
      peerConnection.current = null;
      // socket.off("offer");
      // socket.off("answer");
      // socket.off("ice-candidate");
      // socket.off("hangup"); // this one cause the problem
      // socket.off("call-initiate");
      toast("Call ended.");
      };
      
    
    // --- Socket.IO Event Listeners --- //
    useEffect(() => {
        socket.on("offer", async ({ offer }) => {
            // console.log("Received offer:", offer);
            if (!peerConnection.current) createPeerConnection();
          
            await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(offer));
          
            const answer = await peerConnection.current!.createAnswer();
            await peerConnection.current!.setLocalDescription(answer);
            // console.log("Sending answer:", answer);
            socket.emit("answer", { answer, roomId: chatId });
        });
          
    
      socket.on("answer", async ({ answer }) => {
        // console.log("Received answer:", answer);
        if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });
    
      socket.on("ice-candidate", async ({ candidate }) => {
        // console.log("Received ICE candidate:", candidate);
        if (peerConnection.current) {
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error("Error adding received ICE candidate", error);
          }
        }
      });
    
      socket.on("hangup", () => {
        hangUpCall();
        // toast("Call ended by remote user.");
      });
    
      socket.on("call-initiate", () => {
        if (peerConnection.current) return; 
        toast.success(`Incoming call from ${friendId}`);
        acceptCall();
      });
    
      return () => {
        socket.off("hangup");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
        socket.off("call-initiate");
      };
    }, [chatId]);
    
  return (
    <div>
      {/* Initiate call button for caller */}
      <Button
        variant="ghost"
        size="sm"
        className="flex gap-x-2 text-white hover:bg-purple-700"
        onClick={initiateCall}
      >
        <p className="hidden md:inline">Call Video</p>
        <Video />
      </Button>

      {/* Video dialog (could be a modal or a dialog component) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl p-6">
          <DialogHeader>
            <DialogTitle>Video Chat</DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local video */}
            <div className="relative rounded-lg bg-slate-800 aspect-video overflow-hidden">
              {isCameraOff ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <VideoOff className="h-12 w-12 mb-2" />
                  <span>Camera is off</span>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  id="localVideo"
                  muted
                  autoPlay
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">You</div>
            </div>

            {/* Remote video */}
            <div className="relative rounded-lg bg-slate-800 aspect-video overflow-hidden">
              <video
                ref={remoteVideoRef}
                id="remoteVideo"
                muted
                autoPlay
                playsInline
                controls={false}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Remote User
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span>Waiting for remote user...</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full h-12 w-12",
                isMuted && "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
              )}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={hangUpCall}>
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full h-12 w-12",
                isCameraOff && "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
              )}
              onClick={() => setIsCameraOff(!isCameraOff)}
            >
              {isCameraOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
