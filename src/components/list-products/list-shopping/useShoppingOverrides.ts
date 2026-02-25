import { useMemo, useState } from 'react';
import type { Product, Retailer, RetailersListResponse } from '../../../types';
import type { CartState } from '../../../store';
import { removeItem } from '../../../store';
import {
    type OverridesMap,
    ovKey,
    getOptionsForQueryRetailer,
    getDefaultProductIdForQueryRetailer,
    computeUiSummaries,
    computeUiBestRetailer
} from './shopping.utils';

export function useShoppingOverrides(
    data: RetailersListResponse | undefined,
    cart: CartState
) {
    const [overrides, setOverrides] = useState<OverridesMap>({});
    const [opened, setOpened] = useState(false);
    const [activeRetailer, setActiveRetailer] = useState<Retailer | null>(null);
    const [activeQuery, setActiveQuery] = useState('');
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
        null
    );

    const options = useMemo(() => {
        if (!data || !activeRetailer || !activeQuery) return [];
        return getOptionsForQueryRetailer(data, activeRetailer, activeQuery);
    }, [data, activeRetailer, activeQuery]);

    const uiSummaries = useMemo(() => {
        if (!data)
            return new Map<Retailer, { total: number; missing: number }>();
        return computeUiSummaries(data, overrides);
    }, [data, overrides]);

    const uiBestRetailer = useMemo(() => {
        if (!data) return null;
        return computeUiBestRetailer(data, uiSummaries);
    }, [data, uiSummaries]);

    const openOptions = (
        retailer: Retailer,
        query: string,
        current: Product
    ) => {
        setActiveRetailer(retailer);
        setActiveQuery(query);
        setSelectedOptionId(String(current.id ?? ''));
        setOpened(true);
    };

    const close = () => setOpened(false);

    const applyOption = () => {
        if (!data || !activeRetailer || !activeQuery) return;

        const key = ovKey(activeRetailer, activeQuery);
        const prevChosenId = overrides[key];

        const prev = prevChosenId
            ? String(prevChosenId)
            : getDefaultProductIdForQueryRetailer(
                  data,
                  activeRetailer,
                  activeQuery
              );

        if (prev && cart[prev]?.qty) removeItem(prev);

        setOverrides(prevMap => ({
            ...prevMap,
            [key]: String(selectedOptionId ?? '')
        }));

        setOpened(false);
    };

    return {
        overrides,
        opened,
        activeQuery,
        selectedOptionId,
        setSelectedOptionId,
        options,
        uiSummaries,
        uiBestRetailer,
        openOptions,
        close,
        applyOption
    };
}
