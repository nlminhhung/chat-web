import { Skeleton } from "@/src/components/chat/ui/skeleton"
import { ScrollArea } from "@/src/components/chat/ui/scroll-area"

export function MessageListSkeleton({ messageCount = 5 }: { messageCount?: number }) {
    return (
      <ScrollArea className="flex-1 p-4 h-50 overflow-auto">
        <div className="space-y-4">
          {/* Generate alternating sent and received message skeletons */}
          {Array.from({ length: messageCount }).map((_, index) => {
            const isUserMessage = index % 2 === 0
            const isImageMessage = index % 5 === 3 // Every 5th message is an image
  
            return (
              <div key={index} className={`flex group ${isUserMessage ? "justify-end" : "justify-start"} bg-gray-300 p-2 rounded-lg shadow-sm`}>
                <div
                  className={`flex flex-col ${isUserMessage ? "items-end" : "items-start"} max-w-[70%] sm:max-w-[60%] p-2 rounded-lg shadow-sm`}
                >
                  {/* User info with avatar */}
                  <div className="flex items-center space-x-2 mb-1 ">
                    {!isUserMessage && <Skeleton className="w-6 h-6 rounded-full " />}
                    <Skeleton className="h-4 w-24" />
                    {isUserMessage && <Skeleton className="w-6 h-6 rounded-full" />}
                  </div>
  
                  {/* Message content */}
                  {isImageMessage ? (
                    <Skeleton className="h-40 w-56 rounded-lg " />
                  ) : (
                    <Skeleton className={`h-${10 + (index % 3) * 4} w-${36 + (index % 4) * 8} rounded-lg `} />
                  )}
  
                  {/* Timestamp */}
                  <div className="flex items-center mt-1">
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
  
                {/* Empty space for dropdown menu */}
                <div className="w-8"></div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  }
