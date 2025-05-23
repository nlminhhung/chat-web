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
import ProfileCustomizer from "@/src/components/chat/(header)/profileCustomizer";
import { Avatar, AvatarImage } from "@/src/components/chat/ui/avatar"

export default async function UserAvatarButton() {
  const session = await getServerSession(authOptions);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
         <Avatar role="button" className="h-10 w-10 mr-3 hover:opacity-80 transition">
              <AvatarImage src={session!.user.image!} />
          </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ToAdminButton role={session?.user.role}/>
        <ProfileCustomizer id={session!.user.id} name={session!.user.name} image={session!.user.image} />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
