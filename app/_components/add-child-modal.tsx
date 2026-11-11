"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";

/* CTA "Agregar niño" + modal de agregar-nino.dc.html sobre /children */
export function AddChildButton() {
  const [open, setOpen] = useState(false);

  /* con el modal abierto: scroll de fondo bloqueado y Esc cierra */
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-none cursor-pointer items-center gap-2 rounded-cta bg-linear-to-b from-cta-from to-cta-to px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-cta"
      >
        <Icon size={17} strokeWidth={2.4}>
          <path d="M12 5v14M5 12h14" />
        </Icon>
        Agregar niño
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-backdrop p-10 max-sm:p-6"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[520px] overflow-hidden rounded-modal border border-line bg-auth-bg shadow-modal"
          >
            <div className="flex items-center justify-between border-b border-line px-[26px] py-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer text-[15px] font-bold text-muted-dark"
              >
                Cancelar
              </button>
              <span className="font-display text-[18px] font-semibold text-ink">
                Agregar niño
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer text-[15px] font-extrabold text-clay-dark"
              >
                Guardar
              </button>
            </div>
            <div className="px-[26px] py-6" />
          </div>
        </div>
      )}
    </>
  );
}
