import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book search",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="text-white bg-black w-full h-16 px-20 border border-solid border-black border-opacity-10 text-xs">
          <div className="w-full h-full m-auto flex flex-row items-center">
            <Link
              className="text-lg w-min py-4 px-2 hover:bg-white hover:text-black"
              href="/"
            >
              Home
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
