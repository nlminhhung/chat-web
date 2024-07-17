import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import SignInButton from "@/components/home/signInButton"


export default function Home() {
  return (
    <div>
      <div className="flex min-h-[100dvh] flex-col">
      <header className="bg-[#00B894] px-4 py-3 md:px-6 md:py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <MountainIcon className="h-6 w-6 text-primary-foreground" />
            <span className="text-lg font-semibold text-primary-foreground">Message Website</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link href="#" className="text-sm font-medium text-primary-foreground hover:underline" prefetch={false}>
              About
            </Link>
            <Link href="#" className="text-sm font-medium text-primary-foreground hover:underline" prefetch={false}>
              Contact 
            </Link>
          </nav>
          <SignInButton/>
          {/* <Button className="hidden md:inline-flex"><GGIcon />Continue with Google!</Button> */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-6">       
                <Link href="#" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <InfoIcon className="h-5 w-5" />
                  About
                </Link>
                <Link href="#" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <ContactIcon className="h-5 w-5" />
                  Contact
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-[#00B894] py-12 md:py-20 lg:py-28">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:px-6">
            <h1 className="text-center text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Chat Freely, Connect Deeply, Create Memories!
            </h1>
            <p className="max-w-md text-center text-lg text-primary-foreground">
              Unlock the power of our comprehensive suite of tools and services to take your business to new heights.
            </p>
            <Button className="mt-4">Get Started</Button>
          </div>
        </section>
        <section className="py-12 md:py-20 lg:py-28">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
            <div className="flex flex-col items-center gap-4">
              <RocketIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Accelerate Growth</h3>
              <p className="text-center text-muted-foreground">
                Our powerful tools and expert guidance will help you drive rapid growth and scale your business.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <MaximizeIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Boost Efficiency</h3>
              <p className="text-center text-muted-foreground">
                Streamline your operations and unlock new levels of productivity with our cutting-edge solutions.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <LockIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Enhance Security</h3>
              <p className="text-center text-muted-foreground">
                Protect your business and your customers with our robust security features and compliance measures.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:flex-row md:justify-between md:px-6">
          <p className="text-sm text-muted-foreground">&copy; 2024 Acme Inc. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:underline" prefetch={false}>
              About
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:underline" prefetch={false}>
              Contact
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
    </div>
  )
}

function ContactIcon(props : any) {
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
      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <circle cx="12" cy="10" r="2" />
      <line x1="8" x2="8" y1="2" y2="4" />
      <line x1="16" x2="16" y1="2" y2="4" />
    </svg>
  )
}

function InfoIcon(props : any) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}


function LockIcon(props : any ) {
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
  )
}

function MaximizeIcon(props : any) {
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
  )
}


function MenuIcon(props : any) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function MountainIcon(props : any) {
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
  )
}


function RocketIcon(props : any) {
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
  )
}


function ShoppingCartIcon(props : any) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function XIcon(props : any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
