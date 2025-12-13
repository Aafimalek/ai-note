import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserController } from '@/controllers/userController';
import connectDB from '@/lib/db';

// Manual sync endpoint to update subscription from payment details
// This can be used for testing or manual updates
export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { email, customerId, subscriptionId, plan } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user by email
        const user = await UserController.getUserByDodoEmail(email);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found', email },
                { status: 404 }
            );
        }

        // Update subscription
        const updateData: any = {
            subscriptionStatus: 'active',
        };

        if (plan) {
            const planMap: Record<string, 'ai_basic' | 'ai_pro'> = {
                'AI Basic': 'ai_basic',
                'ai_basic': 'ai_basic',
                'AI Pro': 'ai_pro',
                'ai_pro': 'ai_pro',
            };
            updateData.subscriptionPlan = planMap[plan] || 'ai_basic';
        }

        if (customerId) {
            updateData.dodoCustomerId = customerId;
        }

        if (subscriptionId) {
            updateData.subscriptionId = subscriptionId;
        }

        const updatedUser = await UserController.updateSubscription(user.clerkId, updateData);

        return NextResponse.json({
            success: true,
            message: 'Subscription updated',
            user: {
                email: updatedUser?.email,
                subscriptionPlan: updatedUser?.subscriptionPlan,
                subscriptionStatus: updatedUser?.subscriptionStatus,
                dodoCustomerId: updatedUser?.dodoCustomerId,
            },
        });
    } catch (error: any) {
        console.error('Error syncing subscription:', error);
        return NextResponse.json(
            { error: 'Failed to sync subscription', details: error.message },
            { status: 500 }
        );
    }
}

