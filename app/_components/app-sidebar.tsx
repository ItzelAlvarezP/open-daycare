"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";

const NAV_ITEMS = [
  {
    label: "Feed",
    active: true,
    icon: (
      <Icon size={19}>
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </Icon>
    ),
  },
  {
    label: "Niños",
    active: false,
    icon: (
      <Icon size={19}>
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
      </Icon>
    ),
  },
  {
    label: "Avisos",
    active: false,
    icon: (
      <Icon size={19}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
      </Icon>
    ),
  },
  {
    label: "Mi cuenta",
    active: false,
    icon: (
      <Icon size={19}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </Icon>
    ),
  },
];

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  // cierra con Escape mientras el drawer está abierto
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* topbar móvil con hamburguesa (única UI añadida fuera del mockup) */}
      <div className="flex h-14 items-center gap-3 border-b border-line bg-card px-4 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="flex size-9 items-center justify-center rounded-item bg-cream text-muted-dark"
        >
          <Icon size={20}>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </Icon>
        </button>
        <span className="font-display text-[15px] font-semibold text-ink">
          OpenDayCare
        </span>
      </div>

      {/* fondo oscuro detrás del drawer */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
        />
      )}

      {/* mismo nodo: sticky en desktop, drawer deslizante en mobile */}
      <aside
        className={`sticky top-0 flex h-dvh w-[248px] shrink-0 flex-col border-r border-line bg-card px-4 py-6 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:transition-transform max-md:duration-200 ${
          open ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        }`}
      >
        {/* logo */}
        <a href="#" className="flex items-center gap-[11px] px-2 pt-1 pb-[22px]">
          <span className="flex size-[38px] flex-none items-center justify-center rounded-item bg-[linear-gradient(155deg,var(--color-avatar-from),var(--color-avatar-to))] text-white">
            <Icon size={21} strokeWidth={2.2}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </Icon>
          </span>
          <span>
            <span className="block font-display text-[17px] leading-none font-semibold text-ink">
              OpenDayCare
            </span>
            <span className="mt-[2px] block text-[11.5px] text-muted">
              Sala Soles
            </span>
          </span>
        </a>

        {/* CTA nueva publicación */}
        <a
          href="#"
          className="mb-[18px] flex items-center justify-center gap-2 rounded-cta bg-linear-to-b from-cta-from to-cta-to px-3 py-3 text-[14.5px] font-extrabold text-white shadow-cta"
        >
          <Icon size={17} strokeWidth={2.4}>
            <path d="M12 5v14M5 12h14" />
          </Icon>
          Nueva publicación
        </a>

        {/* navegación */}
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ label, active, icon }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 rounded-item px-3 py-[11px] text-[14.5px] ${
                active
                  ? "bg-clay-soft font-extrabold text-clay-dark"
                  : "font-semibold text-ink-nav"
              }`}
            >
              {icon}
              {label}
            </a>
          ))}
        </nav>

        {/* usuaria */}
        <div className="mt-[10px] border-t border-line pt-[14px]">
          <div className="flex items-center gap-[11px] px-2 py-1.5">
            <span className="flex size-[38px] flex-none items-center justify-center rounded-full bg-avatar-to font-display text-[16px] font-semibold text-white">
              C
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-extrabold text-ink">
                Caro Giménez
              </span>
              <span className="block text-[12px] text-muted">
                Maestra · Soles
              </span>
            </span>
            <a
              href="#"
              title="Cerrar sesión"
              className="flex size-8 flex-none items-center justify-center rounded-[10px] bg-cream text-muted-dark"
            >
              <Icon size={16}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </Icon>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
