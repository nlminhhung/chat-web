'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/src/components/chat/ui/button";
import toast from 'react-hot-toast';
import socket from '@/src/lib/getSocket';
import { Bot } from 'lucide-react';

export default function ChatSummarizeButton({groupId, userId}: {groupId: string, userId: string}) {
    const [messages, setMessages] = useState<UserChatInformation[]>([]);

    const fetchLastestMessages = async () => {
      try {
        
      } catch (error) {
        toast.error("Failed to load messages!");
      }
    };
    
    useEffect(() => {
      fetchLastestMessages();
    }, []);

    return (
        <div>
            <Button
            variant="ghost"
            size="sm"
            className="flex gap-x-2 text-white hover:bg-purple-700">
          <p className="hidden md:inline">Summary</p><Bot/> 
        </Button>
        </div>
    )
}

