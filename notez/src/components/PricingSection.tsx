"use client";

import { Button } from "@/components/ui/moving-border";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Product IDs from Dodo Payments - Replace these with your actual product IDs
const PRODUCT_IDS = {
    AI_BASIC: process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_BASIC || "pdt_ai_basic", // Replace with your AI Basic product ID
    AI_PRO: process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_PRO || "pdt_ai_pro", // Replace with your AI Pro product ID
};

export default function PricingSection() {
    const { user } = useUser();
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (productId: string, planName: string) => {
        try {
            setLoading(productId);

            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // Checkout session format requires product_cart as an array
                    // See: https://docs.dodopayments.com/developer-resources/checkout-session
                    product_cart: [
                        {
                            product_id: productId,
                            quantity: 1,
                        },
                    ],
                    customer: {
                        email: user?.emailAddresses[0]?.emailAddress,
                        full_name: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                    },
                    // Return URL to redirect after payment
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success` || 'https://www.ai-notez.fun/payment/success',
                    // Add metadata to track which plan was selected
                    metadata: {
                        plan: planName,
                        user_id: user?.id,
                    },
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create checkout session');
            }

            const data = await response.json();

            if (data.checkout_url) {
                // Redirect to Dodo Payments checkout
                window.location.href = data.checkout_url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast({
                title: "Checkout Failed",
                description: error instanceof Error ? error.message : "Unable to start checkout. Please try again.",
                variant: "destructive",
            });
            setLoading(null);
        }
    };

    const handleCustomerPortal = async () => {
        try {
            // You'll need to get the customer_id from your database
            // For now, this is a placeholder - you'll need to fetch it from your backend
            const customerId = user?.publicMetadata?.dodoCustomerId as string;

            if (!customerId) {
                toast({
                    title: "No Subscription Found",
                    description: "You don't have an active subscription.",
                    variant: "destructive",
                });
                return;
            }

            window.location.href = `/customer-portal?customer_id=${customerId}`;
        } catch (error) {
            console.error('Customer portal error:', error);
            toast({
                title: "Error",
                description: "Unable to open customer portal. Please try again.",
                variant: "destructive",
            });
        }
    };
    return (
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <div className="inline-block rounded-none bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Pricing
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-neutral-800 dark:text-neutral-100">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="max-w-[900px] text-neutral-600 dark:text-neutral-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Choose the plan that fits your needs.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Tier */}
                    <div className="flex flex-col rounded-none border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-6 transition-all duration-500 hover:shadow-xl group">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Free</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Essential note-taking.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">₹0</span>
                            <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Unlimited Notes</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Secure Storage</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Markdown Support</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-600">
                                <X className="h-4 w-4" />
                                <span>AI Features</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-600">
                                <X className="h-4 w-4" />
                                <span>Ad-free Experience</span>
                            </li>
                        </ul>
                        <SignedOut>
                            <SignUpButton>
                                <ShadcnButton variant="outline" className="w-full rounded-none border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                                    Get Started
                                </ShadcnButton>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/notes" className="w-full">
                                <ShadcnButton variant="outline" className="w-full rounded-none border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                                    Get Started
                                </ShadcnButton>
                            </Link>
                        </SignedIn>
                    </div>

                    {/* AI Basic */}
                    <div className="flex flex-col rounded-none border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-6 transition-all duration-500 hover:shadow-xl group relative overflow-hidden">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">AI Basic</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">AI power with ads.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">₹100</span>
                            <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Everything in Free</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>AI Analysis & Summary</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Grammar Check</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Suggested Tags</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-600">
                                <X className="h-4 w-4" />
                                <span>Ad-free Experience</span>
                            </li>
                        </ul>
                        <SignedOut>
                            <SignUpButton>
                                <ShadcnButton className="w-full rounded-none bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200">
                                    Subscribe
                                </ShadcnButton>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <ShadcnButton
                                className="w-full rounded-none bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                                onClick={() => handleCheckout(PRODUCT_IDS.AI_BASIC, 'AI Basic')}
                                disabled={loading === PRODUCT_IDS.AI_BASIC}
                            >
                                {loading === PRODUCT_IDS.AI_BASIC ? 'Processing...' : 'Subscribe'}
                            </ShadcnButton>
                        </SignedIn>
                    </div>

                    {/* AI Pro */}
                    <div className="flex flex-col rounded-none border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-6 transition-all duration-500 hover:shadow-2xl group relative">
                        <div className="absolute top-0 right-0 bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1">
                            POPULAR
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">AI Pro</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">The ultimate experience.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">₹200</span>
                            <span className="text-neutral-500 dark:text-neutral-400">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Everything in AI Basic</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>No Ads</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Priority Support</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Early Access Features</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                                <span>Unlimited AI Usage</span>
                            </li>
                        </ul>
                        <SignedOut>
                            <SignUpButton>
                                <div className="w-full flex justify-center">
                                    <Button
                                        borderRadius="0rem"
                                        className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-neutral-800"
                                    >
                                        Go Pro
                                    </Button>
                                </div>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="w-full flex justify-center">
                                <Button
                                    borderRadius="0rem"
                                    className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-neutral-800"
                                    onClick={() => handleCheckout(PRODUCT_IDS.AI_PRO, 'AI Pro')}
                                    disabled={loading === PRODUCT_IDS.AI_PRO}
                                >
                                    {loading === PRODUCT_IDS.AI_PRO ? 'Processing...' : 'Go Pro'}
                                </Button>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
