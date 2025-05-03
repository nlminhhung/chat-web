import Link from "next/link";
import { Button } from "../components/home/ui/button";
import SignInButton from "../components/home/signInButton";
import HomeSignOutButton from "../components/home/homeSignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { AnimatedElement } from "@/src/components/home/ui/animated-element"
import { MessageSquare, Shield, Zap, Users, ChevronRight } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return (
        <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-white to-gray-50">
          {/* Header */}
          <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
            <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
              <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-1.5 rounded-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  ChatterBox
                </span>
              </Link>
    
              <div className="flex items-center gap-4">
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="#features"
                    className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    How It Works
                  </Link>
                </nav>
                {/* Temporarily replace with a simple sign in button */}
                {session ? <HomeSignOutButton /> : <SignInButton />}
              </div>
            </div>
          </header>
    
          <main className="flex-1">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 opacity-90" />
              <div className="absolute bg-cover bg-center mix-blend-overlay opacity-10" />
    
              <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-32 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                  <AnimatedElement direction="down">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                      Chat Freely, Connect Deeply, Create Memories!
                    </h1>
                  </AnimatedElement>
    
                  <AnimatedElement delay={200} direction="up">
                    <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                      Real-time messaging with your friends and teams, anytime, anywhere.
                    </p>
                  </AnimatedElement>
    
                  <AnimatedElement delay={400} direction="up">
                    {session ? (
                      <Button
                        size="lg"
                        className="bg-white text-purple-700 hover:bg-purple-50 font-medium px-8 py-6 h-auto rounded-full shadow-lg transition-all hover:shadow-xl"
                      >
                        <Link href="/chat" className="flex items-center gap-2">
                          Continue as {session?.user?.name || "User"}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="bg-white text-purple-700 hover:bg-purple-50 font-medium px-8 py-6 h-auto rounded-full shadow-lg transition-all hover:shadow-xl"
                      >
                        <Link href="#features" className="flex items-center gap-2">
                          Discover More
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </AnimatedElement>
                </div>
              </div>
            </section>
    
            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
              <div className="container mx-auto px-4 md:px-6">
                <AnimatedElement>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ChatterBox?</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Our platform is designed to make communication seamless, secure, and enjoyable.
                    </p>
                  </div>
                </AnimatedElement>
    
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <AnimatedElement delay={100} direction="up">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="bg-purple-100 p-3 rounded-lg w-fit mb-6">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Communication</h3>
                      <p className="text-gray-600">
                        Enjoy fast and instant online chatting, keeping you connected at all times with zero lag.
                      </p>
                    </div>
                  </AnimatedElement>
    
                  <AnimatedElement delay={300} direction="up">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="bg-purple-100 p-3 rounded-lg w-fit mb-6">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">User-Friendly Interface</h3>
                      <p className="text-gray-600">
                        Experience a wide range of unique features, all designed with an intuitive, user-friendly interface.
                      </p>
                    </div>
                  </AnimatedElement>
    
                  <AnimatedElement delay={500} direction="up">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="bg-purple-100 p-3 rounded-lg w-fit mb-6">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Messaging</h3>
                      <p className="text-gray-600">
                        Your messages are securely protected and scanned to ensure the highest level of privacy and safety.
                      </p>
                    </div>
                  </AnimatedElement>
                </div>
              </div>
            </section>
    
            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gray-50">
              <div className="container mx-auto px-4 md:px-6">
                <AnimatedElement>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How ChatterBox Works</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Getting started is simple. Connect with friends and start chatting in minutes.
                    </p>
                  </div>
                </AnimatedElement>
    
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <AnimatedElement delay={200} direction="left">
                    <div className="text-center">
                      <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                      <RocketIcon/>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up</h3>
                      <p className="text-gray-600">Create your account in seconds with just a few clicks</p>
                    </div>
                  </AnimatedElement>
    
                  <AnimatedElement delay={400} direction="up">
                    <div className="text-center">
                      <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                        2
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Friends</h3>
                      <p className="text-gray-600">Connect with friends or create groups for team communication</p>
                    </div>
                  </AnimatedElement>
    
                  <AnimatedElement delay={600} direction="right">
                    <div className="text-center">
                      <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                        3
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Chatting</h3>
                      <p className="text-gray-600">Send messages, share media, and stay connected anywhere</p>
                    </div>
                  </AnimatedElement>
                </div>
    
                <AnimatedElement delay={800} direction="up">
                  <div className="text-center mt-16">
                    {!session && (
                      <Button
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-6 h-auto rounded-full shadow-lg transition-all hover:shadow-xl"
                      >
                        <Link href="/auth/signin" className="flex items-center gap-2">
                          Get Started Now
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </AnimatedElement>
              </div>
            </section>
          </main>
    
          {/* Footer */}
          <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <Link href="/" className="flex items-center gap-2 mb-4" prefetch={false}>
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-1.5 rounded-md">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">ChatterBox</span>
                  </Link>
                  <p className="text-sm text-gray-400">Real-time messaging platform for friends and teams.</p>
                </div>
    
                <div>
                  {/* For styling */}
                </div>
    
                <div>
                  <h4 className="text-white font-medium mb-4">About Me</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="text-sm hover:text-purple-400 transition-colors">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
    
                <div>
                  <h4 className="text-white font-medium mb-4">Legal</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="text-sm hover:text-purple-400 transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-sm hover:text-purple-400 transition-colors">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-sm hover:text-purple-400 transition-colors">
                        Cookie Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
    
              <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-400 mb-4 md:mb-0">
                  &copy; 2024 ChatterBox by Hung Nguyen. All rights reserved.
                </p>
                <div className="flex space-x-4">
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    <FacebookIcon/>
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
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

function FacebookIcon(props: any) {
  return (<svg {...props} width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37,19h-2c-2.14,0-3,0.5-3,2 v3h5l-1,5h-4v15h-5V29h-4v-5h4v-3c0-4,2-7,6-7c2.9,0,4,1,4,1V19z"></path>
</svg>)
}

