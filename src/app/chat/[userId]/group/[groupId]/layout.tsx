import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import { headers } from "next/headers";
import MessageInterface from "@/src/components/chat/(chat screen)/messageInterface";
import GroupMenuButton from "@/src/components/chat/(chat screen)/(group menu)/groupMenuButton";
import ChatSummarizeButton from "@/src/components/chat/(chat screen)/chatSummarizeButton";
import GroupLayoutFetch from "@/src/components/chat/(chat screen)/groupLayoutFetch";
interface LayoutProps {
  children: ReactNode;
  params: {
    groupId: string;
    userId: string;
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await getServerSession(authOptions);
  const groupId = params.groupId;
  const userId = params.userId;

  if (userId !== session!.user.id) {
    redirect("/chat");
  }
  const group = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getChatGroup?groupId=${groupId}`,
    {
      method: "GET",
      headers: headers()
    }
  ) 
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      redirect("/chat");
    });

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <GroupLayoutFetch group={group} groupId={groupId} userId={userId}/>
      <MessageInterface
        friend={group!}
        user={{
          id: session?.user.id,
          name: session?.user.name,
          image: session?.user.image,
        }}
        chatType="group"
      />
      {children}
    </div>
  );
}
