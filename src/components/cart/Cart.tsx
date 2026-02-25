import {
    Button,
    Divider,
    Drawer,
    Group,
    Indicator,
    Stack,
    Text
} from '@mantine/core';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $cart, cartCount } from '../../store';
import { useDisclosure } from '@mantine/hooks';
import ProductCard from '../products/ProductCard';
import CartExportButton from './CartExportButton';
import { clearCart } from '../../store';

const Cart = () => {
    const [opened, { open, close }] = useDisclosure(false);

    const count = useStore(cartCount);
    const cart = useStore($cart);

    const items = Object.values(cart);

    const units = items.reduce((acc, item) => acc + item.qty, 0);

    const total = items.reduce((acc, item) => {
        const price = item.product.price ?? 0;
        return acc + price * item.qty;
    }, 0);

    const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
        const key = item.product.retailer ?? 'Otros';
        (acc[key] ??= []).push(item);
        return acc;
    }, {});

    const groups = Object.entries(grouped)
        .map(([source, groupItems]) => {
            const groupUnits = groupItems.reduce((acc, it) => acc + it.qty, 0);
            const groupTotal = groupItems.reduce((acc, it) => {
                const price = it.product.price ?? 0;
                return acc + price * it.qty;
            }, 0);

            return { source, groupItems, groupUnits, groupTotal };
        })
        .sort((a, b) => a.source.localeCompare(b.source));

    return (
        <>
            <Group>
                <div className='cursor-pointer' onClick={open}>
                    <Indicator
                        label={count}
                        size={18}
                        disabled={count === 0}
                        offset={6}
                    >
                        <ShoppingCart size={40} strokeWidth={1.5} />
                    </Indicator>
                </div>
            </Group>

            <Drawer
                opened={opened}
                onClose={close}
                title='Mi carrito'
                position='right'
                size='lg'
                styles={{
                    body: { paddingLeft: 12, paddingRight: 12 }
                }}
            >
                {items.length === 0 ? (
                    <Text c='dimmed'>Tu carrito está vacío</Text>
                ) : (
                    <Stack gap='md'>
                        <Group justify='space-between' align='flex-end'>
                            <div>
                                <Text fw={700}>Total</Text>
                                <Text size='xs' c='dimmed'>
                                    {units}{' '}
                                    {units === 1 ? 'producto' : 'productos'}
                                </Text>
                            </div>

                            <Text fw={800} size='lg'>
                                ${total.toLocaleString('es-AR')}
                            </Text>
                        </Group>
                        <Group>
                            <CartExportButton />
                            <Button
                                leftSection={<Trash2 size={14} />}
                                variant={'light'}
                                color='red'
                                onClick={clearCart}
                            >
                                Eliminar carrito
                            </Button>
                        </Group>

                        <Divider />

                        <Stack gap='lg'>
                            {groups.map(
                                ({
                                    source,
                                    groupItems,
                                    groupUnits,
                                    groupTotal
                                }) => (
                                    <Stack key={source} gap='sm'>
                                        <Group
                                            justify='space-between'
                                            align='flex-end'
                                            px='xs'
                                            py={4}
                                        >
                                            <div>
                                                <Text fw={700} tt='capitalize'>
                                                    {source}
                                                </Text>
                                                <Text size='xs' c='dimmed'>
                                                    {groupUnits}{' '}
                                                    {groupUnits === 1
                                                        ? 'producto'
                                                        : 'productos'}
                                                </Text>
                                            </div>

                                            <Text fw={800}>
                                                $
                                                {groupTotal.toLocaleString(
                                                    'es-AR'
                                                )}
                                            </Text>
                                        </Group>

                                        <Stack gap='md'>
                                            {groupItems.map(({ product }) => (
                                                <ProductCard
                                                    key={String(product.id)}
                                                    product={product}
                                                />
                                            ))}
                                        </Stack>
                                    </Stack>
                                )
                            )}
                        </Stack>
                    </Stack>
                )}
            </Drawer>
        </>
    );
};

export default Cart;
