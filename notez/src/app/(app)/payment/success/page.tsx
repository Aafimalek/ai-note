"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, RefreshCw, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

// Force dynamic rendering to prevent build-time prerendering errors
export const dynamic = 'force-dynamic';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        // Check if payment was successful based on query parameters
        // Dodo Payments may send different parameter names
        const paymentId = searchParams.get("payment_id") || searchParams.get("paymentId") || searchParams.get("id");
        const status = searchParams.get("status") || searchParams.get("payment_status");
        const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

        console.log('Payment success page - Query params:', {
            paymentId,
            status,
            sessionId,
            allParams: Object.fromEntries(searchParams.entries()),
        });

        // If we have a payment ID or session ID, payment was likely successful
        if (paymentId || sessionId) {
            if (status === "failed" || status === "cancelled" || status === "error") {
                setStatus("error");
            } else {
                setStatus("success");
            }
        } else if (status === "failed" || status === "cancelled" || status === "error") {
            setStatus("error");
        } else {
            // If no clear status but user was redirected here, assume success
            // The webhook will handle the actual subscription activation
            setStatus("success");
        }
    }, [searchParams]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-400">Processing your payment...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">✕</div>
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        We couldn't process your payment. Please try again or contact support if the problem persists.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/">
                            <Button variant="outline">Go Home</Button>
                        </Link>
                        <Link href="/#pricing">
                            <Button>Try Again</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Thank you for your subscription! Your payment was successful. Your account will be upgraded shortly and you'll have access to all premium features.
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">
                    Note: It may take a few moments for your subscription to activate. If you don't see your premium features, please refresh the page.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/notes">
                        <Button>Go to Notes</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline">Go Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}


