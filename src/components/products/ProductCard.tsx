import {
    Anchor,
    Badge,
    Card,
    Group,
    Image,
    Stack,
    Text,
    ActionIcon
} from '@mantine/core';
import { useStore } from '@nanostores/react';
import type { Product } from '../../types';
import { Plus, RefreshCcw, Trophy } from 'lucide-react';

import ProductCounter from './ProductCount';
import { $cart, addOne, removeOne } from '../../store';
import { RETAILER_META, normalizeRetailer } from '../../types';

type Props = {
    product: Product;
    isBestPrice?: boolean;
    view?: string;
    onOpenOptions?: () => void;
};

function RetailerPill({ retailer }: { retailer: string }) {
    const id = normalizeRetailer(retailer);
    const meta = RETAILER_META[id];

    return (
        <Badge
            variant='light'
            color={meta.color}
            radius='xl'
            px='sm'
            styles={{ root: { textTransform: 'none' } }}
        >
            <Group gap={6} wrap='nowrap'>
                <Image src={meta.logo} w={14} h={14} fit='contain' />
                <Text size='xs' fw={700}>
                    {meta.label}
                </Text>
            </Group>
        </Badge>
    );
}

const ProductCard = ({ product, isBestPrice, view, onOpenOptions }: Props) => {
    const cart = useStore($cart);

    const hasLink = !!product.link;
    const id = String(product.id);
    const qty = cart[id]?.qty ?? 0;
    const isAdded = qty > 0;

    return (
        <Card
            withBorder
            radius='lg'
            p='md'
            style={{
                position: 'relative',
                borderColor: isBestPrice
                    ? 'var(--mantine-color-green-6)'
                    : 'var(--mantine-color-gray-3)',
                borderWidth: isBestPrice ? 2 : 1
            }}
        >
            <Group justify='space-between' mb={8}>
                <RetailerPill retailer={product.retailer ?? 'Otro'} />
                {isBestPrice && (
                    <Badge
                        variant='filled'
                        color='green'
                        leftSection={<Trophy size={14} />}
                        radius='xl'
                    >
                        Mejor precio
                    </Badge>
                )}
            </Group>

            <div className='flex flex-col md:flex-row gap-y-8 items-center w-full'>
                <Group
                    align='flex-start'
                    wrap='nowrap'
                    gap='md'
                    style={{ flex: 1 }}
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        w={80}
                        h={80}
                        fit='contain'
                        fallbackSrc='https://placehold.co/80x80?text=IMG'
                        className='shrink-0'
                    />

                    <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                        {hasLink ? (
                            <Anchor
                                href={product.link}
                                target='_blank'
                                rel='noopener noreferrer'
                                fw={700}
                                size='sm'
                                className='line-clamp-2'
                            >
                                {product.name}
                            </Anchor>
                        ) : (
                            <Text fw={700} size='sm' className='line-clamp-2'>
                                {product.name}
                            </Text>
                        )}

                        <Group gap={10} align='baseline'>
                            <Text fw={800} size='xl'>
                                $
                                {Number(product.price ?? 0).toLocaleString(
                                    'es-AR'
                                )}
                            </Text>
                        </Group>
                    </Stack>
                </Group>

                <Group>
                    <div className='mt-[-15px] flex gap-x-8 items-center w-full'>
                        {view === 'list' && (
                            <RefreshCcw
                                className='cursor-pointer text-gray-600'
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onOpenOptions?.();
                                }}
                            />
                        )}

                        {isAdded ? (
                            <ProductCounter
                                count={qty}
                                onInc={() => addOne(product)}
                                onDec={() => removeOne(id)}
                                max={10}
                            />
                        ) : (
                            <ActionIcon
                                variant='light'
                                radius='xl'
                                size='lg'
                                onClick={() => addOne(product)}
                                aria-label='Agregar'
                            >
                                <Plus size={22} />
                            </ActionIcon>
                        )}
                    </div>
                </Group>
            </div>
        </Card>
    );
};

export default ProductCard;
