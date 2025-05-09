import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "@/src/components/chat/ui/button";
import { useState, useRef, useEffect } from "react";
import { Video, Phone, Mic, MicOff, VideoOff, VideoIcon } from "lucide-react";
import socket from "@/src/lib/getSocket";
import toast from "react-hot-toast";
import { cn } from "@/src/lib/utils";

export function CallVideoInterface({
  friendId,
  friendName,
  chatId,
  closeInterface,
}: {
  friendId: string;
  chatId: string;
  friendName: string;
  closeInterface: () => void;
}) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  // New ref to store the local stream
  const localStreamRef = useRef<MediaStream | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  // --- Create Peer Connection --- //
  const createPeerConnection = () => {
    if (peerConnection.current) return;
    // Use unified-plan to help preserve m-line order
    const configuration = { 
      sdpSemantics: "unified-plan", 
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }] 
    };
    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, roomId: chatId });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setIsRemoteConnected(true);
      } else {
        console.error("remoteVideoRef.current is null");
      }
    };
  };

  // --- Open Media Devices --- //
  const openMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      // Save the stream reference for later use
      localStreamRef.current = stream;
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

  // --- Initiate Outgoing Call Offer --- //
  const initiateOffer = async () => {
    if (!peerConnection.current) return;
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", { offer, roomId: chatId });
    } catch (error) {
      toast.error("Failed to initiate call.");
      console.error("Error creating offer:", error);
    }
  };

  // --- Hang Up Call --- //
  const hangUpCall = () => {
    closeInterface();
    socket.emit("hangup", { roomId: chatId });

    // Stop all tracks from the stored local stream.
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      if (remoteVideoRef.current.srcObject) {
        (remoteVideoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
      remoteVideoRef.current.srcObject = null;
    }
    peerConnection.current?.close();
    peerConnection.current = null;
    setIsRemoteConnected(false);
    toast("Call ended.");
  };

  // --- Socket.IO Event Listeners --- //
  useEffect(() => {
    // When receiving an offer, set the remote description and then create an answer.
    socket.on("offer", async ({ offer }) => {
      if (!peerConnection.current) createPeerConnection();
      try {
        await peerConnection.current!.setRemoteDescription(offer);
        const answer = await peerConnection.current!.createAnswer();
        await peerConnection.current!.setLocalDescription(answer);
        socket.emit("answer", { answer, roomId: chatId });
      } catch (error) {
        console.error("Error processing offer:", error);
        toast.error("Error processing offer.");
      }
    });

    // Process the answer for an outgoing call.
    socket.on("answer", async ({ answer }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.setRemoteDescription(answer);
        } catch (error) {
          console.error("Error setting remote description (answer):", error);
        }
      }
    });

    // Only add ICE candidates if a remote description is set.
    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnection.current && peerConnection.current.remoteDescription) {
        try {
          await peerConnection.current.addIceCandidate(candidate);
        } catch (error) {
          console.error("Error adding received ICE candidate", error);
        }
      } else {
        console.warn("Remote description is null; skipping ICE candidate", candidate);
      }
    });

    socket.on("hangup", () => {
      hangUpCall();
      toast("Call ended by remote user.");
    });

    // Cleanup listeners on unmount.
    return () => {
      socket.off("hangup");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [chatId]);

  // When the dialog opens, activate media and (if outgoing) generate an offer.
  useEffect(() => {
    (async () => {
      socket.emit("join-room", chatId);
      await openMediaDevices();
      initiateOffer();
    })();
  }, [chatId]);

  return (
    <Dialog open onOpenChange={closeInterface}>
      <DialogContent className="sm:max-w-4xl p-6 [&>button]:hidden">
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
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              You
            </div>
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
              {friendName}
            </div>
            {!isRemoteConnected && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span>Waiting for remote user...</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          {/* <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full h-12 w-12",
              isMuted && "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
            )}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button> */}
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={hangUpCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
          {/* <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full h-12 w-12",
              isCameraOff && "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
            )}
            onClick={() => setIsCameraOff(!isCameraOff)}
          >
            {isCameraOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
