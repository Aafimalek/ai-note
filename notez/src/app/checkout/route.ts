// app/checkout/route.ts
import { Checkout } from '@dodopayments/nextjs'

// Validate environment variables
const apiKey = process.env.DODO_PAYMENTS_API_KEY;
const returnUrl = process.env.DODO_PAYMENTS_RETURN_URL;
const environment = process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode' | undefined;

// Log configuration status (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Dodo Payments Checkout Config:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    hasReturnUrl: !!returnUrl,
    environment: environment || 'Not set',
  });
}

// GET handler for static checkout (product-based checkout via query parameters)
export const GET = Checkout({
  bearerToken: apiKey!,
  returnUrl: returnUrl,
  environment: environment,
  type: "static",
});

// POST handler for checkout sessions (recommended for subscriptions)
// This is better for subscription products as it provides more customization
export const POST = Checkout({
  bearerToken: apiKey!,
  returnUrl: returnUrl,
  environment: environment,
  type: "session", // Recommended for subscriptions
});


