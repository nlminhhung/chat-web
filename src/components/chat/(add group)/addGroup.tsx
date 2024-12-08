"use client"

import { useState } from "react"
import { Button } from "@/src/components/chat/ui/button"
import { Input } from "@/src/components/chat/ui/input"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"
import { UserPlus, UserMinus, ArrowLeft } from "lucide-react"
import socket from "@/src/lib/getSocket";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function AddGroup({ friendList, userId }: {friendList: User[], userId: string}) {
  const [groupName, setGroupName] = useState("")
  const [groupFriends, setGroupFriends] = useState<User[]>([])
  const [checkSuccess, setSuccess] = useState(false);
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

  const handleConfirm = async () => {
    const friendIds = groupFriends.map(friend => friend.id);
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/create`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
            friendIds: friendIds,
            groupName: groupName
          }),
        }
      );
    const data = await res.json();
    if (!res.ok) {
        toast.error(data.error);
      } else {
        socket.emit("newRoom", { idToAdd: data.idToAdd });
        setSuccess(true);
        toast.success("Your request has been filed!");
      }
  }

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create a New Group</h1>
        <Input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Available Friends</h2>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {availableFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <img src={friend.image} alt="" className="w-8 h-8 rounded-full" />
                    <span>{friend.name}</span>
                  </div>
                  <Button size="sm" onClick={() => addFriend(friend)}>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
              {availableFriends.length === 0 && (
                <p className="text-center text-gray-500 py-4">No friends available</p>
              )}
            </ScrollArea>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Friends in Group</h2>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {groupFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <img src={friend.image} alt="" className="w-8 h-8 rounded-full" />
                    <span>{friend.name}</span>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => removeFriend(friend.id)}>
                    <UserMinus className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
              {groupFriends.length === 0 && (
                <p className="text-center text-gray-500 py-4">No friends in group yet</p>
              )}
            </ScrollArea>
          </div>
        </div>
        {!checkSuccess && <Button 
          className="w-full" 
          onClick={handleConfirm}
          disabled={!groupName.trim() || groupFriends.length === 0}
        >
          Create Group
        </Button>}
        <Button
                type="button"
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-100"
                onClick={()=>router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
      </div>
    </div>
  )
}