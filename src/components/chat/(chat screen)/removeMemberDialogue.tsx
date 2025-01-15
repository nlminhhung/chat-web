'use client'
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/chat/ui/dialog";
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import { Button } from "@/src/components/chat/ui/button";
import { X } from "lucide-react";
import toast from "react-hot-toast";

type RemoveMemberDialogueProps = {
    isRemoveDialogOpen: boolean;
    setIsRemoveDialogOpen: (open: boolean) => void;
    setIsDropdownOpen: (open: boolean) => void;
    groupMembers: UserChatInformation[];
    userId: string;
    groupId: string;
};

export default function RemoveMemberDialogue({isRemoveDialogOpen, setIsRemoveDialogOpen, setIsDropdownOpen, groupMembers, userId, groupId}: RemoveMemberDialogueProps) {
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const handleMemberSelection = (memberId: string) => {
        setSelectedMembers((prev: string[]) =>
            prev.includes(memberId)
                ? prev.filter((id: string) => id !== memberId)
                : [...prev, memberId]
        );
    };
    
    const handleConfirmRemove = async () => {
        console.log('Removing members:', selectedMembers);
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}api/groups/removeMember`, {
                method: "POST",
                body: JSON.stringify({
                    userId: userId,
                    groupId: groupId,
                    memberIds: selectedMembers,
                }),
            });
            const resMessage = await res.json();
            if (!res.ok) {
                toast.error(resMessage.error);
            }
        } catch(error){
            toast.error("Failed to remove members!");
        }

        setIsRemoveDialogOpen(false);
        setSelectedMembers([]);
        toast.success('Members removed successfully!');
    };

    return(
        <Dialog 
                open={isRemoveDialogOpen} 
                onOpenChange={(open) => {
                    setIsRemoveDialogOpen(open);
                    if (!open) setIsDropdownOpen(false);
                }}
            >
                <DialogContent className="sm:max-w-md ">
                    <DialogHeader className=''>
                        <DialogTitle>Remove Group Members</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-gray-500 mb-4">Select the members you want to remove from the group:</p>
                        <ScrollArea className="h-[200px] pr-4">
                            <ul className="space-y-2">
                                {groupMembers.map(member => (
                                    <li key={member.id} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{member.name}</span>
                                        <Button
                                            variant={selectedMembers.includes(member.id) ? "destructive" : "outline"}
                                            size="sm"
                                            onClick={() => handleMemberSelection(member.id)}
                                            className="w-20"
                                        >
                                            {selectedMembers.includes(member.id) ? (
                                                <>
                                                    <X className="h-4 w-4 mr-1" />
                                                    Cancel
                                                </>
                                            ) : (
                                                'Remove'
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
                            onClick={() => setIsRemoveDialogOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmRemove}
                            disabled={selectedMembers.length === 0}
                        >
                            Remove Selected ({selectedMembers.length})
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    )
}