"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PricingSection() {
    return (
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                            Pricing
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Choose the plan that fits your needs.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Tier */}
                    <div className="flex flex-col rounded-xl glass-card p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/30 group">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold">Free</h3>
                            <p className="text-muted-foreground text-sm">Essential note-taking.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">₹0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Unlimited Notes</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Secure Storage</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Markdown Support</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <X className="h-4 w-4" />
                                <span>AI Features</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <X className="h-4 w-4" />
                                <span>Ad-free Experience</span>
                            </li>
                        </ul>
                        <Link href="/notes" className="w-full">
                            <Button variant="outline" className="w-full active:scale-95 transition-transform">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* AI Basic (Ad-supported) */}
                    <div className="flex flex-col rounded-xl glass-card p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] border-2 border-primary/20 hover:border-primary/50 relative overflow-hidden group">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold">AI Basic</h3>
                            <p className="text-muted-foreground text-sm">AI power with ads.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">₹100</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Everything in Free</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>AI Analysis & Summary</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Grammar Check</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Suggested Tags</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <X className="h-4 w-4" />
                                <span>Ad-free Experience</span>
                            </li>
                        </ul>
                        <Link href="/notes" className="w-full">
                            <Button className="w-full active:scale-95 transition-transform">
                                Subscribe
                            </Button>
                        </Link>
                    </div>

                    {/* AI Pro */}
                    <div className="flex flex-col rounded-xl glass-card p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/30 group">
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary to-purple-600 text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                            POPULAR
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">AI Pro</h3>
                            <p className="text-muted-foreground text-sm">The ultimate experience.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">₹200</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Everything in AI Basic</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>No Ads</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Priority Support</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Early Access Features</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110" />
                                <span>Unlimited AI Usage</span>
                            </li>
                        </ul>
                        <Link href="/notes" className="w-full">
                            <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg active:scale-95 transition-transform">
                                Go Pro
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
