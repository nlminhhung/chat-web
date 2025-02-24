'use client'

import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/src/components/chat/ui/dropdown-menu";
import { Button } from "@/src/components/chat/ui/button";
import { MoreVertical, DoorOpen, UserMinus, UserPlus, UserCog, Users } from 'lucide-react'
import RemoveMemberDialogue from './removeMemberDialogue';
import MembersManagement from './membersManagement';
import toast from 'react-hot-toast';
import AddMemberDialogue from './addMemberDialogue';

export default function GroupMenuButton({groupId, userId, groupName, memberCount, createdAt, leader}: {groupId: string, userId: string, groupName: string, memberCount: number, createdAt: string, leader: string}) {
    const [groupMembers, setGroupMembers] = useState<UserChatInformation[]>([])
    const [friendList, setFriendList] = useState<UserChatInformation[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    // const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isGroupManagementOpen, setIsGroupManagementOpen] = useState(false);

    
    const fetchGroupMembers = async () => {
      try {
        const [membersRes, friendsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}api/groups/getGroupMembers?groupId=${groupId}`, {
            method: "GET",
          }),
          fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/friendList`, {
            method: "GET",
          }),
        ]);
    
        if (!membersRes.ok || !friendsRes.ok) {
          return;
        }
    
        const members = await membersRes.json();
        const friends = await friendsRes.json();
    
        setGroupMembers(members);
    
        // Filter out group members from friend list based on ID
        const memberIds = members.map((member: UserChatInformation) => member.id);
        setFriendList(friends.filter((friend: UserChatInformation) => !memberIds.includes(friend.id)));
      } catch (error) {
        toast.error("Failed to fetch members!");
      }
    };
    

    useEffect(() => {
      fetchGroupMembers();
    }, []);

    // const handleRemoveMember = () => {
    //     setIsDropdownOpen(false);
    //     setIsRemoveDialogOpen(true);
    // };

    // const handleAddMember = () => {
    //   setIsDropdownOpen(false);
    //   setIsAddDialogOpen(true);
    // };

    const handleGroupManagement = () => {
      setIsDropdownOpen(false);
      setIsGroupManagementOpen(true);
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
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Setting</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleGroupManagement}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Members Management</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <DoorOpen className="mr-2 h-4 w-4" />
                  <span>Leave group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>  
            {/* <AddMemberDialogue isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} setIsDropdownOpen={setIsDropdownOpen} friendList={friendList} userId={userId} groupId={groupId}/>
            <RemoveMemberDialogue isRemoveDialogOpen={isRemoveDialogOpen} setIsRemoveDialogOpen={setIsRemoveDialogOpen} setIsDropdownOpen={setIsDropdownOpen} groupMembers={groupMembers} userId={userId} groupId={groupId}/>      */}
            <MembersManagement isOpen={isGroupManagementOpen} setIsOpen={setIsGroupManagementOpen} setIsDropdownOpen={setIsDropdownOpen} friendList={friendList} groupMembers={groupMembers} userId={userId} groupId={groupId} groupName={groupName} memberCount={memberCount} createdAt={createdAt} leader={leader} />
        </div>
    )
}

