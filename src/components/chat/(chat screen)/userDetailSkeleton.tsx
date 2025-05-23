import { Skeleton } from "@/src/components/chat/ui/skeleton"
export default function UserDetailSkeleton() {
  return (    
      <div className="bg-purple-600/80 text-white shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {/* Avatar skeleton */}
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <div>
              {/* Name skeleton */}
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          {/* Delete button skeleton */}
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
  )
}

