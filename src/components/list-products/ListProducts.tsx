import { Select, Skeleton, Stack, Text } from '@mantine/core';
import { useMemo, useState } from 'react';
import ProductCard from '../products/ProductCard.tsx';
import type { Product, Retailer } from '../../types';

type RetailersItemResult = {
    retailer: Retailer;
    products: Product[];
    error?: string;
};

type Props = {
    resultsByRetailer: RetailersItemResult[];
    loading?: boolean;
    hasQuery: boolean;
};

function productKey(p: Product): string {
    const retailer = String(p.retailer ?? 'unknown');
    const id = String(p.id ?? '');
    const link = String(p.link ?? '');
    const name = String(p.name ?? '');
    const price = p.price != null ? String(p.price) : '';
    const base = id || link || `${name}-${price}`;
    return `${retailer}:${base}`;
}

const ListProducts = ({ resultsByRetailer, loading, hasQuery }: Props) => {
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const allProducts: Product[] = useMemo(() => {
        return (resultsByRetailer ?? []).flatMap(r => r.products ?? []);
    }, [resultsByRetailer]);

    const bestPrice = useMemo(() => {
        let min = Number.POSITIVE_INFINITY;
        for (const p of allProducts) {
            if (typeof p.price === 'number' && Number.isFinite(p.price)) {
                if (p.price < min) min = p.price;
            }
        }
        return min === Number.POSITIVE_INFINITY ? undefined : min;
    }, [allProducts]);

    const sorted = useMemo(() => {
        const arr = [...allProducts];
        arr.sort((a, b) => {
            const pa =
                typeof a.price === 'number' && Number.isFinite(a.price)
                    ? a.price
                    : Number.POSITIVE_INFINITY;
            const pb =
                typeof b.price === 'number' && Number.isFinite(b.price)
                    ? b.price
                    : Number.POSITIVE_INFINITY;

            if (pa === pb) {
                const an = String(a.name ?? '');
                const bn = String(b.name ?? '');
                return an.localeCompare(bn);
            }

            return order === 'asc' ? pa - pb : pb - pa;
        });
        return arr;
    }, [allProducts, order]);

    const hasAnyProducts = allProducts.length > 0;

    if (!hasQuery) return null;

    if (loading) {
        return (
            <Stack mt='xl'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={96} radius='lg' />
                ))}
            </Stack>
        );
    }

    if (!hasAnyProducts) {
        return (
            <Stack mt='xl' gap='xs'>
                {(resultsByRetailer ?? [])
                    .filter(r => !!r.error)
                    .map(r => (
                        <Text
                            key={String(r.retailer)}
                            c='dimmed'
                            size='sm'
                            ta='center'
                        >
                            No se pudo consultar {String(r.retailer)}.
                        </Text>
                    ))}

                <Text c='dimmed' ta='center'>
                    No se encontraron productos
                </Text>
            </Stack>
        );
    }

    return (
        <Stack mt='xl'>
            <Select
                value={order}
                onChange={v => setOrder((v as 'asc' | 'desc') ?? 'asc')}
                data={[
                    { label: 'Menor precio', value: 'asc' },
                    { label: 'Mayor precio', value: 'desc' }
                ]}
                w={220}
            />

            {sorted.map(p => (
                <ProductCard
                    key={productKey(p)}
                    product={p}
                    isBestPrice={bestPrice != null && p.price === bestPrice}
                />
            ))}
        </Stack>
    );
};

export default ListProducts;
