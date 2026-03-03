'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Key depends on the logged-in user so cart updates without page reload
    const cartKey = typeof window !== 'undefined'
        ? (user ? `enabled_cart_${user.id || user._id}` : 'enabled_cart_guest')
        : 'enabled_cart_guest';

    // Load cart from localStorage when the key changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // 1. Load current key's cart
            const savedCart = localStorage.getItem(cartKey);
            let currentCart = [];
            if (savedCart) {
                try {
                    const parsed = JSON.parse(savedCart);
                    // Filter out any null/undefined or malformed items
                    currentCart = Array.isArray(parsed) ? parsed.filter(item => item && (item.id || item._id)) : [];
                } catch (e) {
                    console.error('Failed to parse cart:', e);
                }
            }

            // 2. If we are a logged-in user, check if there's a guest cart to merge
            if (cartKey !== 'enabled_cart_guest') {
                const guestCartStr = localStorage.getItem('enabled_cart_guest');
                if (guestCartStr) {
                    try {
                        const guestCart = JSON.parse(guestCartStr);
                        if (Array.isArray(guestCart) && guestCart.length > 0) {
                            console.log('Merging guest cart into user cart...');

                            // Merge logic: append new items, update quantities for existing ones
                            const mergedCart = [...currentCart];
                            guestCart.forEach(guestItem => {
                                // Validate guest item
                                if (!guestItem || (!guestItem.id && !guestItem._id)) return;

                                const existingIndex = mergedCart.findIndex(item => (item.id === guestItem.id) || (item.id === guestItem._id));
                                if (existingIndex > -1) {
                                    mergedCart[existingIndex].quantity = (mergedCart[existingIndex].quantity || 1) + (guestItem.quantity || 1);
                                } else {
                                    mergedCart.push(guestItem);
                                }
                            });

                            console.log(`Successfully merged ${guestCart.length} items from guest cart.`);
                            currentCart = mergedCart;
                            // Clear guest cart after merging
                            localStorage.setItem('enabled_cart_guest', JSON.stringify([]));
                            localStorage.setItem('enabled_cart', JSON.stringify([])); // Also clear legacy key
                        }
                    } catch (e) {
                        console.error('Failed to merge guest cart:', e);
                    }
                }
            }

            setCartItems(currentCart);
            setIsInitialized(true);
        }
    }, [cartKey]);

    // Sync cart to localStorage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(cartKey, JSON.stringify(cartItems));

            // Sync to legacy key for compatibility if needed, though we prefer user-specific
            if (cartKey === 'enabled_cart_guest') {
                localStorage.setItem('enabled_cart', JSON.stringify(cartItems));
            }
        }
    }, [cartItems, isInitialized, cartKey]);

    const DEFAULT_MAX_QUANTITY = 9;

    const isOutOfStock = (product) =>
        product.status === 'Out of Stock' || product.inStock === false;

    const addToCart = (product) => {
        if (isOutOfStock(product)) return;
        const maxQty = Math.max(1, Math.min(99, Number(product.quantity) || DEFAULT_MAX_QUANTITY));
        const normalizedId = product._id || product.id || String(Math.random());
        const normalizedProduct = {
            ...product,
            id: normalizedId,
            name: product.name || product.title || 'Product',
            price: Number(product.price) || 0,
            image: product.image || product.imageUrl || '/Girly.png',
            maxQuantity: maxQty,
        };
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === normalizedId);
            if (existingItem) {
                const cap = existingItem.maxQuantity ?? maxQty;
                const nextQty = Math.min((existingItem.quantity || 1) + 1, cap);
                return prevItems.map((item) =>
                    item.id === normalizedId ? { ...item, quantity: nextQty, maxQuantity: cap } : item
                );
            }
            return [...prevItems, { ...normalizedProduct, quantity: 1, maxQuantity: maxQty }];
        });
    };


    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id !== productId) return item;
                const maxQty = item.maxQuantity ?? DEFAULT_MAX_QUANTITY;
                const capped = Math.min(Math.max(1, quantity), maxQty);
                return { ...item, quantity: capped };
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 1),
        0
    );

    const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
