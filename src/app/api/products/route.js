import { getProducts } from '@/lib/db';
export const revalidate = 0; // Always fetch fresh from Neon DB

export async function GET() {
    try {
        const products = await getProducts();
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
