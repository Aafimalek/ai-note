// app/api/webhook/dodo-payments/route.ts
import { Webhooks } from '@dodopayments/nextjs'

export const POST = Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET!,

  // General payload handler - processes all webhook events
  onPayload: async (payload) => {
    console.log('Dodo Payments Webhook Event:', payload.type);
    // Add your general webhook handling logic here
    // You can update your database, send emails, etc.
  },

  // Payment event handlers
  onPaymentSucceeded: async (payload) => {
    console.log('Payment Succeeded:', payload);
    // Handle successful payment
    // Update user subscription status in your database
    // Example: await updateUserSubscription(payload.customer_id, 'active');
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
  onSubscriptionActive: async (payload) => {
    console.log('Subscription Active:', payload);
    // Update user subscription to active in your database
    // This is important for granting access to AI features
  },

  onSubscriptionRenewed: async (payload) => {
    console.log('Subscription Renewed:', payload);
    // Handle subscription renewal
    // Extend subscription period in your database
  },

  onSubscriptionCancelled: async (payload) => {
    console.log('Subscription Cancelled:', payload);
    // Handle subscription cancellation
    // Update subscription status, revoke access to premium features
  },

  onSubscriptionFailed: async (payload) => {
    console.log('Subscription Failed:', payload);
    // Handle failed subscription payment
    // Notify user, update status, etc.
  },

  onSubscriptionExpired: async (payload) => {
    console.log('Subscription Expired:', payload);
    // Handle expired subscription
    // Revoke premium access
  },

  onSubscriptionOnHold: async (payload) => {
    console.log('Subscription On Hold:', payload);
    // Handle subscription on hold
  },

  onSubscriptionPlanChanged: async (payload) => {
    console.log('Subscription Plan Changed:', payload);
    // Handle plan upgrade/downgrade
    // Update user's plan in database (AI Basic <-> AI Pro)
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


