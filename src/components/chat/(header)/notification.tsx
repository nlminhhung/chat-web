"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/src/components/chat/ui/dropdown-menu";
import { Button } from "@/src/components/chat/ui/button";
import {FC} from "react"

interface NotificationProps{
  friendRequests: FriendRequest[],
} 

export const Notification:FC<NotificationProps> = ({friendRequests}) => {
  // const [pNOfRequest, setPNOfRequest] = useState<number>(nOfRequest);
  const nOfRequest = friendRequests.length;
  console.log("Notif", friendRequests)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative" variant={"ghost"} size="icon">
            {nOfRequest > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {nOfRequest}
              </span>
            ) : null}
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">friend-request</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>My Notification</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <>{
            friendRequests.map((req)=>{
              <DropdownMenuItem key={req.user.id}>
                
              </DropdownMenuItem>

            })
          }
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

function BellIcon(props: any) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
