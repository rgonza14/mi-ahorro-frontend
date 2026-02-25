import type { Product, Retailer, RetailersListResponse } from '../../../types';

export type OverridesMap = Record<string, string>;
export type SelectedItem = { query: string; product: Product };
export type RetailerSelection = {
    items: SelectedItem[];
    missing: string[];
    total: number;
};

export function formatMoney(n: number) {
    return `$${Math.round(n).toLocaleString('es-AR')}`;
}

export function ovKey(retailer: Retailer, query: string) {
    return `${retailer}::${query}`;
}

export function pickChosenProduct(
    products: Product[],
    chosenId?: string | null
) {
    if (!products?.length) return null;
    if (chosenId) {
        const hit = products.find(p => String(p.id ?? '') === String(chosenId));
        if (hit) return hit;
    }
    return products[0];
}

export function buildRetailerSelection(
    data: RetailersListResponse,
    retailer: Retailer,
    overrides: OverridesMap
): RetailerSelection {
    const items: SelectedItem[] = [];
    const missing: string[] = [];
    const seen = new Set<string>();

    for (const d of data.detail) {
        const query = String(d.query ?? '').trim() || 'Ítem sin nombre';
        const rr = d.results.find(x => x.retailer === retailer);
        const products = rr?.products ?? [];

        const chosenId = overrides[ovKey(retailer, query)];
        const chosen = pickChosenProduct(products, chosenId);

        if (!chosen) {
            if (!seen.has(query)) {
                seen.add(query);
                missing.push(query);
            }
            continue;
        }

        const dedupeId = String(
            chosen.id ??
                `${chosen.retailer}-${chosen.name}-${chosen.price ?? ''}`
        );
        if (seen.has(dedupeId)) continue;

        seen.add(dedupeId);
        items.push({ query, product: chosen });
    }

    const total = items.reduce(
        (acc, x) => acc + Number(x.product.price ?? 0),
        0
    );
    return { items, missing, total };
}

export function getOptionsForQueryRetailer(
    data: RetailersListResponse,
    retailer: Retailer,
    query: string
): Product[] {
    const d = data.detail.find(
        x => String(x.query ?? '').trim() === String(query ?? '').trim()
    );
    const rr = d?.results.find(x => x.retailer === retailer);
    return rr?.products ?? [];
}

export function getDefaultProductIdForQueryRetailer(
    data: RetailersListResponse,
    retailer: Retailer,
    query: string
): string {
    const options = getOptionsForQueryRetailer(data, retailer, query);
    return String(options?.[0]?.id ?? '');
}

export function computeUiSummaries(
    data: RetailersListResponse,
    overrides: OverridesMap
): Map<Retailer, { total: number; missing: number }> {
    const m = new Map<Retailer, { total: number; missing: number }>();
    for (const r of data.ranking) {
        const retailer = r.retailer as Retailer;
        const sel = buildRetailerSelection(data, retailer, overrides);
        m.set(retailer, { total: sel.total, missing: sel.missing.length });
    }
    return m;
}

export function computeUiBestRetailer(
    data: RetailersListResponse,
    uiSummaries: Map<Retailer, { total: number; missing: number }>
): Retailer | null {
    let best: { retailer: Retailer; missing: number; total: number } | null =
        null;

    for (const r of data.ranking) {
        const retailer = r.retailer as Retailer;
        const s = uiSummaries.get(retailer) ?? {
            total: 0,
            missing: data.items.length
        };
        const cand = { retailer, missing: s.missing, total: s.total };

        if (!best) best = cand;
        else if (cand.missing < best.missing) best = cand;
        else if (cand.missing === best.missing && cand.total < best.total)
            best = cand;
    }

    return best?.retailer ?? null;
}
