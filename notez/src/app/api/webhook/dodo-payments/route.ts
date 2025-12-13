// app/api/webhook/dodo-payments/route.ts
import { Webhooks } from '@dodopayments/nextjs'
import { UserController } from '@/controllers/userController';
import { mapDodoPlanToSubscriptionPlan, mapDodoStatusToSubscriptionStatus } from '@/helpers/subscriptionHelper';

export const POST = Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET!,

  // General payload handler - processes all webhook events
  onPayload: async (payload) => {
    console.log('Dodo Payments Webhook Event:', payload.type);
    // Add your general webhook handling logic here
    // You can update your database, send emails, etc.
  },

  // Payment event handlers
  onPaymentSucceeded: async (payload: any) => {
    console.log('=== Payment Succeeded Webhook ===');
    console.log('Full Payload:', JSON.stringify(payload, null, 2));
    try {
      const customerId = payload.customer?.customer_id;
      const customerEmail = payload.customer?.email;
      const subscriptionId = payload.subscription_id || payload.subscription?.id;
      const planName = payload.metadata?.plan;

      console.log('Extracted Data:', { customerId, customerEmail, subscriptionId, planName });

      if (customerEmail) {
        // Try to find user by email (case-insensitive)
        const user = await UserController.getUserByDodoEmail(customerEmail);
        console.log('User found by email:', user ? { email: user.email, clerkId: user.clerkId } : 'NOT FOUND');

        if (user) {
          // Update customer_id if not set
          if (customerId && !user.dodoCustomerId) {
            await UserController.updateSubscription(user.clerkId, {
              dodoCustomerId: customerId,
            });
            console.log(`✓ Updated customer ID for user ${user.email}`);
          }

          // If this is a subscription payment and we have plan info, activate it
          if (subscriptionId && planName) {
            const plan = mapDodoPlanToSubscriptionPlan(planName);
            await UserController.updateSubscription(user.clerkId, {
              subscriptionPlan: plan,
              subscriptionStatus: 'active',
              dodoCustomerId: customerId || user.dodoCustomerId,
              subscriptionId: subscriptionId,
            });
            console.log(`✓ Activated subscription for user ${user.email} - Plan: ${plan}`);
          }
        } else {
          console.error('❌ User not found for email:', customerEmail);
          console.log('Available user emails in database (for debugging):');
          // This would require a different query, but for now just log the issue
        }
      } else {
        console.warn('⚠️ No customer email found in payment payload');
      }
    } catch (error) {
      console.error('❌ Error handling payment success:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
  },

  onPaymentFailed: async (payload) => {
    console.log('Payment Failed:', payload);
    // Handle failed payment
    // Notify user, update subscription status, etc.
  },

  onPaymentProcessing: async (payload) => {
    console.log('Payment Processing:', payload);
    // Handle payment in processing state
  },

  onPaymentCancelled: async (payload) => {
    console.log('Payment Cancelled:', payload);
    // Handle cancelled payment
  },

  // Refund event handlers
  onRefundSucceeded: async (payload) => {
    console.log('Refund Succeeded:', payload);
    // Handle successful refund
  },

  onRefundFailed: async (payload) => {
    console.log('Refund Failed:', payload);
    // Handle failed refund
  },

  // Subscription event handlers (CRITICAL for your use case)
  onSubscriptionActive: async (payload: any) => {
    console.log('=== Subscription Active Webhook ===');
    console.log('Full Payload:', JSON.stringify(payload, null, 2));
    try {
      // Payload structure: { type, data: { customer: { customer_id, email }, subscription_id, metadata: { plan }, ... } }
      const data = payload.data || payload;
      const customerId = data.customer?.customer_id || payload.customer?.id;
      const subscriptionId = data.subscription_id || payload.subscription_id || payload.id;
      const customerEmail = data.customer?.email || data.customer_email || payload.customer?.email || payload.customer_email || payload.email;
      const planName = data.metadata?.plan || data.plan?.name || data.product?.name || payload.metadata?.plan || payload.plan?.name || 'AI Basic';

      console.log('Extracted Data:', { customerId, subscriptionId, customerEmail, planName });

      // Find user by customer ID first, then by email
      let user = customerId
        ? await UserController.getUserByDodoCustomerId(customerId)
        : null;

      console.log('User found by customer ID:', user ? { email: user.email, clerkId: user.clerkId } : 'NOT FOUND');

      if (!user && customerEmail) {
        user = await UserController.getUserByDodoEmail(customerEmail);
        console.log('User found by email:', user ? { email: user.email, clerkId: user.clerkId } : 'NOT FOUND');
      }

      if (user) {
        const plan = mapDodoPlanToSubscriptionPlan(planName);
        const updateData = {
          subscriptionPlan: plan,
          subscriptionStatus: 'active' as const,
          dodoCustomerId: customerId || user.dodoCustomerId,
          subscriptionId: subscriptionId,
          subscriptionExpiresAt: payload.current_period_end
            ? new Date(payload.current_period_end * 1000)
            : payload.expires_at
              ? new Date(payload.expires_at * 1000)
              : undefined,
        };

        console.log('Updating subscription with data:', updateData);
        const updatedUser = await UserController.updateSubscription(user.clerkId, updateData);
        console.log(`✓ Successfully updated subscription for user ${user.email} to ${plan}`);
        console.log('Updated user data:', {
          plan: updatedUser?.subscriptionPlan,
          status: updatedUser?.subscriptionStatus,
          customerId: updatedUser?.dodoCustomerId,
        });
      } else {
        console.error('❌ User not found for subscription activation');
        console.error('Search criteria:', { customerId, customerEmail });
        console.error('Full payload for debugging:', JSON.stringify(payload, null, 2));
      }
    } catch (error) {
      console.error('❌ Error handling subscription active:', error);
      console.error('Error details:', error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error);
    }
  },

  onSubscriptionRenewed: async (payload: any) => {
    console.log('Subscription Renewed:', payload);
    try {
      const customerId = payload.customer_id || payload.customer?.id;
      const user = customerId
        ? await UserController.getUserByDodoCustomerId(customerId)
        : null;

      if (user) {
        await UserController.updateSubscription(user.clerkId, {
          subscriptionStatus: 'active',
          subscriptionExpiresAt: payload.current_period_end
            ? new Date(payload.current_period_end * 1000)
            : undefined,
        });
        console.log(`Renewed subscription for user ${user.email}`);
      }
    } catch (error) {
      console.error('Error handling subscription renewal:', error);
    }
  },

  onSubscriptionCancelled: async (payload: any) => {
    console.log('Subscription Cancelled:', payload);
    try {
      const customerId = payload.customer_id || payload.customer?.id;
      const user = customerId
        ? await UserController.getUserByDodoCustomerId(customerId)
        : null;

      if (user) {
        await UserController.updateSubscription(user.clerkId, {
          subscriptionStatus: 'cancelled',
        });
        console.log(`Cancelled subscription for user ${user.email}`);
      }
    } catch (error) {
      console.error('Error handling subscription cancellation:', error);
    }
  },

  onSubscriptionFailed: async (payload: any) => {
    console.log('Subscription Failed:', payload);
    try {
      const customerId = payload.customer_id || payload.customer?.id;
      const user = customerId
        ? await UserController.getUserByDodoCustomerId(customerId)
        : null;

      if (user) {
        // Keep subscription active but you might want to notify the user
        // The subscription will be marked as expired if payment continues to fail
        console.log(`Subscription payment failed for user ${user.email}`);
      }
    } catch (error) {
      console.error('Error handling subscription failure:', error);
    }
  },

  onSubscriptionExpired: async (payload: any) => {
    console.log('Subscription Expired:', payload);
    try {
      const customerId = payload.customer_id || payload.customer?.id;
      const user = customerId
        ? await UserController.getUserByDodoCustomerId(customerId)
        : null;

      if (user) {
        await UserController.updateSubscription(user.clerkId, {
          subscriptionStatus: 'expired',
          subscriptionPlan: 'free', // Downgrade to free
        });
        console.log(`Expired subscription for user ${user.email}, downgraded to free`);
      }
    } catch (error) {
      console.error('Error handling subscription expiration:', error);
    }
  },

  onSubscriptionOnHold: async (payload: any) => {
    console.log('Subscription On Hold:', payload);
    try {
      const customerId = payload.customer_id || payload.customer?.id;
      const user = customerId
        ? await UserController.getUserByDodoCustomerId(customerId)
        : null;

      if (user) {
        await UserController.updateSubscription(user.clerkId, {
          subscriptionStatus: 'on_hold',
        });
        console.log(`Subscription on hold for user ${user.email}`);
      }
    } catch (error) {
      console.error('Error handling subscription on hold:', error);
    }
  },

  onSubscriptionPlanChanged: async (payload: any) => {
    console.log('Subscription Plan Changed:', payload);
    try {
      const customerId = payload.customer_id || payload.customer?.id;
      const planName = payload.plan?.name || payload.product?.name || payload.metadata?.plan || 'AI Basic';
      const user = customerId
        ? await UserController.getUserByDodoCustomerId(customerId)
        : null;

      if (user) {
        const plan = mapDodoPlanToSubscriptionPlan(planName);
        await UserController.updateSubscription(user.clerkId, {
          subscriptionPlan: plan,
          subscriptionStatus: 'active',
        });
        console.log(`Changed subscription plan for user ${user.email} to ${plan}`);
      }
    } catch (error) {
      console.error('Error handling subscription plan change:', error);
    }
  },

  // Dispute handlers (optional but recommended)
  onDisputeOpened: async (payload) => {
    console.log('Dispute Opened:', payload);
  },

  onDisputeAccepted: async (payload) => {
    console.log('Dispute Accepted:', payload);
  },

  onDisputeCancelled: async (payload) => {
    console.log('Dispute Cancelled:', payload);
  },

  onDisputeChallenged: async (payload) => {
    console.log('Dispute Challenged:', payload);
  },

  onDisputeWon: async (payload) => {
    console.log('Dispute Won:', payload);
  },

  onDisputeLost: async (payload) => {
    console.log('Dispute Lost:', payload);
  },

  onDisputeExpired: async (payload) => {
    console.log('Dispute Expired:', payload);
  },

  // License key handler (if you use license keys)
  onLicenseKeyCreated: async (payload) => {
    console.log('License Key Created:', payload);
  },
});


