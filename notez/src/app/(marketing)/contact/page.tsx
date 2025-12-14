"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageSquare, HelpCircle, Bug, Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to submit contact form');
            }

            setIsSubmitting(false);
            setSubmitStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitStatus("idle"), 5000);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setIsSubmitting(false);
            setSubmitStatus("error");

            // Reset error message after 5 seconds
            setTimeout(() => setSubmitStatus("idle"), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const contactReasons = [
        {
            icon: HelpCircle,
            title: "General Inquiry",
            description: "Have questions about our service? We're here to help.",
            email: "support@ai-notes.com"
        },
        {
            icon: Bug,
            title: "Report a Bug",
            description: "Found an issue? Let us know and we'll fix it.",
            email: "bugs@ai-notes.com"
        },
        {
            icon: Lightbulb,
            title: "Feature Request",
            description: "Have an idea? We'd love to hear your suggestions.",
            email: "feedback@ai-notes.com"
        },
        {
            icon: MessageSquare,
            title: "Partnership",
            description: "Interested in partnering with us? Get in touch.",
            email: "partners@ai-notes.com"
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
                        Get in Touch
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
                            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
                                Send us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="rounded-none"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="rounded-none"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="rounded-none"
                                        placeholder="What's this about?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="rounded-none min-h-[150px]"
                                        placeholder="Tell us more..."
                                    />
                                </div>
                                {submitStatus === "success" && (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <p className="text-green-800 dark:text-green-200">
                                            Thank you! Your message has been sent. We'll get back to you soon.
                                        </p>
                                    </div>
                                )}
                                {submitStatus === "error" && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <p className="text-red-800 dark:text-red-200">
                                            Something went wrong. Please try again later.
                                        </p>
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-none bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                                >
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
                            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
                                Contact Information
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                            Email
                                        </h3>
                                        <a
                                            href="mailto:support@ai-notes.com"
                                            className="text-primary hover:underline text-sm"
                                        >
                                            support@ai-notes.com
                                        </a>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                    <p className="text-sm text-muted-foreground">
                                        We typically respond within 24-48 hours during business days.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
                            <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                                Other Ways to Reach Us
                            </h2>
                            <div className="space-y-4">
                                {contactReasons.map((reason, index) => {
                                    const Icon = reason.icon;
                                    return (
                                        <div key={reason.title} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-primary" />
                                                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                                                    {reason.title}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {reason.description}
                                            </p>
                                            <a
                                                href={`mailto:${reason.email}`}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                {reason.email}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Need Help?
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Check out our documentation or browse our help center for quick answers.
                            </p>
                            <Link
                                href="/"
                                className="text-sm text-primary hover:underline"
                            >
                                Visit Help Center →
                            </Link>
                        </div>
                    </motion.div> */}
                </div>

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

