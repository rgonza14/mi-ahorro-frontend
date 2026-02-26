import { Button } from '@mantine/core';
import { useStore } from '@nanostores/react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { $cart } from '../../store';

type GroupedItem = {
    productName: string;
    qty: number;
    unitPrice: number;
    subtotal: number;
};

type GroupBlock = {
    source: string;
    units: number;
    total: number;
    items: GroupedItem[];
};

type Props = {
    groupBySupermarket?: boolean;
    filename?: string;
};

function dataUrlToFile(dataUrl: string, filename: string): File {
    const [header, base64] = dataUrl.split(',');
    const mimeMatch = header.match(/data:(.*?);base64/);
    const mime = mimeMatch?.[1] ?? 'image/png';

    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

    return new File([bytes], filename, { type: mime });
}

function isProbablyMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export default function CartExportButton({
    groupBySupermarket = true,
    filename
}: Props) {
    const cart = useStore($cart);
    const ref = useRef<HTMLDivElement | null>(null);

    const { units, total, groups } = useMemo(() => {
        const values = Object.values(cart);
        const groupsMap = new Map<string, GroupBlock>();

        for (const it of values) {
            const source = (it.product.retailer ?? 'Otros').toString();
            const unitPrice = Number(it.product.price ?? 0);
            const qty = Number(it.qty ?? 0);
            const subtotal = unitPrice * qty;

            if (!groupsMap.has(source)) {
                groupsMap.set(source, {
                    source,
                    units: 0,
                    total: 0,
                    items: []
                });
            }

            const g = groupsMap.get(source)!;
            g.units += qty;
            g.total += subtotal;
            g.items.push({
                productName: it.product.name ?? '',
                qty,
                unitPrice,
                subtotal
            });
        }

        const groupsArr = Array.from(groupsMap.values()).map(g => ({
            ...g,
            items: g.items.sort((a, b) => b.subtotal - a.subtotal)
        }));

        const allUnits = values.reduce((acc, it) => acc + (it.qty ?? 0), 0);
        const allTotal = values.reduce(
            (acc, it) =>
                acc + Number(it.product.price ?? 0) * Number(it.qty ?? 0),
            0
        );

        return {
            units: allUnits,
            total: allTotal,
            groups: groupsArr.sort((a, b) => b.total - a.total)
        };
    }, [cart]);

    const handleExport = async () => {
        if (!ref.current) return;

        const name =
            filename ??
            `MiAhorro-carrito-${new Date().toISOString().slice(0, 10)}.png`;

        const mobile = isProbablyMobile();
        const ios = isIOS();

        try {
            const dataUrl = await toPng(ref.current, {
                cacheBust: true,
                pixelRatio: mobile ? 1 : 2,
                backgroundColor: '#ffffff'
            });

            const file = dataUrlToFile(dataUrl, name);

            const canShareFiles =
                typeof navigator !== 'undefined' &&
                'share' in navigator &&
                (navigator as any).canShare?.({ files: [file] });

            if (canShareFiles) {
                await (navigator as any).share({
                    files: [file],
                    title: 'MiAhorro',
                    text: 'Resumen del carrito'
                });
                return;
            }

            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = name;

            if (!ios) {
                a.click();
                return;
            }

            const w = window.open();
            if (w) {
                w.document.write(
                    `<img src="${dataUrl}" style="max-width:100%;height:auto" />`
                );
            } else {
                window.location.href = dataUrl;
            }
        } catch (e) {
            console.error('Export/share PNG failed:', e);
        }
    };

    const formatter = new Intl.NumberFormat('es-AR');

    return (
        <>
            <Button
                variant='light'
                leftSection={<Download size={16} />}
                onClick={handleExport}
                disabled={units === 0}
            >
                Exportar PNG
            </Button>

            <div
                style={{
                    position: 'fixed',
                    left: -10000,
                    top: 0,
                    width: 720,
                    padding: 16,
                    background: '#fff',
                    color: '#111',
                    fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"'
                }}
            >
                <div
                    ref={ref}
                    style={{
                        border: '1px solid #eee',
                        borderRadius: 12,
                        padding: 16
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end'
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800 }}>
                                Mi Ahorro
                            </div>
                            <div style={{ fontSize: 12, color: '#666' }}>
                                {new Date().toLocaleString('es-AR')}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 12, color: '#666' }}>
                                {units} {units === 1 ? 'producto' : 'productos'}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 900 }}>
                                ${formatter.format(total)}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            height: 1,
                            background: '#eee',
                            margin: '12px 0'
                        }}
                    />

                    {groupBySupermarket ? (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14
                            }}
                        >
                            {groups.map(g => (
                                <div key={g.source}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-end',
                                            marginBottom: 8
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 800,
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {g.source}
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    color: '#666',
                                                    fontWeight: 500,
                                                    marginLeft: 8
                                                }}
                                            >
                                                ({g.units}{' '}
                                                {g.units === 1
                                                    ? 'prod.'
                                                    : 'prods.'}
                                                )
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 900
                                            }}
                                        >
                                            ${formatter.format(g.total)}
                                        </div>
                                    </div>

                                    <table
                                        style={{
                                            width: '100%',
                                            borderCollapse: 'collapse'
                                        }}
                                    >
                                        <thead>
                                            <tr
                                                style={{
                                                    borderBottom:
                                                        '1px solid #eee'
                                                }}
                                            >
                                                <th
                                                    style={{
                                                        textAlign: 'left',
                                                        padding: '6px 0',
                                                        fontSize: 12,
                                                        color: '#666'
                                                    }}
                                                >
                                                    Producto
                                                </th>
                                                <th
                                                    style={{
                                                        textAlign: 'right',
                                                        padding: '6px 0',
                                                        fontSize: 12,
                                                        color: '#666'
                                                    }}
                                                >
                                                    Cant.
                                                </th>
                                                <th
                                                    style={{
                                                        textAlign: 'right',
                                                        padding: '6px 0',
                                                        fontSize: 12,
                                                        color: '#666'
                                                    }}
                                                >
                                                    Unit.
                                                </th>
                                                <th
                                                    style={{
                                                        textAlign: 'right',
                                                        padding: '6px 0',
                                                        fontSize: 12,
                                                        color: '#666'
                                                    }}
                                                >
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {g.items.map((it, idx) => (
                                                <tr
                                                    key={`${g.source}-${idx}`}
                                                    style={{
                                                        borderBottom:
                                                            '1px solid #f3f3f3'
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            fontSize: 13
                                                        }}
                                                    >
                                                        {it.productName}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            fontSize: 13,
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {it.qty}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            fontSize: 13,
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        $
                                                        {formatter.format(
                                                            it.unitPrice
                                                        )}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            fontSize: 13,
                                                            textAlign: 'right',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        $
                                                        {formatter.format(
                                                            it.subtotal
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}
                        >
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <th
                                        style={{
                                            textAlign: 'left',
                                            padding: '6px 0',
                                            fontSize: 12,
                                            color: '#666'
                                        }}
                                    >
                                        Producto
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'right',
                                            padding: '6px 0',
                                            fontSize: 12,
                                            color: '#666'
                                        }}
                                    >
                                        Cant.
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'right',
                                            padding: '6px 0',
                                            fontSize: 12,
                                            color: '#666'
                                        }}
                                    >
                                        Unit.
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'right',
                                            padding: '6px 0',
                                            fontSize: 12,
                                            color: '#666'
                                        }}
                                    >
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(cart).map((it, idx) => {
                                    const unitPrice = Number(
                                        it.product.price ?? 0
                                    );
                                    const qty = Number(it.qty ?? 0);
                                    const subtotal = unitPrice * qty;

                                    return (
                                        <tr
                                            key={idx}
                                            style={{
                                                borderBottom:
                                                    '1px solid #f3f3f3'
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding: '8px 0',
                                                    fontSize: 13
                                                }}
                                            >
                                                {it.product.name}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '8px 0',
                                                    fontSize: 13,
                                                    textAlign: 'right'
                                                }}
                                            >
                                                {qty}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '8px 0',
                                                    fontSize: 13,
                                                    textAlign: 'right'
                                                }}
                                            >
                                                ${formatter.format(unitPrice)}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '8px 0',
                                                    fontSize: 13,
                                                    textAlign: 'right',
                                                    fontWeight: 700
                                                }}
                                            >
                                                ${formatter.format(subtotal)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    <div
                        style={{
                            height: 1,
                            background: '#eee',
                            margin: '12px 0'
                        }}
                    />

                    <div style={{ fontSize: 11, color: '#777' }}>
                        Totales estimados según precios visibles al momento de
                        generar el resumen.
                    </div>
                </div>
            </div>
        </>
    );
}
