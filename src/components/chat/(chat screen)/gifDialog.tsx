"use client";
import React, { useState, useEffect } from "react";
import { Squirrel, Search, Smile, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import socket from "@/src/lib/getSocket";

type GifUploadProps = {
  friendId: string;
  chatType: "direct" | "group";
}

export default function GifDialog({friendId, chatType}: GifUploadProps) {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGif, setSelectedGif] = useState<string | null>(null)
    const [gifs, setGifs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

  const fetchTrendingGifs = async () => {
    try {
      setLoading(true)
      setError(false)
      const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setGifs(data.data)
    } catch (err) {
      setError(true)
      console.error("Error fetching GIFs:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTrendingGifs()
      return
    }

    try {
      setLoading(true)
      setError(false)
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(
        searchQuery
      )}&api_key=${apiKey}&limit=12`)
      if (!response.ok) throw new Error("Failed to search")
      const data = await response.json()
      setGifs(data.data)
    } catch (err) {
      setError(true)
      console.error("Error searching GIFs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchTrendingGifs()
    }
  }, [open])

  const handleGifSelect = async (gif:any) => {
    setSelectedGif(gif.images.original.url)
    console.log("Selected GIF:", gif.images.original.url)
    setOpen(false)

    const sendImageURL =
      chatType === "direct"
        ? `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/sendGif`
        : `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chat/sendGroupGif`;  
    try {
      const res = await fetch(sendImageURL, {
        method: "post",
        body: JSON.stringify({
          friendId: friendId,
          message: gif.images.original.url,
        }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newMessage", {chatType: chatType, recipientId: friendId});
        if(chatType === "direct") socket.emit("newFriend", { idToAdd: friendId });
      }
    }
    catch (error) {
      toast.error("There was an error! Try again");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" type="button" className="bg-purple-600 hover:bg-purple-700 text-white">
          <Squirrel className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            Choose a GIF
          </DialogTitle>
          <DialogDescription>Search and select the perfect GIF for your message</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Search Input with Button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for GIFs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} size="default" className="px-4">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* GIF Grid */}
          <div className="flex-1 flex flex-col space-y-3 min-h-0">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <h3 className="font-medium">Trending GIFs</h3>
            </div>

            {loading ? (
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-full h-32 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                <Squirrel className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Failed to load GIFs</p>
                <Button variant="outline" size="sm" onClick={fetchTrendingGifs} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 flex-1 overflow-y-auto pr-2">
                {gifs.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => handleGifSelect(gif)}
                    className="relative group rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <img
                      src={gif.images.fixed_width.url || "/placeholder.svg"}
                      alt={gif.title}
                      className="w-full h-32 object-cover bg-muted"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {gif.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!loading && !error && gifs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Squirrel className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No GIFs found{searchQuery ? ` for "${searchQuery}"` : ""}</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>

        {selectedGif && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{selectedGif}</span>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
