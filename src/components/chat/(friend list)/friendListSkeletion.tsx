import { Skeleton } from "@/src/components/chat/ui/skeleton"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"

interface ChatListSkeletonProps {
  activeList: "friends" | "groups"
  itemCount?: number
}

export function ChatListSkeleton({ activeList, itemCount = 5 }: ChatListSkeletonProps) {
  return (
    <ScrollArea className="h-[calc(100vh-9rem)]">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className="p-4 border-b border-purple-600 hover:bg-purple-500/10 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {/* Avatar skeleton */}
            <Skeleton className="w-10 h-10 rounded-full" />

            <div className="flex-1 min-w-0">
              {/* Name skeleton */}
              <Skeleton className="h-4 w-24 mb-2" />

              {/* Last message or empty space for groups */}
              {activeList === "friends" && <Skeleton className="h-3 w-36" />}
            </div>

            {/* Online status or member count */}
            {activeList === "friends" ? (
              <Skeleton className="w-2 h-2 rounded-full" />
            ) : (
              <Skeleton className="h-3 w-16" />
            )}
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}

