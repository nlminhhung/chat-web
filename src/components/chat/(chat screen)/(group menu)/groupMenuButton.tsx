'use client'

import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/src/components/chat/ui/dropdown-menu";
import { Button } from "@/src/components/chat/ui/button";
import { DoorOpen, Menu, UserCog, Users } from 'lucide-react'
import MembersManagement from './membersManagement';
import toast from 'react-hot-toast';
import LeaveGroupDialogue from './leaveGroupDialogue';
import socket from '@/src/lib/getSocket';

export default function GroupMenuButton({groupId, userId, groupName, memberCount, createdAt}: {groupId: string, userId: string, groupName: string, memberCount: number, createdAt: string, leader: string}) {
    const [groupMembers, setGroupMembers] = useState<UserChatInformation[]>([])
    const [friendList, setFriendList] = useState<UserChatInformation[]>([]);
    const [leader, setLeader] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isGroupManagementOpen, setIsGroupManagementOpen] = useState(false);
    const [isleaveGroupOpen, setIsLeaveGroupOpen] = useState(false);

    const fetchGroupMembers = async () => {
      try {
        const [membersRes, friendsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/getGroupMembers?groupId=${groupId}`, {
            method: "GET",
          }),
          fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/friendList`, {
            method: "GET",
          }),
        ]);
        
        if (!membersRes.ok || !friendsRes.ok) {
          return;
        }
        
        const membersData = await membersRes.json(); // Now includes { leaderId, membersInfo }
        const friends = await friendsRes.json();
        
        setGroupMembers(membersData.membersInfo); // Access the nested membersInfo
        setLeader(membersData.leader); // Access the leaderId
        // Filter out group members from friend list based on ID
        const memberIds = membersData.membersInfo.map((member: UserChatInformation) => member.id);
        setFriendList(friends.filter((friend: UserChatInformation) => !memberIds.includes(friend.id)));
        
      } catch (error) {
        toast.error("Failed to fetch members!");
      }
    };
    
    useEffect(() => {
      fetchGroupMembers();
      socket.on("groups", fetchGroupMembers);
      return () => {
        socket.off("groups", fetchGroupMembers);
      };
    }, []);

    const handleGroupManagement = () => {
      setIsDropdownOpen(false);
      setIsGroupManagementOpen(true);
    };
    const handleLeaveGroup = () => {
      setIsDropdownOpen(false);
      setIsLeaveGroupOpen(true);
    };
    return (
        <div>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-purple-700">
                  <Menu className="h-5 w-5" />
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
                <DropdownMenuItem className="text-red-600" onSelect={handleLeaveGroup}>
                  <DoorOpen className="mr-2 h-4 w-4" />
                  <span>Leave group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>  
           
            <MembersManagement isOpen={isGroupManagementOpen} setIsOpen={setIsGroupManagementOpen} setIsDropdownOpen={setIsDropdownOpen} friendList={friendList} groupMembers={groupMembers} userId={userId} groupId={groupId} groupName={groupName} memberCount={memberCount} createdAt={createdAt} leader={leader} />
            <LeaveGroupDialogue isOpen={isleaveGroupOpen} setIsOpen={setIsLeaveGroupOpen} setIsDropdownOpen={setIsDropdownOpen} userId={userId} groupId={groupId} groupMembers={groupMembers} memberCount={memberCount} groupName={groupName} leader={leader}/>
        </div>
    )
}

