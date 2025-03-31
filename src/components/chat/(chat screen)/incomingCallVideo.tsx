"use client"

import { useState } from "react"
import { Phone, PhoneOff, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

export default function IncomingCallDialog({ friendId, userId, friendName }: { friendId: string, userId: string, friendName: string }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleAccept = () => {
    // Handle accept call logic here
    setIsVisible(false)
    console.log("Call accepted")
  }

  const handleDecline = () => {
    // Handle decline call logic here
    setIsVisible(false)
    console.log("Call declined")
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md overflow-hidden border-2 border-purple-600">
        <div className="bg-white px-6 py-4 text-center text-gray-900">
          <div className="mb-2 flex items-center justify-center">
            <Video className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Incoming Video Call</span>
          </div>
          <div className="flex justify-center">
            <div className="pulse-animation relative flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Caller" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <h3 className="mt-4 text-xl font-semibold">Jane Doe</h3>
          <p className="text-sm text-gray-500">is calling you...</p>
        </div>
        <CardContent className="grid grid-cols-2 gap-4 p-6 bg-black">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={handleDecline}
          >
            <PhoneOff className="h-4 w-4" />
            Decline
          </Button>
          <Button
            className="flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600"
            onClick={handleAccept}
          >
            <Phone className="h-4 w-4" />
            Accept
          </Button>
        </CardContent>
      </Card>

      <style jsx global>{`
        .pulse-animation::before {
          content: '';
          position: absolute;
          border: 1px solid rgba(128, 90, 213, 0.3);
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          70% {
            transform: scale(1.1);
            opacity: 0;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

