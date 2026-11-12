"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MOCK_CHILDREN } from "@/lib/mock-children";
import { Icon } from "./icon";

type PostType = "comida" | "siesta" | "actividad" | "logro" | "animo" | "foto" | "anuncio";

/* clases estáticas para que Tailwind extraiga los tokens de cada tipo */
const POST_TYPES: { id: PostType; label: string; soft: string; solid: string }[] = [
  { id: "comida", label: "Comida", soft: "bg-badge-pending text-badge-pending-ink", solid: "bg-badge-pending-ink text-white" },
  { id: "siesta", label: "Siesta", soft: "bg-siesta-soft text-siesta", solid: "bg-siesta text-white" },
  { id: "actividad", label: "Actividad", soft: "bg-actividad-soft text-actividad", solid: "bg-actividad text-white" },
  { id: "logro", label: "Logro", soft: "bg-logro-soft text-logro", solid: "bg-logro text-white" },
  { id: "animo", label: "Ánimo", soft: "bg-badge-invite text-badge-invite-ink", solid: "bg-badge-invite-ink text-white" },
  { id: "foto", label: "Foto", soft: "bg-badge-allergy text-badge-allergy-ink", solid: "bg-badge-allergy-ink text-white" },
  { id: "anuncio", label: "Anuncio", soft: "bg-anuncio-soft text-anuncio", solid: "bg-anuncio text-white" },
];

const REQUIRED_MESSAGE = "Completá este campo.";
const initialSelection = () => new Set(["mateo-fernandez"]);

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-dark">
      {children}
    </p>
  );
}

/* chips del mockup: seleccionada = tinta sobre tinta, no seleccionada = tarjeta */
function chipClasses(selected: boolean) {
  return `cursor-pointer border-[1.5px] font-bold ${
    selected ? "border-ink bg-ink text-white" : "border-line bg-card text-ink-nav"
  }`;
}

function textareaClasses(hasError: boolean) {
  return `w-full rounded-cta border-[1.5px] bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-placeholder ${
    hasError ? "border-clay" : "border-auth-border"
  }`;
}

/* CTA "Nueva publicación" del sidebar + modal de crear-publicacion.dc.html */
export function NewPostButton() {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(initialSelection);
  const [type, setType] = useState<PostType>("actividad");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const allSelected = selectedIds.size === MOCK_CHILDREN.length;

  /* cualquier cierre reinicia el form: al reabrir todo vuelve al estado inicial */
  const close = () => {
    setOpen(false);
    setSelectedIds(initialSelection());
    setType("actividad");
    setDescription("");
    setError(null);
  };

  const toggleChild = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set<string>() : new Set(MOCK_CHILDREN.map((c) => c.id)));
  };

  /* únicamente diseño: valida la descripción y cierra, sin guardar nada */
  const publish = () => {
    if (!description.trim()) {
      setError(REQUIRED_MESSAGE);
      return;
    }
    close();
  };

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
                <button
                  type="button"
                  onClick={publish}
                  className="cursor-pointer text-[15px] font-extrabold text-clay-dark"
                >
                  Publicar
                </button>
              </div>

              <div className="px-[26px] py-6">
                <div className="mb-[22px]">
                  <SectionLabel>PARA</SectionLabel>
                  <div className="flex flex-wrap gap-[9px]">
                    {MOCK_CHILDREN.map((child) => {
                      const firstName = child.fullName.split(" ")[0];
                      const selected = selectedIds.has(child.id);
                      return (
                        <button
                          key={child.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleChild(child.id)}
                          className={`flex items-center gap-2 rounded-full py-[6px] pl-[6px] pr-[14px] text-[14px] ${chipClasses(selected)}`}
                        >
                          <span
                            className="flex size-[26px] items-center justify-center rounded-full font-display text-[13px] font-semibold"
                            style={{ background: child.avatarBg, color: child.avatarFg }}
                          >
                            {firstName.charAt(0)}
                          </span>
                          {firstName}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      aria-pressed={allSelected}
                      onClick={toggleAll}
                      className={`rounded-full px-4 py-[6px] text-[14px] ${chipClasses(allSelected)}`}
                    >
                      Toda la sala
                    </button>
                  </div>
                </div>

                <div className="mb-[22px]">
                  <SectionLabel>TIPO</SectionLabel>
                  <div className="flex flex-wrap gap-[9px]">
                    {POST_TYPES.map((postType) => (
                      <button
                        key={postType.id}
                        type="button"
                        aria-pressed={type === postType.id}
                        onClick={() => setType(postType.id)}
                        className={`rounded-full px-4 py-2 text-[13.5px] font-extrabold ${
                          type === postType.id ? postType.solid : postType.soft
                        }`}
                      >
                        {postType.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-[22px]">
                  <SectionLabel>DESCRIPCIÓN</SectionLabel>
                  <textarea
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                      setError(null);
                    }}
                    placeholder="Contá cómo le fue hoy…"
                    aria-invalid={Boolean(error)}
                    className={`${textareaClasses(Boolean(error))} min-h-[120px] resize-y leading-[1.5]`}
                  />
                  {error && (
                    <p className="mt-[7px] text-[12.5px] font-bold text-clay-dark">{error}</p>
                  )}
                </div>

                <div>
                  <SectionLabel>FOTOS</SectionLabel>
                  <div className="flex gap-3">
                    <div className="flex size-24 items-center justify-center rounded-cta border border-line bg-photo-bg text-chevron">
                      <Icon size={26} strokeWidth={1.7}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
                      </Icon>
                    </div>
                    <div className="flex size-24 flex-col items-center justify-center gap-[6px] rounded-cta border-[1.5px] border-dashed border-photo-border bg-photo-bg text-photo-text">
                      <span className="text-clay-deep">
                        <Icon size={22} strokeWidth={2}>
                          <path d="M12 5v14M5 12h14" />
                        </Icon>
                      </span>
                      <span className="text-[12px]">Agregar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
