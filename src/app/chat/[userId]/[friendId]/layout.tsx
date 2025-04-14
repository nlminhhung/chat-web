import { ReactNode, Suspense } from "react";
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
import DeleteFriendButton from "@/src/components/chat/(chat screen)/deleteFriendButton"
import UserDetailSkeleton from "@/src/components/chat/(chat screen)/userDetailSkeleton";
import {CallVideoButton} from "@/src/components/chat/(chat screen)/callVideoButton";

interface LayoutProps {
  children: ReactNode;
  params: {
    friendId: string;
    userId: string;
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await getServerSession(authOptions);
  const friendId = params.friendId;
  const userId = params.userId;

  if (userId !== session!.user.id) {
    redirect("/chat");
  }
  const friend = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getChatUser?friendId=${friendId}`,
    {
      method: "GET",
      headers: headers(),
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
      {!friend ? (<UserDetailSkeleton />) : (<div className="bg-purple-600 text-white shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={friend?.image} alt={friend?.name} />
              <AvatarFallback>{friend?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl truncate font-semibold">{friend?.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-x-2 ml-auto">
            <DeleteFriendButton friendId={friendId} />
            <CallVideoButton friendName={friend?.name} friendId={friendId} userId={userId}/>
          </div>
        </div>
      </div>)}
      <MessageInterface
        friend={friend!}
        user={{
          id: session?.user.id,
          name: session?.user.name,
          image: session?.user.image,
        }}
        chatType="direct"
      />
      {children}
    </div>
  );
}
