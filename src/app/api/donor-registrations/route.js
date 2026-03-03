import { getDonorRegistrations, saveDonorRegistrations } from '@/lib/db';

export async function GET() {
    const registrations = await getDonorRegistrations();
    return new Response(JSON.stringify(registrations), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(req) {
    try {
        const registration = await req.json();
        const registrations = await getDonorRegistrations();

        if (!registration.id) {
            registration.id = Date.now().toString();
        }
        if (!registration.submitted_at) {
            registration.submitted_at = new Date().toISOString();
        }

        registrations.push(registration);
        await saveDonorRegistrations(registrations);

        return new Response(JSON.stringify({ success: true, registration }), {
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
