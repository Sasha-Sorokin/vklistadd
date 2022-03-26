import { createContext } from "@external/preact";
import type { IBoxDetail } from "@/box/types";

/**
 * Некоторый контекст бокса
 */
export const BoxContext = createContext<IBoxDetail | null>(null);
