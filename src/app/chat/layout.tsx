import { ReactNode } from "react";
import Link from "next/link";
import ChatList from "@/src/components/chat/(chat list)/chatList";
import { Notification } from "@/src/components/chat/(header)/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import NotFound from "../not-found";
import { headers } from "next/headers";
import UserAvatarButton from "@/src/components/chat/(header)/userAvatarButton";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  console.log(session?.user)

  if (!session) NotFound();

 
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className=" top-0 z-30 flex h-14 items-center justify-between border-b bg-[#00B894] px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <MessageCircleIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Messaging App</span>
        </Link>
        <nav className="hidden items-center gap-4 sm:flex">
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            Conversations
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            Contacts
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Notification />
          <UserAvatarButton />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ChatList />
        {children}
      </div>
    </div>
  );
}

function MessageCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}