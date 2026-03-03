import { getOrders, saveOrders } from '@/lib/db';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        let orders = await getOrders();

        if (email) {
            orders = orders.filter(o => o.email === email);
        }

        return new Response(JSON.stringify(orders), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=30' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(req) {
    try {
        const orderData = await req.json();
        const orders = await getOrders();

        if (!orderData.userId && !orderData.address?.email) {
            return new Response(JSON.stringify({ error: "Missing user identification" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Standardized Order Schema
        const newOrder = {
            id: `ORD-${Date.now()}`,
            userId: orderData.userId || null,
            customer: orderData.address.fullName,
            email: orderData.address.email,
            totalPrice: orderData.totalPrice || orderData.total || 0,
            status: 'Processing',
            createdAt: new Date().toISOString(),
            address: orderData.address,
            products: orderData.products || orderData.items || []
        };

        orders.push(newOrder);
        await saveOrders(orders);

        return new Response(JSON.stringify({ success: true, order: newOrder }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


