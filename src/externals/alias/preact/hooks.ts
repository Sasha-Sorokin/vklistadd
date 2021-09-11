import type { Requirer } from "@/gm/greaseLoader";

declare const require: Requirer;

const $hooks = require<
  typeof import("preact/hooks")
>("dependencies", "preact/hooks");

export const {
  useCallback,
  useContext,
  useEffect,
  useErrorBoundary,
  useMemo,
  useReducer,
  useRef,
  useState,
} = $hooks;

export default $hooks;
