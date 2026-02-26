import React, { useMemo } from 'react';
import {
    Accordion,
    ActionIcon,
    Badge,
    Card,
    Combobox,
    Group,
    Stack,
    Text,
    useCombobox
} from '@mantine/core';
import { CircleAlert, EllipsisVertical, Trophy } from 'lucide-react';
import type { Product, Retailer, RetailersListResponse } from '../../../types';
import { addOne, removeItem, type CartState } from '../../../store';
import ProductCard from '../../products/ProductCard';
import {
    buildRetailerSelection,
    formatMoney,
    type OverridesMap
} from './shopping.utils';

type Props = {
    data: RetailersListResponse;
    retailer: Retailer;
    isBest: boolean;
    total: number;
    missing: number;
    cart: CartState;
    overrides: OverridesMap;
    onOpenOptions: (
        retailer: Retailer,
        query: string,
        current: Product
    ) => void;
};

export default function RetailerRow({
    data,
    retailer,
    isBest,
    total,
    missing,
    cart,
    overrides,
    onOpenOptions
}: Props) {
    const selection = useMemo(
        () => buildRetailerSelection(data, retailer, overrides),
        [data, retailer, overrides]
    );

    const products = selection.items.map(x => x.product);
    const missingItems = selection.missing;
    const canAdd = products.length > 0;

    const alreadyInCartCount = products.reduce((acc, p) => {
        const id = String(p.id);
        return acc + (cart[id]?.qty ? 1 : 0);
    }, 0);

    const allInCart = canAdd && alreadyInCartCount === products.length;

    const actionLabel = allInCart
        ? 'Limpiar lista del carrito'
        : 'Agregar lista al carrito';

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption()
    });

    const runAction = (e?: React.SyntheticEvent) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();

        if (!canAdd) {
            combobox.closeDropdown();
            return;
        }

        if (allInCart) {
            for (const p of products) removeItem(String(p.id));
        } else {
            for (const p of products) addOne(p);
        }

        combobox.closeDropdown();
    };

    const showBestBadge = isBest && selection.items.length > 0;

    return (
        <Accordion.Item key={retailer} value={retailer}>
            <Combobox
                store={combobox}
                width={260}
                onOptionSubmit={() => runAction()}
            >
                <Group wrap='nowrap' align='center' justify='space-between'>
                    <Accordion.Control style={{ flex: 1 }}>
                        <div className='flex flex-col lg:flex-row justify-between w-full'>
                            <div>
                                <p className='font-bold text-center lg:text-left '>
                                    {retailer.toUpperCase()}
                                </p>

                                <Group gap='xs' mt='xs'>
                                    {showBestBadge && (
                                        <Badge
                                            radius='xl'
                                            variant='filled'
                                            color='green'
                                            leftSection={<Trophy size={14} />}
                                        >
                                            Mejor precio
                                        </Badge>
                                    )}

                                    {missing > 0 && (
                                        <Badge
                                            radius='xl'
                                            variant='light'
                                            color='yellow'
                                            leftSection={
                                                <CircleAlert size={14} />
                                            }
                                        >
                                            {missing} faltantes
                                        </Badge>
                                    )}
                                </Group>
                            </div>

                            <Group
                                gap='sm'
                                align='center'
                                justify='space-between'
                            >
                                <Text fw={800} size='lg'>
                                    {formatMoney(total)}
                                </Text>
                            </Group>
                        </div>

                        <Group justify='space-between' mt={8}>
                            <Text size='xs' c='dimmed'>
                                {data.items.length - missing}/
                                {data.items.length} ítems
                            </Text>
                            <Text size='xs' c='dimmed'>
                                En carrito: {alreadyInCartCount}/
                                {products.length}
                            </Text>
                        </Group>
                    </Accordion.Control>

                    <Combobox.Target>
                        <ActionIcon
                            size='lg'
                            variant='subtle'
                            color='gray'
                            aria-label='Más opciones'
                            onMouseDown={e => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                combobox.toggleDropdown();
                            }}
                        >
                            <EllipsisVertical size={18} />
                        </ActionIcon>
                    </Combobox.Target>
                </Group>

                <Combobox.Dropdown
                    onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Combobox.Options>
                        <Combobox.Option value='action'>
                            {actionLabel}
                        </Combobox.Option>
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>

            <Accordion.Panel>
                <Stack gap='sm'>
                    {missingItems.length > 0 && (
                        <Card radius='lg' p='sm' withBorder>
                            <Group gap='xs' align='center'>
                                <CircleAlert size={16} />
                                <Text fw={700}>Faltantes</Text>
                            </Group>

                            <Text size='sm' c='black' mt={6}>
                                {missingItems.slice(0, 6).join(' • ')}
                                {missingItems.length > 6 ? ' • …' : ''}
                            </Text>
                        </Card>
                    )}

                    {selection.items.length === 0 ? (
                        <Text size='sm' c='dimmed'>
                            No hay productos para agregar.
                        </Text>
                    ) : (
                        <Stack gap='sm'>
                            {selection.items.map((x, idx) => (
                                <ProductCard
                                    key={String(
                                        x.product.id ??
                                            `${x.product.retailer}-${idx}`
                                    )}
                                    product={x.product}
                                    isBestPrice={isBest}
                                    view='list'
                                    onOpenOptions={() =>
                                        onOpenOptions(
                                            retailer,
                                            x.query,
                                            x.product
                                        )
                                    }
                                />
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Accordion.Panel>
        </Accordion.Item>
    );
}
