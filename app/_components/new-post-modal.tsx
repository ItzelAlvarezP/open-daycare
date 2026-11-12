"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icon";

/* CTA "Nueva publicación" del sidebar + modal de crear-publicacion.dc.html */
export function NewPostButton() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  /* con el modal abierto: scroll de fondo bloqueado y Esc cierra */
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
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
        className="mb-[18px] flex w-full cursor-pointer items-center justify-center gap-2 rounded-cta bg-linear-to-b from-cta-from to-cta-to px-3 py-3 text-[14.5px] font-extrabold text-white shadow-cta"
      >
        <Icon size={17} strokeWidth={2.4}>
          <path d="M12 5v14M5 12h14" />
        </Icon>
        Nueva publicación
      </button>

      {/* portal al body: el translate del sidebar rompería el fixed en mobile */}
      {open &&
        createPortal(
          <div
            onClick={close}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-backdrop px-6 py-10 max-sm:p-6"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-[580px] overflow-hidden rounded-modal border border-line bg-auth-bg shadow-modal"
            >
              <div className="flex items-center justify-between border-b border-line px-[26px] py-5">
                <button
                  type="button"
                  onClick={close}
                  className="cursor-pointer text-[15px] font-bold text-muted-dark"
                >
                  Cancelar
                </button>
                <span className="font-display text-[18px] font-semibold text-ink">
                  Nueva publicación
                </span>
                {/* Publicar valida y cierra en el paso 4 */}
                <button type="button" className="cursor-pointer text-[15px] font-extrabold text-clay-dark">
                  Publicar
                </button>
              </div>

              {/* PARA, TIPO, DESCRIPCIÓN y FOTOS llegan en los pasos 3-4 */}
              <div className="px-[26px] py-6" />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
