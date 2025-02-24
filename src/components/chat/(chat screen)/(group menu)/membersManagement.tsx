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
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"
import { Separator } from "@/src/components/chat/ui/separator"
import { Crown, MoreVertical, Shield, UserPlus, UserMinus, Users, Calendar, Trash2 } from "lucide-react"
import AddMemberDialogue from "./addMemberDialogue"
import RemoveMemberDialogue from "./removeMemberDialogue"
import toast from "react-hot-toast"

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
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleRemoveMember = (memberId: string) => {
        // Implement remove member logic
        console.log("Remove member", memberId)
    }

    const handleMakeLeader = (memberId: string) => {
        // Implement make leader logic
        console.log("Make leader", memberId)
        console.log("leader id", leader)

    }

    const handleMemberSelection = (memberId: string) => {
        setSelectedMembers((prev: string[]) =>
            prev.includes(memberId)
                ? prev.filter((id: string) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleDeleteGroup = () => {
        // Implement delete group logic
        console.log("Delete group")
        setShowDeleteAlert(false)
        setIsOpen(false)
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
                                {memberCount} members
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
                                Add Member
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
                                                    <AvatarImage src={member.image} />
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
                        {userId == leader && (
                            <Button onClick={() => setShowDeleteAlert(true)} variant="destructive" className="w-full">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Group
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <AddMemberDialogue isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} setIsDropdownOpen={setIsDropdownOpen} memberCount={memberCount} friendList={friendList} userId={userId} groupId={groupId} />
            <RemoveMemberDialogue isRemoveDialogOpen={isRemoveDialogOpen} setIsRemoveDialogOpen={setIsRemoveDialogOpen} setIsDropdownOpen={setIsDropdownOpen} memberCount={memberCount} groupMembers={groupMembers} userId={userId} groupId={groupId}/>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
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
            </AlertDialog>
        </>
    )
}