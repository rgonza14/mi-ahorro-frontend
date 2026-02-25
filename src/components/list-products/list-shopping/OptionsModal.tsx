import {
    Button,
    Card,
    Group,
    Modal,
    Radio,
    ScrollArea,
    Stack,
    Text
} from '@mantine/core';
import { RefreshCcw } from 'lucide-react';
import type { Product } from '../../../types';

type Props = {
    opened: boolean;
    onClose: () => void;
    titleText: string;
    options: Product[];
    value: string | null;
    onChange: (v: string) => void;
    onApply: () => void;
};

export default function OptionsModal({
    opened,
    onClose,
    titleText,
    options,
    value,
    onChange,
    onApply
}: Props) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap='xs' align='center'>
                    <RefreshCcw size={16} />
                    <Text fw={800}>Elegir otra opción</Text>
                </Group>
            }
            size='lg'
            radius='lg'
            centered
        >
            <Stack gap='sm'>
                <Text size='sm' c='dimmed'>
                    {titleText || 'Producto'}
                </Text>

                {options.length === 0 ? (
                    <Text size='sm'>No hay alternativas disponibles.</Text>
                ) : (
                    <>
                        <ScrollArea h={320}>
                            <Radio.Group
                                value={value ?? ''}
                                onChange={onChange}
                            >
                                <Stack gap='sm'>
                                    {options.map((p, idx) => {
                                        const id = String(
                                            p.id ?? `${p.retailer}-${idx}`
                                        );
                                        return (
                                            <Card
                                                key={id}
                                                withBorder
                                                radius='lg'
                                                p='sm'
                                            >
                                                <Group
                                                    align='flex-start'
                                                    justify='space-between'
                                                    wrap='nowrap'
                                                >
                                                    <Radio
                                                        value={String(
                                                            p.id ?? ''
                                                        )}
                                                    />
                                                    <Stack
                                                        gap={2}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Text
                                                            fw={700}
                                                            size='sm'
                                                            className='line-clamp-2'
                                                        >
                                                            {p.name}
                                                        </Text>
                                                        <Text
                                                            fw={900}
                                                            size='lg'
                                                        >
                                                            $
                                                            {Number(
                                                                p.price ?? 0
                                                            ).toLocaleString(
                                                                'es-AR'
                                                            )}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Radio.Group>
                        </ScrollArea>

                        <Button size='lg' onClick={onApply}>
                            Confirmar
                        </Button>
                    </>
                )}
            </Stack>
        </Modal>
    );
}
