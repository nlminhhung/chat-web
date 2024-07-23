import Link from "next/link"
import { Button } from "@/src/components/chat/ui/button"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/chat/ui/avatar"
import { Badge } from "@/src/components/chat/ui/badge"


export default function ChatList()  {
    return (
    <aside className="border-r bg-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Contacts</h2>
            <Button variant="ghost" size="icon">
              <Link href="chat/add-friend">
                <PlusIcon className="h-5 w-5" />
                <span className="sr-only">Add contact</span>
              </Link>
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
            </div>
          </ScrollArea>
        </aside>
    )
}

function PlusIcon(props : any) {
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