"use client";
import { DropdownMenuItem } from "@/src/components/chat/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Shield } from "lucide-react";

export default function ToAdminButton({ role }: { role: string }) {
  const router = usePathname();
  return (
    role === "admin" && router !== "/admin" && (
       <Link href="/admin" className="w-full">
        <Button variant="outline" size="sm" className="flex items-center gap-2 w-full">
          <Shield className="h-4 w-4" />
          <span>Admin Dashboard</span>
        </Button>
    </Link>
    )
  );
}
