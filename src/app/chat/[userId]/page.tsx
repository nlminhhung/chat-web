"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/chat/ui/button";
import Image from "next/image";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/chat/ui/avatar";

export default function WelcomePage() {
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  const fetchSuggestedUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/friends/suggest`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setSuggestedUsers(data);
    } catch (error) {
      console.error("Failed to fetch suggested friends list", error);
    }
  };

  const handleAddFriend = (friendId: string) => {
    
    setSuggestedUsers(suggestedUsers.filter((user) => user.id !== friendId));
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-purple-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-purple-900 sm:text-5xl md:text-6xl text-center">
          Welcome back!
        </h1>
        <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/onggia.jpg"
            alt="Friends chatting"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <p className="mt-3 text-base text-purple-700 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl text-center">
          Ready to connect with more people? Start expanding your network today!
        </p>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4 text-center">
            Suggested Friends
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-md mx-auto">
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col items-center space-y-2 transition-opacity duration-300 ease-in-out"
              >
                <Avatar className="w-15 h-15">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="truncate text-sm font-medium text-purple-800">
                  {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddFriend(user.id)}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
