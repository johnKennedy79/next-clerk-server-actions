import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next App with Clerk, TailWind and PG",
  description:
    "experamenting with conditional rendering based on Clerk login status",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <header className="fixed top-0 left-0 w-screen h-20 bg-[#002349] flex justify-evenly items-center">
            <h1 className="text-[#cd950c] text-5xl">Next - Clerk - App</h1>
            <SignedOut>
              <SignInButton className="border-double border-[#cd950c] border-8 outline-8 h-20 w-32 bg-[#002349] text-[#cd950c] text-2xl" />
            </SignedOut>
            <SignedIn>
              <UserButton className="border-double border-[#cd950c] border-8 outline-8 h-20 w-32 bg-[#002349] text-[#cd950c] text-2xl" />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
