"use client"
import { useEffect, useState } from "react"
import { Avatar, AvatarImage } from "@/src/components/chat/ui/avatar"

import GroupMenuButton from "@/src/components/chat/(chat screen)/(group menu)/groupMenuButton";
import ChatSummarizeButton from "@/src/components/chat/(chat screen)/chatSummarizeButton";

import socket from "@/src/lib/getSocket";
import { GroupCallVideoButton } from "./groupCallVideoButton";


export default function GroupLayoutFetch({ userName, group, groupId, userId }: { userName: string, group: Group, groupId: string, userId: string }) {
    const [groupData, setGroupData] = useState<Group>(group)
    useEffect(() => {
        setGroupData(group);
        socket.on("groups", fetchGroupDetail);
        
        return () => {
            socket.off("groups", fetchGroupDetail);
        };
    }, [])
    const fetchGroupDetail = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getChatGroup?groupId=${groupId}`,
                {
                    method: "GET",
                }
            )
            const data = await res.json();
            setGroupData(data);
        } catch (error) {
            console.error("Failed to fetch group detail:", error)
        }
    }

    return (
      <div className="bg-purple-600 text-white shadow-sm z-10">
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={groupData!.image} />
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-semibold truncate max-w-[150px] md:truncate-none md:max-w-full">{groupData!.name}</h1>
                    </div>
                </div>
                <div className={"flex items-center space-x-2"}>
                    <GroupCallVideoButton userName={userName} groupId={groupId} groupName={groupData.name} userId={userId} />
                    <ChatSummarizeButton groupId={groupId} userId={userId} />
                    <GroupMenuButton groupImage={groupData!.image} groupId={groupId} userId={userId} groupName={groupData!.name} memberCount={groupData!.memberCount} createdAt={groupData!.createdAt} leader={groupData!.leader} />
                </div>
            </div>
        </div>
    )
}

