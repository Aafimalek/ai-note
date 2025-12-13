"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SubscriptionInfo } from "@/helpers/subscriptionHelper";

export function useSubscription() {
    const { user } = useUser();
    const [subscription, setSubscription] = useState<SubscriptionInfo>({
        plan: 'free',
        status: 'none',
        hasAIAccess: false,
        hasAdFree: false,
        hasUnlimitedAI: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchSubscription = async () => {
            try {
                const response = await fetch('/api/user/subscription');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Subscription data received:', data.subscription);
                    setSubscription(data.subscription);
                } else {
                    // If API fails, default to no access
                    console.warn('Failed to fetch subscription, defaulting to free plan');
                    setSubscription({
                        plan: 'free',
                        status: 'none',
                        hasAIAccess: false,
                        hasAdFree: false,
                        hasUnlimitedAI: false,
                    });
                }
            } catch (error) {
                console.error('Error fetching subscription:', error);
                // On error, default to no access
                setSubscription({
                    plan: 'free',
                    status: 'none',
                    hasAIAccess: false,
                    hasAdFree: false,
                    hasUnlimitedAI: false,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();

        // Refresh subscription every 30 seconds
        const interval = setInterval(fetchSubscription, 30000);
        return () => clearInterval(interval);
    }, [user]);

    return { subscription, loading };
}

