const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export const fetchProducts = async () => {
    const res = await fetch(`${BACKEND_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const placeOrder = async (orderData: any, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to place order');
    return res.json();
};

export const fetchVendors = async () => {
    const res = await fetch(`${BACKEND_URL}/api/vendors`);
    if (!res.ok) throw new Error('Failed to fetch vendors');
    return res.json();
};
