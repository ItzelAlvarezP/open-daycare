"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";

type LinkParentModalProps = {
  childName: string;
};

const RELATIONSHIPS = ["Mamá", "Papá", "Tutor/a"];

export function LinkParentModal({ childName }: LinkParentModalProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 pt-2 text-left"
      >
        <span className="flex size-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-dash text-photo-text">
          <Icon size={18} strokeWidth={2.2}>
            <path d="M12 5v14M5 12h14" />
          </Icon>
        </span>
        <span className="text-[14.5px] font-extrabold text-clay-deep">
          Vincular otro padre
        </span>
      </button>

      {open && (
        <div
          onClick={close}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-backdrop px-6 py-10 max-sm:p-6"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="link-parent-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[480px] overflow-hidden rounded-modal border border-line bg-auth-bg shadow-modal"
          >
            <header className="flex items-center justify-between border-b border-line px-[26px] py-5">
              <div>
                <h2
                  id="link-parent-title"
                  className="font-display text-[18px] font-semibold text-ink"
                >
                  Vincular padre
                </h2>
                <p className="text-[13px] text-muted">a {childName}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="flex size-[34px] items-center justify-center rounded-item bg-line-soft text-muted-dark"
              >
                <Icon size={18} strokeWidth={2.2}>
                  <path d="m18 6-12 12M6 6l12 12" />
                </Icon>
              </button>
            </header>

            <div className="px-[26px] py-[22px]">
              <div className="mb-5 flex gap-[11px] rounded-[14px] bg-[#E3ECFB] px-4 py-[13px]">
                <span className="mt-px flex-none text-[#4E72C8]">
                  <Icon size={20} strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </Icon>
                </span>
                <span className="text-[13.5px] leading-[1.45] text-[#3F5694]">
                  Le enviaremos un correo con un código para que active su
                  cuenta. Solo verá el feed de {childName}.
                </span>
              </div>

              <div className="mb-[18px]">
                <FieldLabel>NOMBRE DEL PADRE/MADRE</FieldLabel>
                <input
                  name="fullName"
                  placeholder="Ej. Diego Fernández"
                  className={inputClasses}
                />
              </div>

              <div className="mb-[18px]">
                <FieldLabel>EMAIL</FieldLabel>
                <input
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className={inputClasses}
                />
              </div>

              <div className="mb-5">
                <FieldLabel>PARENTESCO</FieldLabel>
                <div className="flex gap-[9px]">
                  {RELATIONSHIPS.map((relationship, index) => (
                    <button
                      key={relationship}
                      type="button"
                      aria-pressed={index === 0}
                      className={`flex-1 rounded-full border-[1.5px] px-2 py-[11px] text-[14px] font-extrabold ${
                        index === 0
                          ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]"
                          : "border-line bg-card text-ink-nav"
                      }`}
                    >
                      {relationship}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 rounded-photo border-[1.5px] border-dashed border-[#E6D08A] bg-[#FBF1D6] px-[18px] py-[18px] text-center">
                <p className="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-[#A88526]">
                  CÓDIGO DE INVITACIÓN
                </p>
                <p className="font-display text-[34px] font-semibold tracking-[7px] text-[#8A7234]">
                  7K4P9
                </p>
                <p className="mt-1.5 text-[13px] text-[#A88526]">
                  Vence en 7 días
                </p>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-[9px] rounded-cta bg-linear-to-b from-cta-from to-cta-to px-4 py-[14px] text-[15.5px] font-extrabold text-white shadow-auth-cta"
              >
                <Icon size={19} strokeWidth={2}>
                  <path d="m22 2-7 20-4-9-9-4z" />
                  <path d="M22 2 11 13" />
                </Icon>
                Enviar invitación
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-muted-dark">
      {children}
    </p>
  );
}

const inputClasses =
  "w-full rounded-cta border-[1.5px] border-auth-border bg-white px-4 py-[13px] text-[15px] text-ink outline-none placeholder:text-placeholder";
