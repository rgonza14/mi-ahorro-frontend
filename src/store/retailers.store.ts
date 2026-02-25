import { atom } from "nanostores";
import type { Retailer } from "../types";

export const $selectedRetailers = atom<Retailer[]>([]);
export const $highlightRetailers = atom(0);

export function toggleRetailer(value: Retailer) {
    const current = $selectedRetailers.get();
    const next = current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value];

    $selectedRetailers.set(next);
}

export function clearRetailers() {
    $selectedRetailers.set([]);
}

export function triggerRetailerHighlight(durationMs = 900) {
    const next = $highlightRetailers.get() + 1;
    $highlightRetailers.set(next);
    window.setTimeout(() => {}, durationMs);
}
