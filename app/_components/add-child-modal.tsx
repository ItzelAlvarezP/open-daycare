"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "./icon";

type FieldErrors = Partial<Record<"fullName" | "birthDate" | "room", string>>;

const REQUIRED_MESSAGE = "Completá este campo.";
const DATE_FORMAT_MESSAGE = "Usá el formato dd/mm/aaaa.";

/* dd/mm/aaaa con rangos plausibles y fecha existente, sin fechas futuras */
function isValidBirthDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getTime() <= Date.now()
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-muted-dark">
      {children}
    </p>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-[7px] text-[12.5px] font-bold text-clay-dark">{message}</p>;
}

function inputClasses(error?: string) {
  return `w-full rounded-cta border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink outline-none placeholder:text-placeholder ${
    error ? "border-clay" : "border-auth-border"
  }`;
}

/* CTA "Agregar niño" + modal de agregar-nino.dc.html sobre /children */
export function AddChildButton() {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors | null>(null);

  const close = () => {
    setOpen(false);
    setErrors(null);
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev || !prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return Object.keys(next).length ? next : null;
    });
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fullName = String(data.get("fullName") ?? "").trim();
    const birthDate = String(data.get("birthDate") ?? "").trim();
    const room = String(data.get("room") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!fullName) nextErrors.fullName = REQUIRED_MESSAGE;
    if (!birthDate) nextErrors.birthDate = REQUIRED_MESSAGE;
    else if (!isValidBirthDate(birthDate)) nextErrors.birthDate = DATE_FORMAT_MESSAGE;
    if (!room) nextErrors.room = REQUIRED_MESSAGE;

    const hasErrors = Object.keys(nextErrors).length > 0;
    setErrors(hasErrors ? nextErrors : null);
    if (!hasErrors) close();
  };

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
          onClick={close}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-backdrop px-6 py-10 max-sm:p-6"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[520px] overflow-hidden rounded-modal border border-line bg-auth-bg shadow-modal"
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
                Agregar niño
              </span>
              <button
                type="submit"
                form="add-child-form"
                className="cursor-pointer text-[15px] font-extrabold text-clay-dark"
              >
                Guardar
              </button>
            </div>

            <form id="add-child-form" onSubmit={handleSubmit} noValidate>
              <div className="px-[26px] py-6">
                <div className="mb-[18px]">
                  <FieldLabel>NOMBRE COMPLETO</FieldLabel>
                  <input
                    name="fullName"
                    placeholder="Ej. Martina López"
                    aria-invalid={Boolean(errors?.fullName)}
                    onChange={() => clearFieldError("fullName")}
                    className={inputClasses(errors?.fullName)}
                  />
                  {errors?.fullName && <FieldError message={errors.fullName} />}
                </div>

                <div className="mb-[18px] flex gap-3.5">
                  <div className="min-w-0 flex-1">
                    <FieldLabel>FECHA DE NACIMIENTO</FieldLabel>
                    <input
                      name="birthDate"
                      placeholder="dd/mm/aaaa"
                      aria-invalid={Boolean(errors?.birthDate)}
                      onChange={() => clearFieldError("birthDate")}
                      className={inputClasses(errors?.birthDate)}
                    />
                    {errors?.birthDate && <FieldError message={errors.birthDate} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <FieldLabel>SALA</FieldLabel>
                    <div className="relative">
                      <select
                        name="room"
                        defaultValue="Soles"
                        aria-invalid={Boolean(errors?.room)}
                        onChange={() => clearFieldError("room")}
                        className={`${inputClasses(errors?.room)} appearance-none pr-10 font-bold`}
                      >
                        <option value="Soles">Soles</option>
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-photo-text">
                        <Icon size={16} strokeWidth={2.2}>
                          <path d="m6 9 6 6 6-6" />
                        </Icon>
                      </span>
                    </div>
                    {errors?.room && <FieldError message={errors.room} />}
                  </div>
                </div>

                <div className="mb-[18px]">
                  <FieldLabel>ALERGIAS (ETIQUETAS)</FieldLabel>
                  <input
                    name="allergies"
                    placeholder="Ej. Maní, Lactosa"
                    className={inputClasses()}
                  />
                </div>

                <div>
                  <FieldLabel>NOTAS MÉDICAS</FieldLabel>
                  <textarea
                    name="medicalNotes"
                    placeholder="Indicaciones, medicación, contactos…"
                    className={`${inputClasses()} min-h-[90px] resize-y leading-[1.5]`}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
