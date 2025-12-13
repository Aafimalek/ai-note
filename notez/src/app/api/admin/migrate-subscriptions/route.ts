import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// This endpoint migrates existing users to have default subscription values
// Only run this once or manually for existing users
export async function POST() {
  try {
    // Only allow in development or with admin auth
    if (process.env.NODE_ENV === 'production') {
      const { userId } = await auth();
      // Add your admin check here if needed
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    await connectDB();

    // Update all users without subscription fields
    const result = await User.updateMany(
      {
        $or: [
          { subscriptionPlan: { $exists: false } },
          { subscriptionStatus: { $exists: false } },
        ],
      },
      {
        $set: {
          subscriptionPlan: 'free',
          subscriptionStatus: 'none',
        },
      }
    );

    return NextResponse.json({
      message: 'Migration completed',
      updated: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error.message },
      { status: 500 }
    );
  }
}

