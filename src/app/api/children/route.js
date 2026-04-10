import { getChildren } from '@/lib/db';

export async function GET() {
    const children = await getChildren();
    return new Response(JSON.stringify(children), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
    });
}
