/** Add fonts into your Next.js project:

import { Bricolage_Grotesque } from 'next/font/google'

bricolage_grotesque({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link"
import { Button } from "@/src/components/chat/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/src/components/chat/ui/dropdown-menu"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/chat/ui/avatar"
import { Badge } from "@/src/components/chat/ui/badge"
import { Input } from "@/src/components/chat/ui/input"

export default function chat() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:h-16 sm:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
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
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="border-r bg-muted/40 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Contacts</h2>
            <Button variant="ghost" size="icon">
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">Add contact</span>
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" size="sm">
              Friends
            </Button>
            <Button variant="ghost" size="sm">
              Groups
            </Button>
          </div>
          <ScrollArea className="mt-4 h-[calc(100vh-7rem)] max-h-[calc(100vh-7rem)]">
            <div className="grid gap-2">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="font-medium">Olivia Smith</div>
                  <p className="text-sm text-muted-foreground">Hey, how's it going?</p>
                </div>
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  3
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="font-medium">Liam Johnson</div>
                  <p className="text-sm text-muted-foreground">Did you see the latest update?</p>
                </div>
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  1
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="font-medium">Emma Davis</div>
                  <p className="text-sm text-muted-foreground">Let's discuss the project later.</p>
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="font-medium">Noah Wilson</div>
                  <p className="text-sm text-muted-foreground">I'll send you the files later today.</p>
                </div>
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  2
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="font-medium">Isabella Garcia</div>
                  <p className="text-sm text-muted-foreground">Let me know if you have any questions.</p>
                </div>
              </Link>
            </div>
          </ScrollArea>
        </aside>
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
              <div className="flex items-start gap-3 justify-end">
                <div className="flex-1 rounded-md bg-primary p-3 text-primary-foreground">
                  <p>I'm doing great, thanks for asking!</p>
                  <div className="mt-2 text-xs text-primary-foreground/80">3:46 PM</div>
                </div>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-md bg-muted p-3">
                  <p>Did you see the latest update?</p>
                  <div className="mt-2 text-xs text-muted-foreground">3:47 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3 justify-end">
                <div className="flex-1 rounded-md bg-primary p-3 text-primary-foreground">
                  <p>Yes, I just checked it out. Looks great!</p>
                  <div className="mt-2 text-xs text-primary-foreground/80">3:48 PM</div>
                </div>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
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
      </div>
    </div>
  )
}

function MessageCircleIcon(props) {
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


function MoveHorizontalIcon(props) {
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


function PhoneIcon(props) {
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


function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function SearchIcon(props) {
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


function VideoIcon(props) {
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


function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
