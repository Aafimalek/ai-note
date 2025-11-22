import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Brain, Lock, Sparkles, Languages, Tags, Check, X, FileText, Globe, Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FeaturesSection() {
    return (
        <section id="features" className="py-20 w-full">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-none bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Features
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-neutral-800 dark:text-neutral-100">
                        Everything you need to master your notes
                    </h2>
                    <p className="max-w-[900px] text-neutral-600 dark:text-neutral-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Powerful features to help you capture, organize, and understand your thoughts.
                    </p>
                </div>
                <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            className={item.className}
                            icon={item.icon}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}

// --- Skeletons ---

const SkeletonAI = () => {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 relative overflow-hidden rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-full w-full animate-[scan_3s_ease-in-out_infinite]" />
            <div className="p-4 space-y-3 relative z-10">
                <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse delay-75" />
                <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse delay-150" />

                {/* AI Insight Box */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-md"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">AI Summary</span>
                    </div>
                    <div className="h-2 w-full bg-indigo-200 dark:bg-indigo-800 rounded mb-1" />
                    <div className="h-2 w-2/3 bg-indigo-200 dark:bg-indigo-800 rounded" />
                </motion.div>
            </div>
        </div>
    );
};

const SkeletonOrg = () => {
    const variants = {
        initial: (i: number) => {
            // Deterministic "random" positions based on index
            const positions = [
                { x: -15, y: -10, rotate: -5 },
                { x: 18, y: 12, rotate: 8 },
                { x: -12, y: 15, rotate: -3 },
                { x: 10, y: -12, rotate: 4 },
            ];
            const pos = positions[i - 1] || { x: 0, y: 0, rotate: 0 };
            return {
                x: pos.x,
                y: pos.y,
                rotate: pos.rotate,
                scale: 0.9,
            };
        },
        hover: (i: number) => ({
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "backOut",
                delay: i * 0.05,
            },
        }),
    };

    return (
        <motion.div
            initial="initial"
            whileHover="hover"
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col items-center justify-center relative overflow-hidden rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
        >
            <div className="grid grid-cols-2 gap-2 p-4">
                {[1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={variants}
                        className={cn(
                            "h-16 w-20 rounded-lg border flex items-center justify-center",
                            i === 1 ? "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800" :
                                i === 2 ? "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800" :
                                    i === 3 ? "bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800" :
                                        "bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800"
                        )}
                    >
                        {i === 1 && <FileText className="w-6 h-6 text-red-400" />}
                        {i === 2 && <Tags className="w-6 h-6 text-blue-400" />}
                        {i === 3 && <Brain className="w-6 h-6 text-green-400" />}
                        {i === 4 && <Lock className="w-6 h-6 text-yellow-400" />}
                    </motion.div>
                ))}
            </div>
            <div className="absolute bottom-2 text-xs text-neutral-400 font-mono">Auto-Sorting...</div>
        </motion.div>
    );
};

const SkeletonGrammar = () => {
    return (
        <motion.div
            initial="initial"
            whileHover="hover"
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col items-center justify-center rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4"
        >
            <div className="space-y-4 w-full max-w-[200px]">
                {/* Mistake State */}
                <motion.div
                    variants={{
                        initial: { opacity: 1, x: 0 },
                        hover: { opacity: 0, x: -20 }
                    }}
                    className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
                >
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400 line-through decoration-red-500">Teh quik brown</span>
                </motion.div>

                {/* Corrected State */}
                <motion.div
                    variants={{
                        initial: { opacity: 0, x: 20 },
                        hover: { opacity: 1, x: 0 }
                    }}
                    className="flex items-center gap-2 p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 absolute top-[35%] w-[calc(100%-2rem)] max-w-[200px]"
                >
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold">The quick brown</span>
                </motion.div>
            </div>
        </motion.div>
    );
};

const SkeletonTranslate = () => {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col items-center justify-center rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
            <Globe className="absolute text-neutral-100 dark:text-neutral-800 w-32 h-32 -right-4 -bottom-4 opacity-50" />

            <div className="relative z-10 flex flex-col gap-3 w-full px-6">
                <motion.div
                    className="self-start bg-neutral-100 dark:bg-neutral-800 rounded-tr-xl rounded-bl-xl rounded-br-xl p-3 text-sm"
                >
                    Hello World
                </motion.div>

                <motion.div
                    className="self-end bg-blue-500 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl p-3 text-sm flex items-center gap-2"
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                >
                    <Languages className="w-3 h-3" />
                    <span className="animate-[pulse_3s_ease-in-out_infinite]">Hola Mundo</span>
                </motion.div>
            </div>
        </div>
    );
};

const SkeletonEncryption = () => {
    return (
        <motion.div
            initial="initial"
            whileHover="hover"
            className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col items-center justify-center rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
        >
            <div className="relative">
                <motion.div
                    variants={{
                        initial: { opacity: 1, scale: 1 },
                        hover: { opacity: 0, scale: 0.8 }
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <FileText className="w-12 h-12 text-neutral-400" />
                </motion.div>

                <motion.div
                    variants={{
                        initial: { opacity: 0, scale: 1.2 },
                        hover: { opacity: 1, scale: 1 }
                    }}
                    className="flex items-center justify-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 animate-pulse" />
                        <Lock className="w-12 h-12 text-green-500 relative z-10" />
                    </div>
                </motion.div>
            </div>
            <motion.p
                variants={{
                    initial: { opacity: 0, y: 10 },
                    hover: { opacity: 1, y: 0 }
                }}
                className="mt-4 text-xs font-mono text-green-500"
            >
                AES-256 ENCRYPTED
            </motion.p>
        </motion.div>
    );
};

const items = [
    {
        title: "AI Analysis",
        description: (
            <span className="text-sm">
                Get deep insights and summaries from your notes instantly.
            </span>
        ),
        header: <SkeletonAI />,
        className: "md:col-span-1",
        icon: <Brain className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Smart Organization",
        description: (
            <span className="text-sm">
                Automatically tag and categorize your notes.
            </span>
        ),
        header: <SkeletonOrg />,
        className: "md:col-span-1",
        icon: <Tags className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Grammar Check",
        description: (
            <span className="text-sm">
                Ensure your notes are clear and error-free.
            </span>
        ),
        header: <SkeletonGrammar />,
        className: "md:col-span-1",
        icon: <Sparkles className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Secure Encryption",
        description: (
            <span className="text-sm">
                Your thoughts are private and encrypted.
            </span>
        ),
        header: <SkeletonEncryption />,
        className: "md:col-span-2",
        icon: <Lock className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Global Translation",
        description: (
            <span className="text-sm">
                Translate your notes into any language instantly.
            </span>
        ),
        header: <SkeletonTranslate />,
        className: "md:col-span-1",
        icon: <Languages className="h-4 w-4 text-neutral-500" />,
    },
];
