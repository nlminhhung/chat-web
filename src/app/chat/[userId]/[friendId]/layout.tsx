import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";
import { Button } from "@/src/components/chat/ui/button";
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import MessageInterface from "@/src/components/chat/(chat screen)/messageInterface";
import { headers } from "next/headers";

interface LayoutProps {
  children: ReactNode;
  params: {
    friendId: string;
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await getServerSession(authOptions);
  const friendId = params.friendId;
  console.log(friendId)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/getChat?friendId=${friendId}`,
    {
      method: "GET",
      headers:headers()
    }
  );
  if (!res.ok) {
    redirect("/chat");
  }
  const friend = await res.json();

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-purple-600 text-white shadow-sm z-10">
        <div className="px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            // onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          > Menu Button
            {/* {isSidebarOpen ? (
            <X className="h-6 w-6" />
            ) : (
            <Menu className="h-6 w-6" />
            )} */}
          </Button>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={friend?.image} alt={friend?.name} />
            <AvatarFallback>{friend?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{friend?.name}</h1>
            <p className="text-sm text-purple-200">Last online</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4 bg-purple-50">
        <div className="space-y-4">
          <MessageInterface friend={friend!} user={{id: session?.user.id, name: session?.user.name, image: session?.user.image}}/>
        </div>
      </ScrollArea>
      {children}
    </div>
  );
}
