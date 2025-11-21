import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center relative min-h-screen">
            {/* Global Background from Pricing Section */}
            <div className="fixed inset-0 -z-50 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70"></div>

            {/* Hero Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
                {/* Removed local hero background to use global one */}
                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="flex flex-col items-center space-y-4 text-center animate-fade-in-up">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary-foreground animate-gradient-x pb-2">
                                Capture Your Thoughts with AI
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                The smartest way to take notes. Enhanced with AI to help you organize, summarize, and expand your ideas.
                            </p>
                        </div>
                        <div className="space-x-4 pt-4">
                            <Link href="/notes">
                                <Button size="lg" className="h-12 px-8 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 active:scale-95">
                                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button variant="outline" size="lg" className="h-12 px-8 hover:bg-secondary/50 backdrop-blur-sm transition-all duration-300 active:scale-95">
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        {/* Floating Element Visualization */}
                        <div className="mt-12 w-full max-w-5xl mx-auto animate-float">
                            <div className="rounded-xl border bg-background/50 backdrop-blur-xl shadow-2xl p-4 md:p-8 relative overflow-hidden transition-all duration-500 hover:shadow-primary/10 hover:shadow-3xl group/card">
                                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                                    <div className="h-3 w-3 rounded-full bg-red-500 transition-all duration-300 group-hover/card:scale-110"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500 transition-all duration-300 group-hover/card:scale-110 delay-75"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500 transition-all duration-300 group-hover/card:scale-110 delay-150"></div>
                                    <div className="ml-4 text-sm text-muted-foreground font-mono flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                        AI Analysis Active
                                    </div>
                                </div>
                                <div className="space-y-2 font-mono text-sm md:text-base leading-relaxed text-muted-foreground">
                                    <p>
                                        Artificial Intelligence is <span className="text-foreground bg-primary/10 border-b-2 border-primary px-1 rounded-sm animate-[pulse_3s_ease-in-out_infinite] hover:scale-105 hover:bg-primary/20 transition-all duration-300 cursor-default">revolutionizing</span> the way we take notes.
                                        By automatically <span className="text-foreground bg-purple-500/10 border-b-2 border-purple-500 px-1 rounded-sm animate-[pulse_3s_ease-in-out_infinite] delay-75 hover:scale-105 hover:bg-purple-500/20 transition-all duration-300 cursor-default">summarizing content</span>,
                                        identifying <span className="text-foreground bg-blue-500/10 border-b-2 border-blue-500 px-1 rounded-sm animate-[pulse_3s_ease-in-out_infinite] delay-150 hover:scale-105 hover:bg-blue-500/20 transition-all duration-300 cursor-default">key concepts</span>,
                                        and <span className="text-foreground bg-green-500/10 border-b-2 border-green-500 px-1 rounded-sm animate-[pulse_3s_ease-in-out_infinite] delay-200 hover:scale-105 hover:bg-green-500/20 transition-all duration-300 cursor-default">organizing information</span>,
                                        AI empowers users to focus on <span className="text-foreground bg-orange-500/10 border-b-2 border-orange-500 px-1 rounded-sm animate-[pulse_3s_ease-in-out_infinite] delay-300 hover:scale-105 hover:bg-orange-500/20 transition-all duration-300 cursor-default">creativity</span>
                                        and critical thinking rather than manual data entry.
                                    </p>
                                </div>

                                {/* Floating AI badges/tags that appear to be extracted */}
                                <div className="absolute -right-4 top-20 bg-background border shadow-lg p-2 rounded-lg text-xs font-medium text-purple-500 rotate-12 animate-float delay-100 hidden md:block hover:scale-110 transition-transform cursor-pointer">
                                    #summary
                                </div>
                                <div className="absolute -left-2 bottom-10 bg-background border shadow-lg p-2 rounded-lg text-xs font-medium text-blue-500 -rotate-6 animate-float delay-300 hidden md:block hover:scale-110 transition-transform cursor-pointer">
                                    #concepts
                                </div>
                                <div className="absolute right-10 bottom-4 bg-background border shadow-lg p-2 rounded-lg text-xs font-medium text-green-500 rotate-3 animate-float delay-500 hidden md:block hover:scale-110 transition-transform cursor-pointer">
                                    #organization
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FeaturesSection />

            <PricingSection />

            {/* About Section */}
            <section id="about" className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
                        <div className="space-y-4">
                            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                                About
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                Experience the future of note-taking
                            </h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                We believe that note-taking should be effortless. That's why we built AI Notes - to handle the organization while you focus on the ideas.
                            </p>
                            <ul className="grid gap-2 py-4">
                                <li className="flex items-center gap-2 group/item">
                                    <CheckCircle2 className="h-4 w-4 text-primary transition-all duration-300 group-hover/item:scale-125 group-hover/item:text-primary" />
                                    <span className="text-muted-foreground transition-colors duration-300 group-hover/item:text-foreground">Real-time synchronization</span>
                                </li>
                                <li className="flex items-center gap-2 group/item">
                                    <CheckCircle2 className="h-4 w-4 text-primary transition-all duration-300 group-hover/item:scale-125 group-hover/item:text-primary" />
                                    <span className="text-muted-foreground transition-colors duration-300 group-hover/item:text-foreground">Markdown support</span>
                                </li>
                                <li className="flex items-center gap-2 group/item">
                                    <CheckCircle2 className="h-4 w-4 text-primary transition-all duration-300 group-hover/item:scale-125 group-hover/item:text-primary" />
                                    <span className="text-muted-foreground transition-colors duration-300 group-hover/item:text-foreground">Export to PDF & HTML</span>
                                </li>
                            </ul>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link href="/notes">
                                    <Button size="lg" className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95">Try it Free</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted/50 shadow-xl lg:aspect-square">
                                {/* Placeholder for an image or demo */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <span className="text-lg">App Screenshot / Demo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
