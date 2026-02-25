import {
    Alert,
    Button,
    SegmentedControl,
    Switch,
    TextInput,
    Textarea,
    Stack
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Info } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import ListProducts from '../list-products/ListProducts.tsx';
import ListShopping from '../list-products/list-shopping/ListShopping';
import {
    useRetailersItemQuery,
    useRetailersListQuery
} from '../../api/useSearchQuery';
import { $selectedRetailers, triggerRetailerHighlight } from '../../store';
import type { Retailer } from '../../types';
import { RETAILERS } from '../../types';
import ScrollToTop from '../ui/ScrollToTop.tsx';

const BASE_URL: string = import.meta.env.VITE_API_URL;

function parseShoppingList(text: string): string[] {
    return text
        .split(/\r?\n/)
        .map(x => x.trim())
        .filter(Boolean);
}

const FormSearch = () => {
    const queryClient = useQueryClient();
    const selectedRetailers = useStore($selectedRetailers);

    const [mode, setMode] = useState<'unitario' | 'lista'>('unitario');
    const [submittedItem, setSubmittedItem] = useState('');
    const [submittedList, setSubmittedList] = useState<string[]>([]);

    const itemForm = useForm({
        mode: 'uncontrolled',
        initialValues: { search: '' },
        validate: {
            search: value =>
                value.trim().length < 2
                    ? 'El término de búsqueda debe tener al menos 2 caracteres'
                    : null
        }
    });

    const listForm = useForm({
        mode: 'uncontrolled',
        initialValues: { list: '' },
        validate: {
            list: value =>
                parseShoppingList(value).length < 1
                    ? 'Pegá al menos 1 ítem'
                    : null
        }
    });

    const allChecked = selectedRetailers.length === RETAILERS.length;

    const effectiveRetailers: Retailer[] = useMemo(
        () => selectedRetailers,
        [selectedRetailers]
    );

    const canSearchItem =
        mode === 'unitario' &&
        effectiveRetailers.length > 0 &&
        submittedItem.trim().length > 0;

    const canSearchList =
        mode === 'lista' &&
        effectiveRetailers.length > 0 &&
        submittedList.length > 0;

    useEffect(() => {
        if (effectiveRetailers.length !== 0) return;

        setSubmittedItem('');
        setSubmittedList([]);

        queryClient.cancelQueries({ queryKey: ['retailers', 'item'] });
        queryClient.cancelQueries({ queryKey: ['retailers', 'list'] });
    }, [effectiveRetailers.length, queryClient]);

    const itemQuery = useRetailersItemQuery({
        retailers: effectiveRetailers,
        query: submittedItem,
        limit: 15,
        enabled: canSearchItem,
        baseUrl: BASE_URL
    });

    const listQuery = useRetailersListQuery({
        retailers: effectiveRetailers,
        items: submittedList,
        limit: 15,
        enabled: canSearchList,
        baseUrl: BASE_URL
    });

    const showLoading =
        (mode === 'unitario' &&
            canSearchItem &&
            (itemQuery.isPending || itemQuery.isFetching)) ||
        (mode === 'lista' &&
            canSearchList &&
            (listQuery.isPending || listQuery.isFetching));

    const error = (
        mode === 'unitario' ? itemQuery.error : listQuery.error
    ) as Error | null;

    const resultsByRetailer = canSearchItem
        ? (itemQuery.data?.results ?? [])
        : [];

    return (
        <>
            <form
                onSubmit={e => {
                    e.preventDefault();

                    if (effectiveRetailers.length === 0) {
                        triggerRetailerHighlight();
                        return;
                    }

                    if (mode === 'unitario') {
                        itemForm.onSubmit(values => {
                            const q = values.search.trim();
                            setSubmittedItem(q);
                            setSubmittedList([]);
                        })(e);
                        return;
                    }

                    listForm.onSubmit(values => {
                        const items = parseShoppingList(values.list);
                        setSubmittedList(items);
                        setSubmittedItem('');
                    })(e);
                }}
            >
                <div className='w-full'>
                    <Switch
                        mt='lg'
                        checked={allChecked}
                        onChange={e => {
                            const checked = e.currentTarget.checked;
                            if (checked) $selectedRetailers.set([...RETAILERS]);
                            else $selectedRetailers.set([]);
                        }}
                        label='Buscar en todas las cadenas'
                    />
                </div>

                <SegmentedControl
                    mt='lg'
                    value={mode}
                    onChange={v => setMode(v as 'unitario' | 'lista')}
                    data={[
                        { label: 'Unitario', value: 'unitario' },
                        { label: 'Lista de compras', value: 'lista' }
                    ]}
                />

                <div
                    className={`flex gap-4 mt-4 ${mode === 'unitario' ? 'flex-row' : 'flex-col'}`}
                >
                    {mode === 'unitario' ? (
                        <TextInput
                            flex={1}
                            placeholder='Buscar producto...'
                            key={itemForm.key('search')}
                            {...itemForm.getInputProps('search')}
                            size='md'
                            style={{ textAlign: 'start' }}
                        />
                    ) : (
                        <Textarea
                            flex={1}
                            placeholder={
                                'Pegá tu lista (una por línea)\nleche\ncoca cola 2.25\narroz 1kg'
                            }
                            key={listForm.key('list')}
                            {...listForm.getInputProps('list')}
                            autosize
                            minRows={4}
                            maxRows={10}
                            size='md'
                        />
                    )}

                    <Button
                        radius='lg'
                        size='md'
                        type='submit'
                        loading={showLoading}
                    >
                        Buscar
                    </Button>
                </div>
            </form>

            {error && (
                <Alert
                    variant='light'
                    color='red'
                    title='Alerta'
                    icon={<Info />}
                    mt='lg'
                >
                    {error.message}
                </Alert>
            )}

            {mode === 'unitario' ? (
                <ListProducts
                    resultsByRetailer={resultsByRetailer}
                    loading={showLoading}
                    hasQuery={canSearchItem}
                />
            ) : (
                <Stack mt='lg'>
                    <ListShopping
                        data={canSearchList ? listQuery.data : undefined}
                        loading={showLoading}
                    />
                </Stack>
            )}
            <ScrollToTop />
        </>
    );
};

export default FormSearch;
