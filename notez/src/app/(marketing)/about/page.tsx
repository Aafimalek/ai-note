"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Shield, Zap, Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
    const values = [
        {
            icon: Brain,
            title: "Innovation",
            description: "We continuously push the boundaries of what's possible with AI-powered note-taking."
        },
        {
            icon: Shield,
            title: "Security",
            description: "Your data is encrypted and protected with industry-leading security measures."
        },
        {
            icon: Zap,
            title: "Speed",
            description: "Experience lightning-fast performance that keeps up with your thoughts."
        },
        {
            icon: Users,
            title: "User-Centric",
            description: "Every feature is designed with your needs and feedback in mind."
        },
        {
            icon: Target,
            title: "Focus",
            description: "We help you stay organized so you can focus on what matters most."
        },
        {
            icon: Heart,
            title: "Passion",
            description: "We're passionate about making note-taking effortless and intelligent."
        }
    ];

    return (
        <div className="w-full min-h-screen py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                        About AI Notes
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Empowering your thoughts with the speed of AI. Secure, fast, and intelligent.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-16"
                >
                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-8 md:p-12 border border-neutral-200 dark:border-neutral-800">
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Our Mission</h2>
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                            At AI Notes, we believe that note-taking should be effortless. We're on a mission to revolutionize how people capture, organize, and interact with their thoughts using the power of artificial intelligence.
                        </p>
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            Our goal is to handle the organization and analysis while you focus on what truly matters - your ideas, creativity, and productivity. We combine cutting-edge AI technology with intuitive design to create a note-taking experience that adapts to your workflow.
                        </p>
                    </div>
                </motion.section>

                {/* Story Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Our Story</h2>
                    <div className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        <p className="text-lg">
                            AI Notes was born from a simple observation: traditional note-taking tools haven't evolved to keep pace with how we think and work today. While AI has transformed countless industries, note-taking remained largely unchanged.
                        </p>
                        <p className="text-lg">
                            We set out to change that. By leveraging advanced AI models, we've created a platform that doesn't just store your notes - it understands them, organizes them, and helps you extract insights you might have missed.
                        </p>
                        <p className="text-lg">
                            From automatic summarization to intelligent tagging, from encryption to translation, every feature is designed to make your note-taking experience more powerful and more seamless.
                        </p>
                    </div>
                </motion.section>

                {/* Values Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-neutral-100">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                                            {value.title}
                                        </h3>
                                    </div>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>

                {/* Features Highlight */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-neutral-100">What Makes Us Different</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">AI-Powered Intelligence</h3>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                Our advanced AI models understand context, extract key concepts, and help you organize your thoughts automatically. No manual categorization needed.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Enterprise-Grade Security</h3>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                Your notes are encrypted end-to-end. We use industry-leading security practices to ensure your data remains private and secure.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Seamless Experience</h3>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                Beautiful, intuitive interface that works seamlessly across devices. Your notes sync in real-time, so you can access them anywhere.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Continuous Innovation</h3>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                We're constantly improving and adding new features based on user feedback. Your note-taking experience gets better every day.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Note-Taking?</h2>
                        <p className="text-xl mb-8 text-neutral-200">
                            Join thousands of users who are already experiencing the future of note-taking.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/"
                                className="px-8 py-3 bg-white text-neutral-900 rounded-none font-semibold hover:bg-neutral-100 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-3 border-2 border-white text-white rounded-none font-semibold hover:bg-white/10 transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </motion.section>

                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center">
                    <Link
                        href="/"
                        className="text-primary hover:underline inline-flex items-center gap-2"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

