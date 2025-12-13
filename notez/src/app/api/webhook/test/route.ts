import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Test endpoint to check webhook configuration and user matching
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        await connectDB();

        if (email) {
            // Test user lookup by email
            const user = await User.findOne({ email: email.toLowerCase() });
            return NextResponse.json({
                webhookConfigured: !!process.env.DODO_WEBHOOK_SECRET,
                userFound: !!user,
                user: user ? {
                    email: user.email,
                    clerkId: user.clerkId,
                    subscriptionPlan: user.subscriptionPlan,
                    subscriptionStatus: user.subscriptionStatus,
                    dodoCustomerId: user.dodoCustomerId,
                } : null,
            });
        }

        return NextResponse.json({
            webhookConfigured: !!process.env.DODO_WEBHOOK_SECRET,
            webhookUrl: process.env.NEXT_PUBLIC_APP_URL
                ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/dodo-payments`
                : 'Not configured',
            message: 'Add ?email=your@email.com to test user lookup',
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

