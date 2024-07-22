import { ReactNode } from "react";
import { Button } from "@/src/components/chat/ui/button"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/src/components/chat/ui/dropdown-menu"
import Link from "next/link"
import ChatList from "@/src/components/chat/(chat list)/chatList"


interface LayoutProps {
    children: ReactNode;
  }

export default function Layout({ children } : LayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <div className=" top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:h-16 sm:px-6">
                <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <MessageCircleIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">Messaging App</span>
                </Link>
                <nav className="hidden items-center gap-4 sm:flex">
                <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground" prefetch={false}>
                    Home
                </Link>
                <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground" prefetch={false}>
                    Conversations
                </Link>
                <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground" prefetch={false}>
                    Contacts
                </Link>
                <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground" prefetch={false}>
                    Settings
                </Link>
                </nav>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <SearchIcon className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <img src="/placeholder.svg" width="32" height="32" className="rounded-full" alt="Avatar" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <ChatList />
              {children}
            </div>

        </div>
    )
  }

  function MessageCircleIcon(props : any) {
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
    )
}


function SearchIcon(props : any) {
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    )
}