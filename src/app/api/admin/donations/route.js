import { getDonations, saveDonations } from '@/lib/db';

export async function GET() {
    const donations = await getDonations();
    return new Response(JSON.stringify(donations), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(req) {
    try {
        const donation = await req.json();
        const donations = await getDonations();

        if (!donation.id) {
            donation.id = Date.now().toString();
        }

        donations.push(donation);
        await saveDonations(donations);

        return new Response(JSON.stringify({ success: true, donation }), {
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
