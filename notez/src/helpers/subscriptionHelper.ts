import { SubscriptionPlan, SubscriptionStatus } from '@/models/User';

export interface SubscriptionInfo {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    hasAIAccess: boolean;
    hasAdFree: boolean;
    hasUnlimitedAI: boolean;
}

/**
 * Check if user has access to AI features
 */
export function hasAIAccess(plan: SubscriptionPlan, status: SubscriptionStatus): boolean {
    if (status !== 'active') return false;
    return plan === 'ai_basic' || plan === 'ai_pro';
}

/**
 * Check if user has ad-free experience
 */
export function hasAdFree(plan: SubscriptionPlan, status: SubscriptionStatus): boolean {
    if (status !== 'active') return false;
    return plan === 'ai_pro';
}

/**
 * Check if user has unlimited AI usage
 */
export function hasUnlimitedAI(plan: SubscriptionPlan, status: SubscriptionStatus): boolean {
    if (status !== 'active') return false;
    return plan === 'ai_pro';
}

/**
 * Get subscription info for a user
 */
export function getSubscriptionInfo(
    plan: SubscriptionPlan = 'free',
    status: SubscriptionStatus = 'none'
): SubscriptionInfo {
    return {
        plan,
        status,
        hasAIAccess: hasAIAccess(plan, status),
        hasAdFree: hasAdFree(plan, status),
        hasUnlimitedAI: hasUnlimitedAI(plan, status),
    };
}

/**
 * Map Dodo Payments plan name to our subscription plan
 */
export function mapDodoPlanToSubscriptionPlan(planName: string): SubscriptionPlan {
    const normalized = planName.toLowerCase();
    if (normalized.includes('pro') || normalized.includes('ai pro')) {
        return 'ai_pro';
    }
    if (normalized.includes('basic') || normalized.includes('ai basic')) {
        return 'ai_basic';
    }
    return 'free';
}

/**
 * Map Dodo Payments subscription status to our status
 */
export function mapDodoStatusToSubscriptionStatus(status: string): SubscriptionStatus {
    const normalized = status.toLowerCase();
    if (normalized === 'active') return 'active';
    if (normalized === 'cancelled') return 'cancelled';
    if (normalized === 'expired') return 'expired';
    if (normalized === 'on_hold' || normalized === 'onhold') return 'on_hold';
    return 'none';
}

