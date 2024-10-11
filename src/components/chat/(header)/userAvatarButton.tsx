import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/src/components/chat/ui/dropdown-menu";
import SignOutButton from "@/src/components/chat/(header)/signOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { Button } from "@/src/components/chat/ui/button";
import ToAdminButton from "./toAdminButton";

export default async function UserAvatarButton() {
  const session = await getServerSession(authOptions);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <img
            src={session ? session!.user.image! : "placeholder-user.jpg"}
            width="32"
            height="32"
            className="rounded-full"
            alt="Avatar"
          />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ToAdminButton role={session?.user.role}/>
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
