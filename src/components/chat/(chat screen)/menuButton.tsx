"use client";
import { Button } from "@/src/components/chat/ui/button";
import { useSidebar } from "@/src/lib/context/sideBarContext";
import { X, Menu } from "lucide-react";

export default function MenuButton() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-purple-800 sm:hidden text-white flex"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  );
}
