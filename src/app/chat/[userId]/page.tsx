import Image from "next/image";
import SuggestedFriends from "@/src/components/chat/(chat screen)/suggestedFriends";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/friends/suggest`,
    {
      method: "GET",
      headers: headers(),
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch data, status code: ${res.status}`);
  const data = await res.json();

  return (
    <div className="flex-1 overflow-y-auto bg-purple-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-purple-900 sm:text-5xl md:text-6xl text-center">
          Welcome back!
        </h1>
        <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/onggia.jpg"
            alt="Friends chatting"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <p className="mt-3 text-base text-purple-700 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl text-center">
          Ready to connect with more people? Start expanding your network today!
        </p>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4 text-center">
            Suggested Friends
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-md mx-auto">
            <SuggestedFriends
              sessionId={session?.user.id}
              suggestedFriends={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
