"use client";

import {
    FileText,
    ScanText,
    Tags,
    Lock,
    Languages,
    ArrowRight,
    Mic,
    Brain,
    ShieldCheck,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Deep AI Analysis",
        description: "Uncover hidden patterns and insights in your notes.",
        icon: <Brain className="h-6 w-6" />,
        className: "col-span-1 md:col-span-2 lg:col-span-2",
        skeleton: (
            <div className="flex-1 bg-muted/30 rounded-xl p-6 relative overflow-hidden h-full min-h-[200px] flex flex-col justify-between group/skeleton">
                <div className="space-y-3 z-10">
                    <div className="h-5 bg-muted-foreground/10 rounded w-3/4 animate-pulse"></div>
                    <div className="h-5 bg-muted-foreground/10 rounded w-full animate-pulse delay-75"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6 z-10">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm transition-transform duration-500 group-hover/skeleton:translate-y-[-5px]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-xs font-medium">Sentiment</span>
                        </div>
                        <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[85%] animate-[width_2s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm transition-transform duration-500 group-hover/skeleton:translate-y-[-5px] delay-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                            <span className="text-xs font-medium">Keywords</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce delay-0"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce delay-100"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce delay-200"></span>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover/skeleton:bg-primary/20 transition-colors duration-500"></div>
                <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover/skeleton:bg-purple-500/20 transition-colors duration-500"></div>
            </div>
        ),
    },
    {
        title: "Instant Summary",
        description: "Turn long notes into concise bullet points.",
        icon: <FileText className="h-6 w-6" />,
        className: "col-span-1",
        skeleton: (
            <div className="flex-1 bg-muted/30 rounded-xl p-4 space-y-3 relative h-full min-h-[180px] flex flex-col group/skeleton">
                <div className="space-y-1.5 opacity-40 transition-opacity duration-300 group-hover/skeleton:opacity-20">
                    <div className="h-2 bg-foreground/20 rounded w-full"></div>
                    <div className="h-2 bg-foreground/20 rounded w-full"></div>
                    <div className="h-2 bg-foreground/20 rounded w-3/4"></div>
                </div>
                <div className="flex justify-center py-1">
                    <div className="bg-primary/10 p-1.5 rounded-full group-hover/skeleton:scale-110 transition-transform duration-300">
                        <Zap className="h-4 w-4 text-primary" />
                    </div>
                </div>
                <div className="space-y-2 bg-background/60 p-3 rounded-lg border shadow-sm flex-1 transition-all duration-300 group-hover/skeleton:bg-background/80 group-hover/skeleton:shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <div className="h-2 bg-primary/20 rounded w-3/4"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <div className="h-2 bg-primary/20 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: "Perfect Grammar",
        description: "AI-powered proofreading and style suggestions.",
        icon: <ScanText className="h-6 w-6" />,
        className: "col-span-1",
        skeleton: (
            <div className="flex-1 bg-muted/30 rounded-xl p-4 flex items-center justify-center h-full min-h-[180px] group/skeleton">
                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-sm w-full transition-all duration-300 group-hover/skeleton:shadow-md">
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <span className="line-through decoration-red-400 decoration-2 group-hover/skeleton:opacity-50 transition-opacity">Thier</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover/skeleton:translate-x-1" />
                        <span className="text-green-600 font-bold bg-green-50 px-1 rounded animate-pulse">Their</span>
                    </div>
                    <div className="h-1 w-full bg-gradient-to-r from-red-400 to-green-400 rounded-full opacity-50"></div>
                </div>
            </div>
        ),
    },
    {
        title: "Smart Tags",
        description: "Auto-categorization for effortless organization.",
        icon: <Tags className="h-6 w-6" />,
        className: "col-span-1",
        skeleton: (
            <div className="flex-1 bg-muted/30 rounded-xl p-4 flex flex-col justify-center gap-3 h-full min-h-[160px] group/skeleton">
                <div className="flex flex-wrap gap-2 justify-center">
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2.5 py-1 border border-blue-200 dark:border-blue-800 transition-transform duration-300 group-hover/skeleton:scale-110 hover:!scale-125 cursor-default">#project</span>
                    <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-2.5 py-1 border border-purple-200 dark:border-purple-800 transition-transform duration-300 group-hover/skeleton:scale-110 hover:!scale-125 cursor-default delay-75">#ideas</span>
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs px-2.5 py-1 border border-green-200 dark:border-green-800 transition-transform duration-300 group-hover/skeleton:scale-110 hover:!scale-125 cursor-default delay-150">#urgent</span>
                    <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs px-2.5 py-1 border border-orange-200 dark:border-orange-800 opacity-0 group-hover/skeleton:opacity-100 transition-all duration-300 scale-50 group-hover/skeleton:scale-100">#ai</span>
                </div>
            </div>
        ),
    },
    {
        title: "Secure Vault",
        description: "Military-grade encryption for your private data.",
        icon: <ShieldCheck className="h-6 w-6" />,
        className: "col-span-1",
        skeleton: (
            <div className="flex-1 bg-muted/30 rounded-xl p-4 flex items-center justify-center h-full min-h-[160px] relative overflow-hidden group/skeleton">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 to-transparent animate-pulse"></div>
                <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-400 relative z-10 transition-transform duration-500 group-hover/skeleton:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-green-500/30 rounded-full animate-[ping_3s_linear_infinite]"></div>
                </div>
            </div>
        ),
    },
    {
        title: "Global Translation",
        description: "Break language barriers with instant translation.",
        icon: <Languages className="h-6 w-6" />,
        className: "col-span-1 md:col-span-2 lg:col-span-2",
        skeleton: (
            <div className="flex-1 bg-muted/30 rounded-xl p-5 flex items-center justify-between gap-4 h-full min-h-[160px] group/skeleton">
                <div className="bg-background p-3 rounded-lg shadow-sm text-xs flex-1 border transition-all duration-300 group-hover/skeleton:-translate-x-2">
                    <p className="text-muted-foreground mb-1">English</p>
                    <p className="font-medium">Hello, how are you?</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground/50 transition-all duration-300 group-hover/skeleton:text-primary group-hover/skeleton:scale-125" />
                <div className="bg-primary/5 p-3 rounded-lg shadow-sm text-xs flex-1 border border-primary/20 transition-all duration-300 group-hover/skeleton:translate-x-2 group-hover/skeleton:bg-primary/10">
                    <p className="text-primary mb-1">Spanish</p>
                    <p className="font-medium text-foreground">Hola, ¿cómo estás?</p>
                </div>
            </div>
        ),
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <div className="space-y-2">
                        <div className="inline-block bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-2">
                            Features
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Intelligent Note Taking
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Experience the power of AI integrated directly into your workflow.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl glass-card p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 flex flex-col",
                                feature.className
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    {feature.icon}
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            <div className="mt-auto w-full">
                                {feature.skeleton}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
