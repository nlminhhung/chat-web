
import { authOptions } from "@/src/lib/auth"
import { getServerSession } from "next-auth"


export default async function Test() {
    const session = await getServerSession(authOptions);

    return (
        <pre>Here{JSON.stringify(session)}</pre>
    )
  }
  