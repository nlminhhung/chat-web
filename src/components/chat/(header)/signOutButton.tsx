"use client";
import { DropdownMenuItem } from "@/src/components/chat/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  function handleSignOut() {
    signOut({callbackUrl: `${process.env.LOCAL_URL}/`, redirect:true});    
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
  );
}
