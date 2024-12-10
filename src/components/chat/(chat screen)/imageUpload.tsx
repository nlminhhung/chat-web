"use client";

import React, { useState, useCallback } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Label } from "../ui/label"
import { ImageIcon, X } from 'lucide-react'
import toast from "react-hot-toast";
import socket from "@/src/lib/getSocket";

type ImageUploadProps = {
  friendId: string;
}

export default function ImageUpload({friendId}: ImageUploadProps){
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleImageUpload = (file: File) => {
    setUploadedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string
      setPreviewImage(imageDataUrl);
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData()
    formData.append("file", uploadedImage!);
    formData.append("friendId", friendId);   
    try {
      const res = await fetch("/api/chat/sendImage", {
        method: "post",
        body: formData
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newMessage", {chatType: "direct", senderId: friendId});
        socket.emit("newFriend", { idToAdd: friendId });
      }
    }
    catch (error) {
      toast.error("There was an error! Try again");
    }
    setUploadedImage(null);
    setPreviewImage(null)
    form.reset()
  }
    return (
      <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Upload image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg flex flex-col gap-1 p-6 items-center ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {previewImage ? (
                  <div className="relative">
                    <img src={previewImage} alt="Preview" className="max-w-full h-auto max-h-[200px] rounded-lg" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setPreviewImage(null)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                ) : (
                  <>
                    <FileIcon className="w-12 h-12 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Drag and drop a file or click to browse
                    </span>
                    <span className="text-xs text-muted-foreground">Image files only</span>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium">
                  File
                </Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" >
                Upload
              </Button>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
    )
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    )
  }