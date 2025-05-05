'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/src/components/chat/ui/button";
import toast from 'react-hot-toast';
import socket from '@/src/lib/getSocket';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Bot, AlertCircle } from 'lucide-react';


export default function ChatSummarizeButton({groupId, userId}: {groupId: string, userId: string}) {
    const [chatSummary, setChatSummary] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleSummarize = async () => {
      setOpen(true)
      setLoading(true)
      setError(false)
  
      try {
        const res = await fetch(`/api/chat/summarizeGroupMessages?groupId=${groupId}`, {
          method: "GET"
        });
      
        if (!res.ok) toast.error("Failed to fetch");
      
        const data = await res.json(); 
        setChatSummary(data.summary);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    return (
        <div>
            <Button onClick={handleSummarize} variant="ghost" size="sm" className="flex gap-x-2 text-white hover:bg-purple-700">
              <p className="hidden md:inline">Summary</p><Bot/> 
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Chat summary
                  </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Generating summary...</p>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <p>Failed to generate summary. Please try again.</p>
                    </div>
                  )}

                  {!loading && !error && chatSummary && (
                    <div className="rounded-lg bg-muted p-4">
                      <p>{chatSummary}</p>
                    </div>
                  )}
                </div>
              </DialogContent>
      </Dialog>
        </div>
    )
}

