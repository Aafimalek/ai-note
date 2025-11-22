"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, Brain } from "lucide-react";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center relative min-h-screen">
            {/* Hero Section with Aceternity HeroHighlight */}
            <HeroHighlight containerClassName="h-[40rem] md:h-[50rem]">
                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: [20, -5, 0],
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.4, 0.0, 0.2, 1],
                    }}
                    className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
                >
                    Capture Your Thoughts with{" "}
                    <Highlight className="text-black dark:text-white">
                        AI-Powered Precision
                    </Highlight>
                </motion.h1>

                {/* AI Analysis Window Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="mt-12 relative z-20 w-full max-w-2xl mx-auto"
                >
                    <div className="relative bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
                        {/* Window Header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="ml-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 font-mono">AI Analysis Active</span>
                            </div>
                        </div>

                        {/* Window Content */}
                        <div className="p-6 md:p-8 relative min-h-[200px] flex items-center">
                            <p className="text-lg md:text-xl leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium">
                                Artificial Intelligence is{" "}
                                <span className="relative inline-block px-1 mx-1">
                                    <span className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 rounded transform -rotate-1" />
                                    <span className="relative z-10">revolutionizing</span>
                                </span>{" "}
                                the way we take notes. By automatically{" "}
                                <span className="relative inline-block px-1 mx-1">
                                    <span className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded transform rotate-1" />
                                    <span className="relative z-10 text-purple-700 dark:text-purple-300">summarizing content</span>
                                </span>
                                , identifying{" "}
                                <span className="relative inline-block px-1 mx-1">
                                    <span className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded transform -rotate-1" />
                                    <span className="relative z-10 text-blue-700 dark:text-blue-300">key concepts</span>
                                </span>
                                , and{" "}
                                <span className="relative inline-block px-1 mx-1">
                                    <span className="absolute inset-0 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded transform rotate-1" />
                                    <span className="relative z-10 text-green-700 dark:text-green-300">organizing information</span>
                                </span>
                                , AI empowers users to focus on creativity.
                            </p>

                            {/* Floating Tags */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -left-4 top-1/2 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1 rounded-full text-xs font-semibold text-blue-500 transform -rotate-12 hidden md:block"
                            >
                                #concepts
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -right-2 top-1/3 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1 rounded-full text-xs font-semibold text-purple-500 transform rotate-6 hidden md:block"
                            >
                                #summary
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute right-10 bottom-4 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1 rounded-full text-xs font-semibold text-green-500 transform -rotate-3 hidden md:block"
                            >
                                #organization
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                <div className="flex gap-4 justify-center mt-12 relative z-20">
                    <Link href="/notes">
                        <Button size="lg" className="rounded-none h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="rounded-none h-12 px-8 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 active:scale-95">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </HeroHighlight>

            <FeaturesSection />

            <PricingSection />

            {/* About Section */}
            <section id="about" className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
                        <div className="space-y-4">
                            <div className="inline-block rounded-none bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                About
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-neutral-800 dark:text-neutral-100">
                                Experience the future of note-taking
                            </h2>
                            <p className="max-w-[600px] text-neutral-600 dark:text-neutral-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                We believe that note-taking should be effortless. That's why we built AI Notes - to handle the organization while you focus on the ideas.
                            </p>
                            <ul className="grid gap-2 py-4">
                                <li className="flex items-center gap-2 group/item">
                                    <CheckCircle2 className="h-4 w-4 text-neutral-800 dark:text-neutral-100 transition-all duration-300 group-hover/item:scale-125" />
                                    <span className="text-neutral-600 dark:text-neutral-400 transition-colors duration-300 group-hover/item:text-neutral-900 dark:group-hover/item:text-neutral-100">Real-time synchronization</span>
                                </li>
                                <li className="flex items-center gap-2 group/item">
                                    <CheckCircle2 className="h-4 w-4 text-neutral-800 dark:text-neutral-100 transition-all duration-300 group-hover/item:scale-125" />
                                    <span className="text-neutral-600 dark:text-neutral-400 transition-colors duration-300 group-hover/item:text-neutral-900 dark:group-hover/item:text-neutral-100">Markdown support</span>
                                </li>
                                <li className="flex items-center gap-2 group/item">
                                    <CheckCircle2 className="h-4 w-4 text-neutral-800 dark:text-neutral-100 transition-all duration-300 group-hover/item:scale-125" />
                                    <span className="text-neutral-600 dark:text-neutral-400 transition-colors duration-300 group-hover/item:text-neutral-900 dark:group-hover/item:text-neutral-100">Export to PDF & HTML</span>
                                </li>
                            </ul>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link href="/notes">
                                    <Button size="lg" className="rounded-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 bg-neutral-900 dark:bg-white text-white dark:text-black">Try it Free</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="relative w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-xl group">
                                <video
                                    src="/ai_notes.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
