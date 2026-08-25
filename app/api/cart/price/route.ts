import { priceCart } from '../../../../lib/catalogue-service';

type PriceRequest = { city: string; couponCode?: string; items: Array<{ plantId: string; variantId: string; quantity: number }> };

export async function POST(request: Request) {
  try {
    const input = await request.json() as PriceRequest;
    if (!input.city || !Array.isArray(input.items) || input.items.some((item) => item.quantity < 1 || item.quantity > 20)) throw new Error('Invalid cart');
    return Response.json({ data: priceCart(input.items, input.city, input.couponCode) });
  } catch (error) {
    return Response.json({ error: { code: 'CART_VALIDATION_FAILED', message: error instanceof Error ? error.message : 'The cart could not be priced.' } }, { status: 400 });
  }
}
