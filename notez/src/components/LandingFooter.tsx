import Link from "next/link";

export default function LandingFooter() {
    return (
        <footer className="w-full py-12 border-t mt-auto bg-white dark:bg-black border-neutral-200 dark:border-neutral-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-2 md:col-span-1">
                        <Link className="flex items-center gap-2 mb-4 group" href="/">
                            <span className="text-xl font-bold group-hover:text-primary transition-colors duration-300">AI Notes</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Empowering your thoughts with the speed of AI. Secure, fast, and intelligent.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-1">Product</h3>
                        <Link href="#features" className="text-sm hover:text-primary transition-colors duration-300 relative group w-fit">
                            Features
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="#pricing" className="text-sm hover:text-primary transition-colors duration-300 relative group w-fit">
                            Pricing
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="#about" className="text-sm hover:text-primary transition-colors duration-300 relative group w-fit">
                            About
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-1">Resources</h3>
                        <Link href="#" className="text-sm hover:text-primary transition-colors duration-300 relative group w-fit">
                            Blog
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="#" className="text-sm hover:text-primary transition-colors duration-300 relative group w-fit">
                            Help Center
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="#" className="text-sm hover:text-primary transition-colors duration-300 relative group w-fit">
                            Community
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-1">Legal</h3>
                        <Link href="#" className="text-sm hover:text-primary transition-colors duration-300 relative group w-fit">
                            Privacy Policy
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="#" className="text-sm hover:text-primary transition-colors duration-300 relative group w-fit">
                            Terms of Service
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between border-t pt-6">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} AI Notes. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
