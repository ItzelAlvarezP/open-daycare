import Link from "next/link";
import type { MockChild } from "@/lib/mock-children";
import { MOCK_CHILDREN } from "@/lib/mock-children";
import { AddChildButton } from "../../_components/add-child-modal";
import { Icon } from "../../_components/icon";

function ChildCard({ child }: { child: MockChild }) {
  return (
    <Link
      href={`/children/${child.id}`}
      className="flex items-center gap-3.5 rounded-composer border border-line bg-card p-4 shadow-kid transition duration-150 hover:-translate-y-0.5 hover:border-kid-hover"
    >
      {/* avatar con la inicial; colores por niño desde el mock */}
      <span
        className="flex size-12 flex-none items-center justify-center rounded-full font-display text-[19px] font-semibold"
        style={{ backgroundColor: child.avatarBg, color: child.avatarFg }}
      >
        {child.fullName.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[16px] font-semibold text-ink">
          {child.fullName}
        </span>
        <span className="block text-[13px] text-muted">
          {child.age} · {child.linkedParents}
        </span>
      </span>
      {child.badge ? (
        <span
          className={`flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold ${
            child.badge.kind === "alergia"
              ? "bg-badge-allergy text-badge-allergy-ink"
              : "bg-badge-invite text-badge-invite-ink"
          }`}
        >
          {child.badge.label}
        </span>
      ) : (
        <span className="flex-none text-chevron">
          <Icon size={18} strokeWidth={2.2}>
            <path d="m9 18 6-6-6-6" />
          </Icon>
        </span>
      )}
    </Link>
  );
}

export default function ChildrenPage() {
  return (
    <main className="min-w-0 flex-1 md:h-dvh md:overflow-y-auto">
      <div className="mx-auto w-full max-w-[880px] px-4 pt-[34px] pb-20 md:px-10">
        {/* encabezado */}
        <div className="mb-[22px] flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-clay-dark">
              GESTIÓN
            </p>
            <h1 className="font-display text-[30px] font-semibold text-ink">
              Niños
            </h1>
          </div>
          <AddChildButton />
        </div>

        {/* buscador decorativo, sin lógica de filtrado */}
        <div className="mb-[22px] flex items-center gap-[11px] rounded-cta border border-line bg-card px-4 py-3">
          <span className="flex-none text-photo-text">
            <Icon size={18}>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </Icon>
          </span>
          <input
            type="text"
            placeholder="Buscar niño…"
            className="w-full flex-1 border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-placeholder"
          />
        </div>

        {/* divisor de sala */}
        <div className="mb-[14px] flex items-center gap-3">
          <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-ink">
            SALA SOLES
          </span>
          <span className="text-[13px] text-muted">
            {MOCK_CHILDREN.length} niños
          </span>
          <span className="h-px flex-1 bg-rule" />
        </div>

        {/* tarjetas: 2 columnas en desktop, 1 en móvil */}
        <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
          {MOCK_CHILDREN.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      </div>
    </main>
  );
}
