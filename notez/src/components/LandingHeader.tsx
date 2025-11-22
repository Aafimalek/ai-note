import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function LandingHeader() {
    return (
        <header className="sticky top-0 z-50 w-full glass">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link className="flex items-center gap-2" href="/">
                    <Image
                        src="/logo.png"
                        height={40}
                        width={40}
                        alt="AI Notes Logo"
                        className=""
                    />
                    <span className="text-xl font-bold">AI Notes</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors relative group">
                        Features
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors relative group">
                        Pricing
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors relative group">
                        About
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <DarkModeToggle />
                    <Link href="/notes">
                        <Button className="active:scale-95 transition-transform">Get Started</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
