import { createContext } from "preact";
import { IBoxDetail } from "@/box/types";

/**
 * Некоторый контекст бокса
 */
export const BoxContext = createContext<IBoxDetail | null>(null);
