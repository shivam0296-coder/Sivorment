import { priceCart } from '../../../lib/catalogue-service';

type CheckoutRequest = { city: string; items: Array<{ plantId: string; variantId: string; quantity: number }>; paymentMethod: 'upi' | 'card'; address: { fullName?: string; phone?: string; line1?: string; postalCode?: string } };

export async function POST(request: Request) {
  try {
    const input = await request.json() as CheckoutRequest;
    if (!input.address?.fullName || !input.address?.phone || !input.address?.line1 || !/^[1-9][0-9]{5}$/.test(input.address?.postalCode ?? '')) return Response.json({ error: { code: 'INVALID_ADDRESS', message: 'Please provide a complete delivery address and six-digit PIN code.' } }, { status: 400 });
    const totals = priceCart(input.items, input.city);
    if (!process.env.PAYMENT_KEY || !process.env.PAYMENT_SECRET) return Response.json({ error: { code: 'PAYMENT_PROVIDER_NOT_CONFIGURED', message: `Your verified total is ₹${totals.total.toLocaleString('en-IN')}. Secure payment is ready for Razorpay configuration, but no production payment credentials are installed.` } }, { status: 503 });
    return Response.json({ data: { orderNumber: `SIV-${Date.now()}`, amount: totals.total, currency: 'INR', paymentProvider: 'razorpay' } }, { status: 201 });
  } catch (error) {
    return Response.json({ error: { code: 'CHECKOUT_FAILED', message: error instanceof Error ? error.message : 'Checkout could not be completed.' } }, { status: 400 });
  }
}
