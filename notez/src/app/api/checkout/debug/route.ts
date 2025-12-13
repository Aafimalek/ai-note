// Debug endpoint to check checkout configuration (remove in production)
import { NextResponse } from 'next/server'

export async function GET() {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const returnUrl = process.env.DODO_PAYMENTS_RETURN_URL;
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT;

    return NextResponse.json({
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        apiKeyPrefix: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
        hasReturnUrl: !!returnUrl,
        returnUrl: returnUrl || 'Not set',
        environment: environment || 'Not set',
        // Don't expose the full API key for security
    });
}

