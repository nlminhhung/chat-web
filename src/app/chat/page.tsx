import ChatScreen from "@/src/components/chat/(chat screen)/chatScreen"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth";


export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  return (
        <ChatScreen userId={session?.user.id}/>
  )
}
