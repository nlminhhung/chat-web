import Link from "next/link";
import { Button } from "../components/home/ui/button";
import SignInButton from "../components/home/signInButton";
import HomeSignOutButton from "../components/home/homeSignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <div className="flex min-h-[100dvh] flex-col">
        <header className="bg-purple-700 px-4 py-3 md:px-6 md:py-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <MountainIcon className="h-6 w-6 text-primary-foreground" />
              <span className="text-lg font-semibold text-primary-foreground">
                ChatterBox
              </span>
            </Link>
            {session ? <HomeSignOutButton /> : <SignInButton />}
          </div>
        </header>
        <main className="flex-1">
          <section className="bg-purple-700 py-12 md:py-20 lg:py-28">
            <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:px-6">
              <h1 className="text-center text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                Chat Freely, Connect Deeply, Create Memories!
              </h1>
              <p className="max-w-md text-center text-lg text-primary-foreground">
                Real-time messaging with your friends and teams, anytime,
                anywhere.
              </p>
              {session ? (
                <Button className="mt-4">
                  <Link href="/chat">Continue as {session?.user.name}!</Link>
                </Button>
              ) : (
                <></>
              )}
            </div>
          </section>
          <section className="py-12 md:py-20 lg:py-28">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
              <div className="flex flex-col items-center gap-4">
                <RocketIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Instant Communication</h3>
                <p className="text-center text-muted-foreground">
                  Enjoy fast and instant online chatting, keeping you connected
                  at all times.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <MaximizeIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">
                  Feature-Rich and User-Friendly
                </h3>
                <p className="text-center text-muted-foreground">
                  Experience a wide range of unique features, all designed to be
                  easy to use, with an intuitive, user-friendly interface.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <LockIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Secure Messaging</h3>
                <p className="text-center text-muted-foreground">
                  Your messages are securely protected and scanned to ensure the
                  highest level of safety.
                </p>
              </div>
            </div>
          </section>
        </main>
        <footer className="bg-muted py-6">
          <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:flex-row md:justify-between md:px-6">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 ChatterBox by Hung Nguyen. All rights reserved.
            </p>
            <nav className="flex gap-4">
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:underline"
                prefetch={false}
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

function LockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MaximizeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function RocketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
