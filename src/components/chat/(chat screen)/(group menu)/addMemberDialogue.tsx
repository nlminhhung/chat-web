'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/chat/ui/dialog";
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import { Button } from "@/src/components/chat/ui/button";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import socket from "@/src/lib/getSocket";

type AddMemberDialogueProps = {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (open: boolean) => void;
    setIsDropdownOpen: (open: boolean) => void;
    friendList: UserChatInformation[];
    groupMembers: UserChatInformation[];
    userId: string;
    groupId: string;
    memberCount: number;
};

export default function AddMemberDialogue({ isAddDialogOpen, setIsAddDialogOpen, setIsDropdownOpen, friendList, userId, groupId, groupMembers, memberCount }: AddMemberDialogueProps) {
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const handleMemberSelection = (memberId: string) => {
        setSelectedMembers((prev: string[]) =>
            prev.includes(memberId)
                ? prev.filter((id: string) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleConfirmAdd = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}api/groups/addMember`, {
                method: "POST",
                body: JSON.stringify({
                    userId: userId,
                    groupId: groupId,
                    memberCount: memberCount,
                    memberIds: selectedMembers,
                }),
            });
            const resMessage = await res.json();
            if (!res.ok) {
                toast.error(resMessage.error);
            } else {
                socket.emit("newGroup", {groupMembers: selectedMembers, groupId}); // Notify, add new members to room
                socket.emit("notificateGroup", {groupMembers: groupMembers.map((member) => member.id)}); // Notify to all group members
                setIsAddDialogOpen(false);
                setSelectedMembers([]);
                toast.success(resMessage.message);
            }
        } catch (error) {
            toast.error("Failed to add members!");
        }    
    };

    return (
        <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) setIsDropdownOpen(false);
            }}
        >
            <DialogContent className="sm:max-w-md ">
                <DialogHeader className=''>
                    <DialogTitle>Add Group Members</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-500 mb-4">Select friends you want to add to the group:</p>
                    <ScrollArea className="h-[200px] pr-4">
                        <ul className="space-y-2">
                            {friendList.map(friend => (
                                <li key={friend.id} className="flex items-center justify-between p-2 border-b">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={friend.image} alt={friend.name} />
                                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{friend.name}</span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleMemberSelection(friend.id)}
                                  className="w-20 flex items-center justify-center"
                                >
                                  {selectedMembers.includes(friend.id) ? (
                                    <>
                                      <X className="h-4 w-4 mr-1" />
                                      Cancel
                                    </>
                                  ) : (
                                    'Add'
                                  )}
                                </Button>
                              </li>
                              
                            ))}
                        </ul>
                    </ScrollArea>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsAddDialogOpen(false)}
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        onClick={handleConfirmAdd}
                        disabled={selectedMembers.length === 0}
                    >
                        Add Selected ({selectedMembers.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}