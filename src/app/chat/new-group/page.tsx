import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { headers } from "next/headers";
import AddGroup from "@/src/components/chat/(add group)/addGroup";

export default async function NewGroupPage() {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/groups/friendList`,
      {
        method: "GET",
        headers: headers(),
      }
    );
    if (!res.ok) throw new Error(`Failed to fetch data, status code: ${res.status}`);
    const data = await res.json();

  return (
    <AddGroup friendList={data} userId={session?.user.id}/>
  )
    
}