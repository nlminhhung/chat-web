'use client'
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/chat/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/src/components/chat/ui/dropdown-menu"
import { Button } from "@/src/components/chat/ui/button"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"
import { Input } from "@/src/components/chat/ui/input"
import { useEffect } from "react"
import socket from "@/src/lib/getSocket"

export default function ChatScreen({userId}: {userId:string}){
  useEffect(() => {
    socket.emit('registerUsers', userId);
    // return () => {
    //   socket.disconnect();
    //   console.log('Disconnecting from WebSocket');
    // };
  }, []);
  return (
        <main className="flex flex-1 flex-col">
          <div className="border-b bg-muted/40 p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">Olivia Smith</div>
                <p className="text-sm text-muted-foreground">Last seen 2 hours ago</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <PhoneIcon className="h-5 w-5" />
                  <span className="sr-only">Call</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <VideoIcon className="h-5 w-5" />
                  <span className="sr-only">Video call</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoveHorizontalIcon className="h-5 w-5" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Mute conversation</DropdownMenuItem>
                    <DropdownMenuItem>Delete conversation</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-md bg-muted p-3">
                  <p>Hey, how's it going?</p>
                  <div className="mt-2 text-xs text-muted-foreground">3:45 PM</div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="border-t bg-muted/40 p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <Input type="text" placeholder="Type your message..." className="flex-1" />
              <Button>Send</Button>
            </div>
          </div>
        </main>
    )
}


function VideoIcon(props : any) {
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
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </svg>
    )
  }

function MoveHorizontalIcon(props : any) {
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
        <polyline points="18 8 22 12 18 16" />
        <polyline points="6 8 2 12 6 16" />
        <line x1="2" x2="22" y1="12" y2="12" />
      </svg>
    )
  }

function PhoneIcon(props : any) {
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    )
  }