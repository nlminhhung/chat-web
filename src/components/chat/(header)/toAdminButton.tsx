"use client";
import { DropdownMenuItem } from "@/src/components/chat/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ToAdminButton({ role }: { role: string }) {
  const router = usePathname();
  return (
    role === "admin" && router !== "/admin" && (
      <Link href={"/admin"}>
        <DropdownMenuItem>To Admin Page</DropdownMenuItem>
      </Link>
    )
  );
}
