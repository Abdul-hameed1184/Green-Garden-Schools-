import { useSyncExternalStore } from "react";

const queries = [
  { query: "(min-width: 1024px)", columns: 3 },
  { query: "(min-width: 640px)", columns: 2 },
];

function getColumns() {
  return queries.find((q) => window.matchMedia(q.query).matches)?.columns ?? 1;
}

function subscribe(onChange: () => void) {
  const lists = queries.map((q) => window.matchMedia(q.query));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

/** Responsive column count (1 / 2 / 3) matching Tailwind's sm and lg breakpoints. */
export function useColumns() {
  return useSyncExternalStore(subscribe, getColumns, () => 3);
}
