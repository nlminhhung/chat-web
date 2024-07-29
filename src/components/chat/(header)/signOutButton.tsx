"use client";
import { DropdownMenuItem } from "@/src/components/chat/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";


export default function SignOutButton() {
  async function SignOut() {
    try {
        await signOut();
    } catch (error) {
      toast.error("Something went wrong! :(");
    } 
  }

  return (
    <DropdownMenuItem onClick={SignOut}>Sign out</DropdownMenuItem>
  );
}
