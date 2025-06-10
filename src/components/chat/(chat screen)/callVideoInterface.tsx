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
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  // const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);

  const createPeerConnection = () => {
    if (peerConnection.current) return;

    const configuration = {
      sdpSemantics: "unified-plan",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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

  const openMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (!peerConnection.current) createPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });
      // toast.success("Media devices activated!");
    } catch (error) {
      toast.error("Could not access camera or microphone.");
      console.error("Error accessing media devices:", error);
    }
  };

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

  const hangUpCall = () => {
    closeInterface();
    socket.emit("hangup", { roomId: chatId });

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

  useEffect(() => {
    socket.on("offer", async ({ offer }) => {
      if (!peerConnection.current) createPeerConnection();
      try {
        await peerConnection.current!.setRemoteDescription(offer);
        for (const candidate of pendingCandidates.current) {
          try {
            await peerConnection.current!.addIceCandidate(candidate);
          } catch (error) {
            console.error("Error adding buffered ICE candidate", error);
          }
        }
        pendingCandidates.current = [];
        const answer = await peerConnection.current!.createAnswer();
        await peerConnection.current!.setLocalDescription(answer);
        socket.emit("answer", { answer, roomId: chatId });
      } catch (error) {
        // console.error("Error processing offer:", error);
        toast.error("Error processing offer.");
      }
    });

    socket.on("answer", async ({ answer }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.setRemoteDescription(answer);
          for (const candidate of pendingCandidates.current) {
            try {
              await peerConnection.current.addIceCandidate(candidate);
            } catch (error) {
              console.error("Error adding buffered ICE candidate", error);
            }
          }
          pendingCandidates.current = [];
        } catch (error) {
          console.error("Error setting remote description (answer):", error);
        }
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnection.current) {
        if (peerConnection.current.remoteDescription) {
          try {
            await peerConnection.current.addIceCandidate(candidate);
          } catch (error) {
            console.error("Error adding received ICE candidate", error);
          }
        } else {
          console.log("Buffering ICE candidate", candidate);
          pendingCandidates.current.push(candidate);
        }
      }
    });

    socket.on("hangup", () => {
      hangUpCall();
      toast("Call ended by remote user.");
    });

    return () => {
      socket.off("hangup");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [chatId]);

  useEffect(() => {
    (async () => {
      socket.emit("join-room", chatId);
      await openMediaDevices();
      initiateOffer();
    })();
  }, [chatId]);

  return (
    <Dialog modal={true} open onOpenChange={closeInterface}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-4xl p-6 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Video Chat</DialogTitle>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={hangUpCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
