"use client"

import { useState } from "react"
import { Button } from "@/src/components/chat/ui/button"
import { Input } from "@/src/components/chat/ui/input"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"
import { Label } from "@/src/components/chat/ui/label"
import { UserPlus, UserMinus, ArrowLeft, X, Camera, Upload } from "lucide-react"
import socket from "@/src/lib/getSocket";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image"

export default function AddGroup({ friendList, userId }: {friendList: User[], userId: string}) {
  const [groupName, setGroupName] = useState("")
  const [groupFriends, setGroupFriends] = useState<User[]>([])
  const [checkSuccess, setSuccess] = useState(false);
  const [groupPicture, setGroupPicture] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const router = useRouter();

  const availableFriends = friendList.filter(
    (friend) => !groupFriends.some((groupFriend) => groupFriend.id === friend.id)
  )

  const addFriend = (friend: User) => {
    setGroupFriends([...groupFriends, friend])
  }

  const removeFriend = (friendId: string) => {
    setGroupFriends(groupFriends.filter((friend) => friend.id !== friendId))
  }

  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData()
    formData.append("file", groupPicture!);
    const friendIds = groupFriends.map(friend => friend.id);

    friendIds.forEach(id => {
      formData.append("friendIds", id);
    });

    formData.append("groupName", groupName);
    formData.append("userId", userId);

    const sendImageURL =`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/create`;   
    try {
      const res = await fetch(sendImageURL, {
        method: "POST",
        body: formData
      });
    
      // const data = await res.json();

      // if (!res.ok) {
      //     toast.error(data.error);
      //   } else {
      //     socket.emit("newGroup", { groupMembers: [...friendIds, userId], roomId: data.groupId });
      //     setSuccess(true);
      //     toast.success(data.message);
      //   }
      } catch (error) {
        toast.error("Failed to create group");
      }
  }

  const handleImageUpload = (file : File) => {
    setGroupPicture(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string
      setPreviewImage(imageDataUrl);
    }
    reader.readAsDataURL(file)
  }
  
  const removeImage = () => {
    setGroupPicture(null)
  }
  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create a New Group</h1>
        <form onSubmit={handleConfirm}>
        <Input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full"
        />

        <div className="space-y-2">
          <Label htmlFor="group-picture" className="text-lg font-semibold">
            Group Picture
          </Label>
          <div className="flex flex-col items-center space-y-4">
            {groupPicture ? (
              <div className="relative">
                <Image
                  src={previewImage || "/placeholder.svg"}
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
                <Upload className="w-4 h-4 mr-2" />
                {groupPicture ? "Change Picture" : "Upload Picture"}
              </Label>
              <Input
                id="group-picture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Available Friends</h2>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {availableFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <img src={friend.image || "/placeholder.svg"} alt="" className="w-8 h-8 rounded-full" />
                    <span>{friend.name}</span>
                  </div>
                  <Button size="sm" onClick={() => addFriend(friend)}>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
              {availableFriends.length === 0 && <p className="text-center text-gray-500 py-4">No friends available</p>}
            </ScrollArea>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Friends in Group</h2>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {groupFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <img src={friend.image || "/placeholder.svg"} alt="" className="w-8 h-8 rounded-full" />
                    <span>{friend.name}</span>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => removeFriend(friend.id)}>
                    <UserMinus className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
              {groupFriends.length === 0 && <p className="text-center text-gray-500 py-4">No friends in group yet</p>}
            </ScrollArea>
          </div>
        </div>

        {!checkSuccess && (
          <Button className="w-full" type="submit" disabled={!groupName.trim() || groupFriends.length === 0}>
            Create Group
          </Button>
        )}
        </form>
        <Button
          type="button"
          variant="outline"
          className="w-full border-purple-600 text-purple-600 hover:bg-purple-100"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  )
}