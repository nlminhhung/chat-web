"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/chat/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/chat/ui/dialog"
import { Input } from "@/src/components/chat/ui/input"
import { Label } from "@/src/components/chat/ui/label"
import { User, Camera, X, Upload } from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import socket from "@/src/lib/getSocket";

type ProfileCustomizerProps = {
    name: string,
    image: string,
    id: string
}

export default function ProfileCustomizer({name, image, id}: ProfileCustomizerProps) {
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState(name)
  const [newImage, setNewImage] = useState<File | null>(null) 
  const [previewUrl, setPreviewUrl] = useState(image)

  const handleImageChange = (file: File) => {
    setNewImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string
      setPreviewUrl(imageDataUrl);
    }
    reader.readAsDataURL(file)
  }

//   const removeImage = () => {
//     setPreviewUrl("")
//     if (!open) {
//       setNewImage("")
//     }
//   }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    if (newImage) {
      formData.append("file", newImage);
    }
    formData.append("name", newName);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/notifications/customizeProfile`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.error);
        } else {
        //   socket.emit("newName");
            toast.success(data.message);
        }
        } catch (error) {
        toast.error("Failed to change your information!");
        }
  }

  const handleCancel = () => {
    setOpen(false)
    setPreviewUrl("")
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2  border-purple-200">
            <User className="h-4 w-4" />
                Customize Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Customize your username and profile picture. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <div className="flex flex-col items-center space-y-4">
                {previewUrl ? (
                  <div className="relative">
                    <Image
                      src={previewUrl || "/placeholder.svg"}
                      alt={name}
                      width={120}
                      height={120}
                      className="rounded-full object-cover w-[120px] h-[120px]"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                      onClick={() => setPreviewUrl("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-[120px] h-[120px] rounded-full bg-purple-50 border-2 border-dashed border-purple-300 flex items-center justify-center">
                    <Camera className="h-10 w-10 text-purple-400" />
                  </div>
                )}

                <div className="flex items-center justify-center">
                  <Label
                    htmlFor="dialog-picture-upload"
                    className="cursor-pointer flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {previewUrl ? "Change Picture" : "Upload Picture"}
                  </Label>
                  <Input
                    id="dialog-picture-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newName" className="text-left">
                Choose a new name
              </Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} className="border-purple-200 hover:bg-purple-50">
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
              Save changes
            </Button>
          </DialogFooter>
        </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}