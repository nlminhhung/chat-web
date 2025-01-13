'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/chat/ui/dialog";
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import { Button } from "@/src/components/chat/ui/button";
import { X } from "lucide-react";

type GroupMember = {
    id: number;
    name: string;
};

type RemoveMemberDialogueProps = {
    isRemoveDialogOpen: boolean;
    setIsRemoveDialogOpen: (open: boolean) => void;
    setIsDropdownOpen: (open: boolean) => void;
    groupMembers: GroupMember[];
};


export default function RemoveMemberDialogue({isRemoveDialogOpen, setIsRemoveDialogOpen, setIsDropdownOpen, groupMembers}: RemoveMemberDialogueProps) {
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    

    const handleMemberSelection = (memberId: number) => {
        setSelectedMembers((prev: number[]) =>
            prev.includes(memberId)
                ? prev.filter((id: number) => id !== memberId)
                : [...prev, memberId]
        );
    };
    
    const handleConfirmRemove = () => {
        console.log('Removing members:', selectedMembers);
        setIsRemoveDialogOpen(false);
        setSelectedMembers([]);
    };

    return(
        <Dialog 
                open={isRemoveDialogOpen} 
                onOpenChange={(open) => {
                    setIsRemoveDialogOpen(open);
                    if (!open) setIsDropdownOpen(false);
                }}
            >
                <DialogContent className="sm:max-w-md bg-red-500">
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