import { ReactNode } from "react";
import Link from "next/link";
import FriendList from "@/src/components/chat/(friend list)/friendList";
import { Notification } from "@/src/components/chat/(header)/notification";
import UserAvatarButton from "@/src/components/chat/(header)/userAvatarButton";
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="flex flex-col h-screen bg-purple-100">
      <header className="bg-purple-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ChatApp</h1>
        <div className="flex items-center space-x-4">
          <Notification/>
          <UserAvatarButton />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <FriendList userId={session?.user.id}/>
        {children}
      </div>

    </div>
  );
}
