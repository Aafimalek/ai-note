import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserController } from '@/controllers/userController';
import { getSubscriptionInfo } from '@/helpers/subscriptionHelper';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await UserController.getUserByClerkId(userId);

        if (!user) {
            return NextResponse.json(
                {
                    subscription: getSubscriptionInfo('free', 'none')
                },
                { status: 200 }
            );
        }

        const subscriptionInfo = getSubscriptionInfo(
            user.subscriptionPlan || 'free',
            user.subscriptionStatus || 'none'
        );

        return NextResponse.json({
            subscription: subscriptionInfo,
            user: {
                email: user.email,
                dodoCustomerId: user.dodoCustomerId,
                subscriptionId: user.subscriptionId,
                subscriptionExpiresAt: user.subscriptionExpiresAt,
            },
        });
    } catch (error: any) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}

