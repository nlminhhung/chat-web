"use client";
import { DropdownMenuItem } from "@/src/components/chat/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  async function handleSignOut() {
    await signOut();    
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
  );
}
