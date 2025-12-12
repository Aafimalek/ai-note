"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

// Force dynamic rendering to prevent build-time prerendering errors
export const dynamic = 'force-dynamic';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        // Check if payment was successful based on query parameters
        const paymentId = searchParams.get("payment_id");
        const status = searchParams.get("status");

        if (paymentId && status === "success") {
            setStatus("success");
        } else if (status === "failed" || status === "cancelled") {
            setStatus("error");
        } else {
            // If no clear status, assume success (user was redirected here)
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
                    Thank you for your subscription. Your account has been upgraded and you now have access to all premium features.
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


