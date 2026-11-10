import type { ReactNode } from "react";

/* Envoltorio SVG con los atributos comunes de los iconos del design system */
export function Icon({
  children,
  size,
  strokeWidth = 2,
}: {
  children: ReactNode;
  size: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
