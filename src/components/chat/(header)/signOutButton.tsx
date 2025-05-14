"use client";
import { DoorClosed } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SignOutButton() {
  async function handleSignOut() {
    await signOut();    
  }

  return (
    <Button onClick={handleSignOut} variant="outline" size="sm" className="flex items-center gap-2 w-full">
            <DoorClosed className="h-4 w-4" />
            <span>Sign out</span>
    </Button>
  );
}
