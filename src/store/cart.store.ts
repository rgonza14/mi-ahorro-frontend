import { computed } from 'nanostores';
import { persistentJSON } from '@nanostores/persistent';
import type { Product } from '../types';

export type CartItem = {
    product: Product;
    qty: number;
};

export type CartState = Record<string, CartItem>;

const MAX_QTY = 10;

export const $cart = persistentJSON<CartState>('cart', {});

export const cartCount = computed($cart, cart => Object.keys(cart).length);

export const cartTotal = computed($cart, cart =>
    Object.values(cart).reduce(
        (acc, it) => acc + (it.product.price ?? 0) * it.qty,
        0
    )
);

function clampQty(qty: number) {
    return Math.max(0, Math.min(MAX_QTY, qty));
}

export function getQty(productId: string) {
    return $cart.get()[productId]?.qty ?? 0;
}

export function addOne(product: Product) {
    const id = String(product.id);
    const cart = $cart.get();
    const current = cart[id]?.qty ?? 0;
    const next = clampQty(current + 1);

    if (next === 0) {
        if (cart[id]) {
            const { [id]: _, ...rest } = cart;
            $cart.set(rest);
        }
        return;
    }

    $cart.set({
        ...cart,
        [id]: { product, qty: next }
    });
}

export function removeOne(productId: string) {
    const id = String(productId);
    const cart = $cart.get();
    const current = cart[id]?.qty ?? 0;
    const next = clampQty(current - 1);

    if (next <= 0) {
        if (!cart[id]) return;
        const { [id]: _, ...rest } = cart;
        $cart.set(rest);
        return;
    }

    $cart.set({
        ...cart,
        [id]: { ...cart[id], qty: next }
    });
}

export function setQty(product: Product, qty: number) {
    const id = String(product.id);
    const cart = $cart.get();
    const next = clampQty(qty);

    if (next <= 0) {
        if (!cart[id]) return;
        const { [id]: _, ...rest } = cart;
        $cart.set(rest);
        return;
    }

    $cart.set({
        ...cart,
        [id]: { product, qty: next }
    });
}

export function removeItem(productId: string) {
    const id = String(productId);
    const cart = $cart.get();
    if (!cart[id]) return;
    const { [id]: _, ...rest } = cart;
    $cart.set(rest);
}

export function clearCart() {
    $cart.set({});
}
