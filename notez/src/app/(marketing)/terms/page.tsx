"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <div className="w-full min-h-screen py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                        Terms and Conditions
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">1. Acceptance of Terms</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                By accessing and using AI Notes ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">2. Description of Service</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                AI Notes is an AI-powered note-taking application that provides users with intelligent features including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li>Creating, editing, and organizing notes</li>
                                <li>AI-powered summarization and analysis</li>
                                <li>Note encryption and security features</li>
                                <li>Translation and language processing</li>
                                <li>Tag management and organization</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">3. User Accounts</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                To use certain features of the Service, you must register for an account. You agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li>Provide accurate, current, and complete information during registration</li>
                                <li>Maintain and promptly update your account information</li>
                                <li>Maintain the security of your password and identification</li>
                                <li>Accept all responsibility for activities that occur under your account</li>
                                <li>Notify us immediately of any unauthorized use of your account</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">4. Subscription and Payment</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                The Service offers both free and premium subscription plans. By subscribing to a premium plan, you agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li>Pay all fees associated with your subscription</li>
                                <li>Automatic renewal of your subscription unless cancelled</li>
                                <li>No refunds for partial subscription periods unless required by law</li>
                                <li>Price changes will be communicated with at least 30 days notice</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">5. User Content and Data</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                You retain all rights to the content you create using the Service. By using the Service, you grant us:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li>A license to store, process, and display your content as necessary to provide the Service</li>
                                <li>Permission to use anonymized, aggregated data for service improvement</li>
                            </ul>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
                                You are solely responsible for your content and warrant that you have all necessary rights to use and store such content.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">6. Prohibited Uses</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                You agree not to use the Service to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe upon intellectual property rights</li>
                                <li>Transmit harmful, offensive, or illegal content</li>
                                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Use the Service for any commercial purpose without authorization</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">7. Intellectual Property</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                The Service and its original content, features, and functionality are owned by AI Notes and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">8. Privacy</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">9. Service Availability</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                We strive to provide reliable service but do not guarantee uninterrupted or error-free operation. We reserve the right to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li>Modify or discontinue the Service at any time</li>
                                <li>Perform maintenance that may temporarily interrupt service</li>
                                <li>Suspend or terminate accounts that violate these terms</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">10. Limitation of Liability</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                To the maximum extent permitted by law, AI Notes shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">11. Termination</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">12. Changes to Terms</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">13. Contact Information</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                If you have any questions about these Terms and Conditions, please contact us at{" "}
                                <Link href="/contact" className="text-primary hover:underline">
                                    our contact page
                                </Link>
                                .
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                        <Link
                            href="/"
                            className="text-primary hover:underline inline-flex items-center gap-2"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

