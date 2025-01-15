'use client'

import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/src/components/chat/ui/dropdown-menu";
import { Button } from "@/src/components/chat/ui/button";
import { MoreVertical, Trash, UserMinus, UserPlus, UserCog } from 'lucide-react'
import RemoveMemberDialogue from './removeMemberDialogue';
import toast from 'react-hot-toast';

export default function GroupMenuButton({groupId, userId}: {groupId: string, userId: string}) {
    const [groupMembers, setGroupMembers] = useState<UserChatInformation[]>([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

    const fetchGroupMembers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}api/groups/getGroupMembers?groupId=${groupId}`, {
          method: "GET",
        })
        if (!res.ok) {   
          return; 
        }
        const data = await res.json();
        setGroupMembers(data.filter((member: UserChatInformation) => member.id !== userId));
        return data;
      } catch (error) {
        toast.error("Failed to fetch members!");
      }
    };

    useEffect(() => {
        fetchGroupMembers();
    }, []);

    const handleRemoveMember = () => {
        setIsDropdownOpen(false);
        setIsRemoveDialogOpen(true);
    };

    return (
        <div>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-purple-700">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add new member</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Leave group</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleRemoveMember}>
                  <UserMinus className="mr-2 h-4 w-4" />
                  <span>Remove member</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Give leadership</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>  
            <RemoveMemberDialogue isRemoveDialogOpen={isRemoveDialogOpen} setIsRemoveDialogOpen={setIsRemoveDialogOpen} setIsDropdownOpen={setIsDropdownOpen} groupMembers={groupMembers} userId={userId} groupId={groupId}/>     
        </div>
    )
}

