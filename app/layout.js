import { Fugaz_One, Open_Sans, Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Head from "./head";
import Logout from "@/components/Logout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const opensans = Open_Sans({ subsets: ["latin"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export const metadata = {
  title: "WSEI · Task Tracker · Home Page",
  description: "Final project from the Frontend Frameworks lab",
};

export default function RootLayout({ children }) {
  
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href="/">
        <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>WSEI Task Tracker</h1>
      </Link>
      <Logout />
    </header>
  );

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p className={'text-indigo-400 ' + fugaz.className}>Aleks Koloch 14517</p>
      <p className={'text-indigo-400 ' + fugaz.className}>aleks.koloch@gmail.com</p>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <body className={'w-full max-w-[1000px] mx-auto text-sm ms:text-base min-h-screen flex flex-col text-slate-800 antialiased ' + opensans.className}>
          {header}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
