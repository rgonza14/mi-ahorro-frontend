import {
    Card,
    Divider,
    Group,
    Progress,
    Stack,
    Text,
    Title,
    Accordion
} from '@mantine/core';
import type { RetailersListResponse, Retailer } from '../../../types';
import { $cart, type CartState } from '../../../store';
import { useStore } from '@nanostores/react';
import RetailerRow from './RetailerRow';
import OptionsModal from './OptionsModal';
import { useShoppingOverrides } from './useShoppingOverrides';

type Props = {
    data?: RetailersListResponse;
    loading: boolean;
};

export default function ListShopping({ data, loading }: Props) {
    const cart: CartState = useStore($cart);

    const {
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
    } = useShoppingOverrides(data, cart);

    if (loading) {
        return (
            <Stack mt='xl'>
                <Card withBorder radius='lg' p='md'>
                    <Group justify='space-between'>
                        <Stack gap={2}>
                            <Text fw={700}>Calculando mejor opción…</Text>
                            <Text c='dimmed' size='sm'>
                                Comparando tu lista en las cadenas seleccionados
                            </Text>
                        </Stack>
                        <Progress value={60} w={140} />
                    </Group>
                </Card>
            </Stack>
        );
    }

    if (!data) return null;

    return (
        <>
            <OptionsModal
                opened={opened}
                onClose={close}
                titleText={activeQuery}
                options={options}
                value={selectedOptionId}
                onChange={setSelectedOptionId}
                onApply={applyOption}
            />

            <Stack mt='xl' gap='md'>
                <Card radius='lg' p='md'>
                    <Group justify='space-between' align='flex-start'>
                        <Stack gap={2}>
                            <Title order={4}>Resultado</Title>
                            <Text c='dimmed' size='sm'>
                                Ranking total para tu lista
                            </Text>
                        </Stack>
                    </Group>

                    <Divider my='sm' />

                    <Accordion
                        variant='separated'
                        radius='lg'
                        mt='lg'
                        chevronPosition='left'
                    >
                        {data.ranking.map(r => {
                            const retailer = r.retailer as Retailer;
                            const s = uiSummaries.get(retailer) ?? {
                                total: 0,
                                missing: data.items.length
                            };

                            return (
                                <RetailerRow
                                    key={retailer}
                                    data={data}
                                    retailer={retailer}
                                    isBest={uiBestRetailer === retailer}
                                    total={Number(s.total ?? 0)}
                                    missing={Number(s.missing ?? 0)}
                                    cart={cart}
                                    overrides={overrides}
                                    onOpenOptions={openOptions}
                                />
                            );
                        })}
                    </Accordion>
                </Card>
            </Stack>
        </>
    );
}
