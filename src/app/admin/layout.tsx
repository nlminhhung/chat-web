import { ReactNode } from "react";
import UserAvatarButton from "@/src/components/chat/(header)/userAvatarButton";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminPage({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-purple-100 p-2 sm:p-4">
      <header className="bg-purple-700 text-white p-3 sm:p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
        <UserAvatarButton/>
      </header>

      <main>{children}</main>
    </div>
  );
}
