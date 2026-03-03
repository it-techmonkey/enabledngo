import { getOrders } from '@/lib/db';

export async function GET() {
    const orders = await getOrders();
    return new Response(JSON.stringify(orders), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
