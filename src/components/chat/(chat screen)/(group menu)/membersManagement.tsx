"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/chat/ui/avatar"
import { Badge } from "@/src/components/chat/ui/badge"
import { Button } from "@/src/components/chat/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/chat/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/chat/ui/dropdown-menu"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"
import { Separator } from "@/src/components/chat/ui/separator"
import { Crown, MoreVertical, Shield, UserPlus, UserMinus, Users, Calendar, Trash2 } from "lucide-react"
import AddMemberDialogue from "./addMemberDialogue"
import RemoveMemberDialogue from "./removeMemberDialogue"
import toast from "react-hot-toast"
import socket from "@/src/lib/getSocket"
import Image from "next/image"

type MembersManagementProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    setIsDropdownOpen: (open: boolean) => void;
    friendList: UserChatInformation[];
    groupMembers: UserChatInformation[];
    userId: string;
    groupId: string;
    groupName: string;
    memberCount: number;
    createdAt: string;
    leader: string;
};

export default function MembersManagement({ isOpen, setIsOpen, setIsDropdownOpen, friendList, groupMembers, userId, groupId, groupName, memberCount, createdAt, leader }: MembersManagementProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

    const handleRemoveMember = async (memberId: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}api/groups/removeMember`, {
            method: "POST",
            body: JSON.stringify({
                userId: userId,
                groupId: groupId,
                memberIds: memberId,
            }),
        });
        const resMessage = await res.json();
        if (!res.ok) {
            toast.error(resMessage.error);
        } else {  
            socket.emit("leaveGroup", {userId: memberId, groupId});
            socket.emit("notificateGroup", {groupMembers: groupMembers.map((member) => member.id)});
            setIsRemoveDialogOpen(false);
            toast.success(resMessage.message);
        }
    }

    const handleMakeLeader = async (memberId: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}api/groups/makeLeader`, {
            method: "POST",
            body: JSON.stringify({
                userId: userId,
                groupId: groupId,
                memberId: memberId,
            }),
        });
        const resMessage = await res.json();
        if (!res.ok) {
            toast.error(resMessage.error);
        } else {  
            socket.emit("notificateGroup", {groupMembers: groupMembers.map((member) => member.id)});
            setIsRemoveDialogOpen(false);
            toast.success(resMessage.message);
        }

    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="flex-row justify-between items-start space-y-0">
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            {groupName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {groupMembers.length} members
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Created {new Date(Number(createdAt)).toLocaleString()}
                            </div>
                        </div>
                        {userId == leader && (
                            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="w-full">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Members
                            </Button>
                        )}
                        {userId == leader && (
                            <Button onClick={() => setIsRemoveDialogOpen(true)} variant="outline" className="w-full">
                                <UserMinus className="mr-2 h-4 w-4" />
                                Remove Members
                            </Button>
                        )}
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-2">
                                {groupMembers
                                    .sort((a, b) => (a.id === leader ? -1 : b.id === leader ? 1 : 0)) // leader always show up top
                                    .map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-accent"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <Image src={member.image}
                                                                            alt={member.name}
                                                                            width={40}
                                                                            height={40}
                                                                            className="rounded-full object-cover"/>
                                                    <AvatarFallback>
                                                        {member.name.split(" ").map((n) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{member.name}</span>
                                                        {member.id == leader && (
                                                            <Badge variant="secondary" className="gap-1">
                                                                <Crown className="h-3 w-3" />
                                                                Leader
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {member.id == leader ? "Group Leader" : "Member"}
                                                    </p>
                                                </div>
                                            </div>
                                            {userId == leader && !(member.id == leader) && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" tabIndex={0}>
                                                            <MoreVertical className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleMakeLeader(member.id)}>
                                                            <Crown className="mr-2 h-4 w-4" />
                                                            Make Leader
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleRemoveMember(member.id)}
                                                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                        >
                                                            Remove Member
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </ScrollArea>
                        {/* {userId == leader && (
                            <Button onClick={() => setShowDeleteAlert(true)} variant="destructive" className="w-full">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Group
                            </Button>
                        )} */}
                    </div>
                </DialogContent>
            </Dialog>

            <AddMemberDialogue isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} setIsDropdownOpen={setIsDropdownOpen} memberCount={memberCount} groupMembers={groupMembers} friendList={friendList} userId={userId} groupId={groupId} />
            <RemoveMemberDialogue isRemoveDialogOpen={isRemoveDialogOpen} setIsRemoveDialogOpen={setIsRemoveDialogOpen} setIsDropdownOpen={setIsDropdownOpen} memberCount={memberCount} groupMembers={groupMembers} userId={userId} groupId={groupId} />

            {/* <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the group and remove all members from it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteGroup}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Group
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}
        </>
    )
}