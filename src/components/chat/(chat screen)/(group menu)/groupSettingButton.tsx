"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { AlertCircle, Camera, Trash2, X } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/src/components/chat/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/chat/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/chat/ui/alert-dialog"
import { Input } from "@/src/components/chat/ui/input"
import { Label } from "@/src/components/chat/ui/label"
import { Alert, AlertDescription } from "@/src/components/chat/ui/alert"
import Image from "next/image"
import socket from "@/src/lib/getSocket"

interface GroupSettingsDialogProps {
  userId: string
  leader: string
  groupId: string
  groupName: string
  groupImage?: string
  groupMembers: UserChatInformation[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  setIsDropdownOpen: (open: boolean) => void
}

export function GroupSettingsDialog({
  userId,
  leader,
  groupId,
  groupName,
  groupImage,
  groupMembers,
  isOpen,
  setIsOpen,
  setIsDropdownOpen,
}: GroupSettingsDialogProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [name, setName] = useState(groupName)
  const [error, setError] = useState("")

  // image handling adapted from AddGroup
  const [groupPicture, setGroupPicture] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(groupImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData()
    if (groupPicture) formData.append("file", groupPicture)
    formData.append("groupName", name)
    formData.append("userId", userId)
    formData.append("groupId", groupId)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/editGroup`,
        { method: "POST", body: formData }
      )
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error)
      } else {
        const friendIds = groupMembers.map((member) => member.id)
        socket.emit("notificateGroup", {
          groupMembers: [...friendIds, userId]
        })
        toast.success(data.message)
        setIsOpen(false)
      }
    } catch (error) {
      toast.error("Failed to update group settings")
    }
  }

  const handleImageUpload = (file: File) => {
    setGroupPicture(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setGroupPicture(null)
    setPreviewImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDeleteGroup = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/deleteGroup`,
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            groupId,
            memberIds: groupMembers.map((m) => m.id),
          }),
        }
      )
      const resMessage = await res.json()
      if (!res.ok) {
        toast.error(resMessage.error)
      } else {
        setIsOpen(false)
        setDeleteDialogOpen(false)
        groupMembers.forEach((member) => {
          socket.emit("leaveGroup", { userId: member.id, groupId })
        })
        toast.success(resMessage.message)
      }
    } catch {
      toast.error("Failed to delete group!")
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Group Settings</DialogTitle>
            <DialogDescription>
              Edit your group details or delete the group.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirm} className="space-y-6 py-4">
            {/* Group Picture Section */}
            <div className="space-y-2">
              <Label htmlFor="group-picture-upload" className="text-lg font-semibold">
                Group Picture
              </Label>
              <div className="flex flex-col items-center space-y-4">
                {previewImage ? (
                  <div className="relative">
                    <Image
                      src={previewImage}
                      alt="Group picture"
                      width={120}
                      height={120}
                      className="rounded-full object-cover w-[120px] h-[120px]"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                      onClick={removeImage}
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
                    htmlFor="group-picture-upload"
                    className="cursor-pointer flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {previewImage ? "Change Picture" : "Upload Picture"}
                  </Label>
                  <Input
                    id="group-picture-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            {/* Group Name Section */}
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (e.target.value.trim()) setError("")
                }}
                placeholder="Enter group name"
              />
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Danger Zone */}
            {userId === leader && (
              <div className="space-y-2 rounded-md border border-destructive/20 p-3">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <p className="text-xs text-muted-foreground">
                  Once you delete a group, there is no going back. Please be certain.
                </p>
                <Button
                  type="button"
                  onClick={() => setDeleteDialogOpen(true)}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Group
                </Button>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
