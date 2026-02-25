import type { components, paths } from '../api/openapi.types';

export type Product = components['schemas']['Product'];

export type Retailer = NonNullable<
    paths['/retailers/item']['post']['requestBody']['content']['application/json']['retailers']
>[number];

export type RetailersItemBody =
    paths['/retailers/item']['post']['requestBody']['content']['application/json'];

export type RetailersListBody =
    paths['/retailers/list']['post']['requestBody']['content']['application/json'];

export type RetailersItemResponse =
    paths['/retailers/item']['post']['responses']['200']['content']['application/json'];

export type RetailersListResponse =
    paths['/retailers/list']['post']['responses']['200']['content']['application/json'];

export const RETAILERS = [
    'dia',
    'carrefour',
    'jumbo',
    'vea'
] as const satisfies readonly Retailer[];

export type RetailerId = (typeof RETAILERS)[number];

export const RETAILER_META: Record<
    RetailerId,
    { label: string; logo: string; color: string }
> = {
    dia: { label: 'DIA', logo: '/images/dia.png', color: 'red' },
    carrefour: {
        label: 'Carrefour',
        logo: '/images/carrefour.png',
        color: 'blue'
    },
    jumbo: { label: 'Jumbo', logo: '/images/jumbo.png', color: 'green' },
    vea: { label: 'Vea', logo: '/images/vea.png', color: 'yellow' }
};

export function normalizeRetailer(r: string): RetailerId {
    const t = String(r ?? '')
        .toLowerCase()
        .trim();
    if (t.includes('carrefour')) return 'carrefour';
    if (t.includes('jumbo')) return 'jumbo';
    if (t.includes('vea')) return 'vea';
    return 'dia';
}
