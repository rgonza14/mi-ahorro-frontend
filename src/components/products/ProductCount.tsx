import { ActionIcon, Group, Paper, Text } from '@mantine/core';
import { Minus, Plus } from 'lucide-react';

type Props = {
    count: number;
    onInc: () => void;
    onDec: () => void;
    max?: number;
};

export default function ProductCounter({
    count,
    onInc,
    onDec,
    max = 10
}: Props) {
    return (
        <Paper
            withBorder
            radius='xl'
            px='xs'
            py={4}
            style={{ background: 'white' }}
        >
            <Group gap='xs'>
                <ActionIcon
                    variant='subtle'
                    radius='xl'
                    onClick={onDec}
                    disabled={count === 0}
                >
                    <Minus size={16} />
                </ActionIcon>

                <Text fw={600} w={24} ta='center'>
                    {count}
                </Text>

                <ActionIcon
                    variant='subtle'
                    radius='xl'
                    onClick={onInc}
                    disabled={count >= max}
                >
                    <Plus size={16} />
                </ActionIcon>
            </Group>
        </Paper>
    );
}
