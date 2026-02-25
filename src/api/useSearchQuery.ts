import { useQuery } from '@tanstack/react-query';
import type {
    Retailer,
    RetailersItemBody,
    RetailersItemResponse,
    RetailersListBody,
    RetailersListResponse
} from '../types';

async function postJson<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? 'API error');
    return json as T;
}

export async function fetchRetailersItem(params: {
    baseUrl: string;
    body: RetailersItemBody;
}): Promise<RetailersItemResponse> {
    const { baseUrl, body } = params;
    return postJson<RetailersItemResponse>(`${baseUrl}/retailers/item`, body);
}

export async function fetchRetailersList(params: {
    baseUrl: string;
    body: RetailersListBody;
}): Promise<RetailersListResponse> {
    const { baseUrl, body } = params;
    return postJson<RetailersListResponse>(`${baseUrl}/retailers/list`, body);
}

export function useRetailersItemQuery(params: {
    retailers: Retailer[];
    query: string;
    limit?: number;
    enabled?: boolean;
    baseUrl?: string;
}) {
    const {
        retailers,
        query,
        limit,
        enabled = true,
        baseUrl = 'http://localhost:3000'
    } = params;

    const keyRetailers = [...retailers].sort().join(',');

    const body: RetailersItemBody = {
        query,
        limit,
        retailers
    };

    return useQuery({
        queryKey: ['retailers', 'item', keyRetailers, query, limit],
        queryFn: () => fetchRetailersItem({ baseUrl, body }),
        enabled: enabled && !!query.trim() && retailers.length > 0,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false
    });
}

export function useRetailersListQuery(params: {
    retailers: Retailer[];
    items: string[];
    limit?: number;
    enabled?: boolean;
    baseUrl?: string;
}) {
    const {
        retailers,
        items,
        limit,
        enabled = true,
        baseUrl = 'http://localhost:3000'
    } = params;

    const cleanItems = items.map(x => x.trim()).filter(Boolean);

    const keyRetailers = [...retailers].sort().join(',');
    const keyItems = cleanItems.join('|');

    const body: RetailersListBody = {
        items: cleanItems,
        limit,
        retailers
    };

    return useQuery({
        queryKey: ['retailers', 'list', keyRetailers, keyItems, limit],
        queryFn: () => fetchRetailersList({ baseUrl, body }),
        enabled: enabled && cleanItems.length > 0 && retailers.length > 0,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false
    });
}
