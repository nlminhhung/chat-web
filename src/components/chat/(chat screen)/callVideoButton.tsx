"use client";
import { Button } from "@/src/components/chat/ui/button";
import {
    AlertDialog,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Video } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useRef } from "react";

export default function CallVideoButton() {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const videoWindowRef = useRef<Window | null>(null);

    const openVideoWindow = () => {
        if (!videoWindowRef.current || videoWindowRef.current.closed) {
            videoWindowRef.current = window.open(
                "",
                "Video Preview",
                "width=320,height=240,left=100,top=100,resizable,scrollbars=no"
            );

            if (videoWindowRef.current) {
                const newDoc = videoWindowRef.current.document;
                newDoc.open();
                newDoc.write(`
                    <html>
                        <head>
                            <title>Video Preview</title>
                            <style>
                                body { background: black; margin: 0; display: flex; align-items: center; justify-content: center; }
                                video { width: 100%; height: 100%; }
                            </style>
                        </head>
                        <body>
                            <video ref id="localVideo" muted autoplay playsinline controls={false}></video>
                        </body>
                    </html>
                `);
                newDoc.close();
            }
        }
    };

    const openMediaDevices = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            openVideoWindow();

            // Ensure the video window has fully loaded before setting the stream
            setTimeout(() => {
                if (videoWindowRef.current) {
                    const videoElement = videoWindowRef.current.document.getElementById("localVideo") as HTMLVideoElement;
                    if (videoElement) {
                        videoElement.srcObject = stream;
                        videoElement.onloadedmetadata = () => {
                            videoElement.play(); // Ensure playback starts
                        };
                    }
                }
            }, 500);
        } catch (error) {
            toast.error("There was an error accessing the camera!");
        }
    };

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex gap-x-2 text-white hover:bg-purple-700"
                        onClick={openMediaDevices}
                    >
                        <p className="hidden md:inline">Call Video</p><Video />
                    </Button>
                </AlertDialogTrigger>
            </AlertDialog>
            {/* <video ref={localVideoRef} id="localVideo" muted autoPlay playsInline controls={false} /> */}
        </div>
    );
}
