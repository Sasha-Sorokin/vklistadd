/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Requirer } from "@/gm/greaseLoader";

/// <reference types="./index" />

declare const require: Requirer;

const $preact = require<typeof import("preact")>("dependencies", "preact");

export const {
  render,
  Fragment,
  isValidElement,
  cloneElement,
  createContext,
  toChildArray,
} = $preact;

// eslint-disable-next-line

// eslint-disable-next-line
export function h<P>(
  type: string,
  props:
    | (import("preact").JSX.HTMLAttributes &
        import("preact").JSX.SVGAttributes &
        Record<string, any>)
    | (import("preact").Attributes & P)
    | null,
  ...children: import("preact").ComponentChildren[]
): import("preact").VNode<any> {
  return $preact.h(type, props, ...children);
}

/* eslint-disable */
// @ts-ignore
import { JSXInternal } from "preact/src/jsx";
/* eslint-enable */

// eslint-disable-next-line
export namespace h {
  export import JSX = JSXInternal;
}

export type { JSX, VNode } from "preact";

export default $preact;
