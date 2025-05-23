import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import MessageInterface from "@/src/components/chat/(chat screen)/messageInterface";
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
  let group;
  if (userId !== session!.user.id) {
    redirect("/chat");
  }
    try {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getChatGroup?groupId=${groupId}`,
    {
      method: "GET",
      headers: headers(),
      cache: "no-store", 
    }
  );

  const data = await response.json();

  if (response.status === 403 && data.error === "You are not a member of this group!") {
    console.error("Access denied:", data.error);
    redirect("/chat");
  }

  if (!response.ok || !data) {
    console.error("Failed to fetch group:", data);
    redirect("/chat");
  }

  group = data;

} catch (error) {
  console.error("Unexpected error while fetching group:", error);
  redirect("/chat");
}

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {group && <><GroupLayoutFetch userName={session?.user.name} group={group} groupId={groupId} userId={userId}/>
      <MessageInterface
        friend={group!}
        user={{
          id: session?.user.id,
          name: session?.user.name,
          image: session?.user.image,
        }}
        chatType="group"
      /></>}
      {children}
    </div>
  );
}
