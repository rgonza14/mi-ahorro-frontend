import {
    Avatar,
    Button,
    Group,
    Paper,
    Popover,
    Stack,
    Text,
    useMantineTheme
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import type { Retailer } from '../../types';
import { RETAILERS } from '../../types';
import {
    $highlightRetailers,
    $selectedRetailers,
    toggleRetailer
} from '../../store';

export default function Retailers() {
    const theme = useMantineTheme();
    const selected = useStore($selectedRetailers);
    const highlightTick = useStore($highlightRetailers);

    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!highlightTick) return;
        setOpen(true);
        wrapRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        const t = window.setTimeout(() => setOpen(false), 5800);
        return () => window.clearTimeout(t);
    }, [highlightTick]);

    const handleToggle = (value: Retailer) => {
        toggleRetailer(value);
        const next = selected.includes(value)
            ? selected.filter(x => x !== value)
            : [...selected, value];

        if (next.length > 0) setOpen(false);
    };

    return (
        <div ref={wrapRef}>
            <Group justify='center' mt='xl'>
                <Popover
                    opened={open}
                    onChange={setOpen}
                    position='bottom'
                    offset={10}
                    withArrow
                    arrowSize={12}
                    shadow='md'
                    withinPortal
                >
                    <Popover.Target>
                        <Paper
                            radius='xl'
                            px='lg'
                            py='md'
                            style={{
                                background: theme.white,
                                border: `2px solid ${
                                    open
                                        ? theme.colors.red[6]
                                        : theme.colors.gray[2]
                                }`,
                                boxShadow: open
                                    ? '0 0 0 6px rgba(255,0,0,0.10)'
                                    : undefined,
                                transition:
                                    'border-color 600ms ease, box-shadow 600ms ease, transform 250ms ease',
                                transform: open ? 'scale(1.02)' : 'scale(1)',
                                animation: open
                                    ? 'rg-shake 220ms ease-in-out 0s 2'
                                    : undefined
                            }}
                        >
                            <Group gap='lg'>
                                {RETAILERS.map(r => {
                                    const isSelected = selected.includes(r);

                                    return (
                                        <Avatar
                                            key={r}
                                            src={`/images/${r}.png`}
                                            alt={r}
                                            size={56}
                                            radius='xl'
                                            onClick={() => handleToggle(r)}
                                            styles={{
                                                root: {
                                                    cursor: 'pointer',
                                                    border: isSelected
                                                        ? `2px solid ${theme.colors.blue[6]}`
                                                        : `1px solid ${theme.colors.gray[2]}`,
                                                    background: theme.white,
                                                    transition:
                                                        'transform 120ms ease',
                                                    transform: isSelected
                                                        ? 'scale(1.05)'
                                                        : 'scale(1)'
                                                },
                                                image: {
                                                    objectFit: 'contain',
                                                    padding: 10
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </Group>
                        </Paper>
                    </Popover.Target>

                    <Popover.Dropdown>
                        <Stack gap={6} maw={260}>
                            <Text fw={700}>Falta seleccionar una cadena</Text>
                            <Text size='sm' c='dimmed'>
                                Elegí al menos uno para poder buscar productos.
                            </Text>
                            <Group justify='flex-end' mt={6}>
                                <Button
                                    size='xs'
                                    radius='md'
                                    variant='light'
                                    onClick={() => setOpen(false)}
                                >
                                    Entendido
                                </Button>
                            </Group>
                        </Stack>
                    </Popover.Dropdown>
                </Popover>
            </Group>

            <style>{`
        @keyframes rg-shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
