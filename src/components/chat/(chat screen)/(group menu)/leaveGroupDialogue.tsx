"use client"

import * as React from "react"
import { Button } from "@/src/components/chat/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/chat/ui/dialog"
import toast from "react-hot-toast"
import socket from "@/src/lib/getSocket"

type LeaveGroupDialogueProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsDropdownOpen: (open: boolean) => void;
  userId: string;
  groupId: string;
  groupMembers: UserChatInformation[];
  groupName: string;
  memberCount: number;
  leader: string;
};

export default function LeaveGroupDialog({ isOpen, setIsOpen, setIsDropdownOpen, userId, groupId, groupMembers, groupName, memberCount }: LeaveGroupDialogueProps) {
  const handleLeaveGroup = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}api/groups/leave`, {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          groupId: groupId,
          memberCount: memberCount,
        }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      }
      else {
        setIsOpen(false);
        const groupMemberIds = groupMembers.map((member) => member.id).filter((id) => id !== userId);
        socket.emit("notificateGroup", {groupMembers: groupMemberIds});
        socket.emit("leaveGroup", {userId, groupId});
        toast.success(resMessage.message);
      }
    } catch (error) {
      toast.error("Failed to leave the group!");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Group</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this group? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLeaveGroup}>
            Leave Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

