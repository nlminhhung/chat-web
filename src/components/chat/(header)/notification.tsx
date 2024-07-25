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
import { FC } from "react";
import { Badge } from "@/src/components/chat/ui/badge";

interface NotificationProps {
  nOfRequest: number;
}

export const Notification: FC<NotificationProps> = ({ nOfRequest }) => {
  return (
    <>
      {nOfRequest > 0 ? (
        <Badge variant="destructive" className="px-2 py-1 text-xs">
          {nOfRequest}
        </Badge>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={nOfRequest > 0 ? "destructive" :"ghost"}  size="icon">
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">friend-request</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>My Notification</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          {/* <DropdownMenuItem>Logout</DropdownMenuItem> */}
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
