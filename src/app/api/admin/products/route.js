import { getProducts, saveProducts, deleteRow } from '@/lib/db';

export async function GET() {
    const products = await getProducts();
    return new Response(JSON.stringify(products), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(req) {
    try {
        const product = await req.json();
        const products = await getProducts();

        if (!product.id) {
            product.id = Date.now().toString();
        }

        products.push(product);
        await saveProducts(products);

        return new Response(JSON.stringify({ success: true, product }), {
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

export async function PUT(req) {
    try {
        const updatedProduct = await req.json();
        const products = await getProducts();
        const idx = products.findIndex((p) => String(p.id) === String(updatedProduct.id));

        if (idx === -1) {
            return new Response(JSON.stringify({ error: 'Product not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        products[idx] = { ...products[idx], ...updatedProduct };
        await saveProducts(products);

        return new Response(JSON.stringify({ success: true, product: products[idx] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const id = body?.id ?? body?.productId;
        if (id == null || id === '') {
            return new Response(JSON.stringify({ error: 'Product id is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const products = await getProducts();
        const productId = String(id);
        const filtered = products.filter((p) => String(p.id || p._id) !== productId);

        if (filtered.length === products.length) {
            return new Response(JSON.stringify({ error: 'Product not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await deleteRow('products.json', productId);
        await saveProducts(filtered);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
