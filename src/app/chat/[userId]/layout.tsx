import { ReactNode } from "react";
import FriendList from "@/src/components/chat/(friend list)/friendList";
import { Notification } from "@/src/components/chat/(header)/notification";
import UserAvatarButton from "@/src/components/chat/(header)/userAvatarButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { SidebarProvider } from "@/src/lib/context/sideBarContext";
import Link from "next/link";
import { redirect } from "next/navigation";
import MenuButton from "@/src/components/chat/(chat screen)/menuButton";


interface LayoutProps {
  children: ReactNode;
  params: {
    userId: string;
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await getServerSession(authOptions);
  const userId = params.userId;
  if (userId !== session!.user.id) {
    redirect("/chat");
  }
  return (
    <div className="flex flex-col h-screen bg-purple-100">
      <SidebarProvider>
        <header className="bg-purple-800 text-white p-4 flex justify-between items-center">
          <MenuButton />
          <Link href="/chat">
            <h1 className="text-2xl font-bold">ChatterBox</h1>
          </Link>

          <div className="flex items-center space-x-4">
            <Notification userId={session?.user.id} />
            <UserAvatarButton />
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <FriendList userId={session?.user.id} />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
