'use client'

import { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/src/components/chat/ui/dropdown-menu";
import { Button } from "@/src/components/chat/ui/button";
import { MoreVertical, Trash, UserMinus, UserPlus, UserCog } from 'lucide-react'
import RemoveMemberDialogue from './removeMemberDialogue';

// Mock data for group members
const groupMembers = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Brown' },
  { id: 4, name: 'Diana Prince' },
];

export default function GroupMenuButton() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

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
            <RemoveMemberDialogue isRemoveDialogOpen={isRemoveDialogOpen} setIsRemoveDialogOpen={setIsRemoveDialogOpen} setIsDropdownOpen={setIsDropdownOpen} groupMembers={groupMembers}/>     
        </div>
    )
}

