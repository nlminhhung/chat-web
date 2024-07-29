import { AddFriend } from "@/src/components/chat/(add a friend)/addFriend";
import { authOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
export default async function AddFriendPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="container mx-auto max-w-md py-12">
      
      <AddFriend />

    </div>
);
}
