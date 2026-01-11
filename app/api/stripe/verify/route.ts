import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        {
          isValid: false,
          tier: 'free',
        },
        { status: 200 }
      );
    }

    const tier = session.metadata?.tier as 'personal' | 'pro' | undefined;

    return NextResponse.json({
      isValid: true,
      tier: tier || 'personal',
      email: session.customer_email || undefined,
      purchasedAt: new Date(session.created * 1000),
    });
  } catch (error) {
    console.error('Stripe verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify purchase' },
      { status: 500 }
    );
  }
}
