import Link from "next/link";
import { notFound } from "next/navigation";
import type { MockParent } from "@/lib/mock-children";
import { MOCK_CHILDREN } from "@/lib/mock-children";
import { Icon } from "../../_components/icon";

export function generateStaticParams() {
  return MOCK_CHILDREN.map((child) => ({ childId: child.id }));
}

function ParentRow({ parent }: { parent: MockParent }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex size-10 flex-none items-center justify-center rounded-full font-display text-[16px] font-semibold"
        style={{ backgroundColor: parent.avatarBg, color: parent.avatarFg }}
      >
        {parent.fullName.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-extrabold text-ink">
          {parent.fullName}
        </span>
        <span className="block text-[12.5px] text-muted">{parent.meta}</span>
      </span>
      <span
        className={`flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold ${
          parent.status === "activa"
            ? "bg-logro-soft text-logro"
            : "bg-badge-pending text-badge-pending-ink"
        }`}
      >
        {parent.status === "activa" ? "ACTIVA" : "PENDIENTE"}
      </span>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-[18px] py-[15px]">
      <span className="text-[14.5px] text-muted-dark">{label}</span>
      <span className="text-[14.5px] font-extrabold text-ink">{value}</span>
    </div>
  );
}

export default async function ChildProfilePage({
  params,
}: PageProps<"/children/[childId]">) {
  const { childId } = await params;
  const child = MOCK_CHILDREN.find((c) => c.id === childId);
  if (!child) notFound();

  return (
    <main className="min-w-0 flex-1 md:h-dvh md:overflow-y-auto">
      <div className="mx-auto w-full max-w-[820px] px-4 pt-[34px] pb-20 md:px-10">
        <Link
          href="/children"
          className="mb-5 flex items-center gap-[7px] text-[14px] font-bold text-muted-dark"
        >
          <Icon size={18} strokeWidth={2.2}>
            <path d="m15 18-6-6 6-6" />
          </Icon>
          Volver a Niños
        </Link>

        <div className="flex flex-wrap items-start gap-[26px]">
          {/* columna principal */}
          <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
            <div className="flex items-center gap-[18px]">
              <span
                className="flex size-[84px] flex-none items-center justify-center rounded-full font-display text-[34px] font-semibold"
                style={{ backgroundColor: child.avatarBg, color: child.avatarFg }}
              >
                {child.fullName.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <h1 className="font-display text-[28px] font-semibold text-ink">
                  {child.fullName}
                </h1>
                <p className="mt-[3px] text-[15px] text-muted-dark">
                  {child.age} · Sala {child.room}
                </p>
              </span>
              <a
                href="#"
                className="flex-none rounded-item border-[1.5px] border-line bg-card px-4 py-[9px] text-[14px] font-bold text-ink-nav"
              >
                Editar
              </a>
            </div>

            {child.allergyNote && (
              <div className="flex gap-3.5 rounded-photo bg-alert px-[18px] py-4">
                <span className="flex size-10 flex-none items-center justify-center rounded-item bg-alert-icon">
                  <Icon size={22} strokeWidth={2.2}>
                    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                    <path d="M12 9v4M12 17h.01" />
                  </Icon>
                </span>
                <span>
                  <span className="mb-[2px] block text-[15px] font-extrabold text-alert-title">
                    Alergias y notas
                  </span>
                  <span className="block text-[14.5px] leading-[1.5] text-alert-ink">
                    {child.allergyNote}
                  </span>
                </span>
              </div>
            )}

            <div className="overflow-hidden rounded-photo border border-line bg-card">
              <div className="divide-y divide-line-soft">
                <DataField label="Fecha de nacimiento" value={child.birthDate} />
                <DataField label="Sala" value={child.room} />
                <DataField label="Ingreso" value={child.intakeDate} />
              </div>
            </div>
          </div>

          {/* columna lateral */}
          <div className="flex w-[300px] flex-none flex-col gap-3.5">
            <a
              href="#"
              className="flex items-center justify-center gap-[9px] rounded-cta bg-ink py-[13px] text-[15px] font-extrabold text-white"
            >
              <Icon size={18}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </Icon>
              Resumen del día
            </a>

            <div className="rounded-photo border border-line bg-card px-[18px] py-4">
              <p className="mb-3.5 text-[12.5px] font-extrabold tracking-[0.8px] text-label">
                PADRES VINCULADOS
              </p>
              <div className="flex flex-col gap-3.5">
                {child.parents.map((parent) => (
                  <ParentRow key={parent.fullName} parent={parent} />
                ))}
                <a href="#" className="flex items-center gap-3 pt-2">
                  <span className="flex size-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-dash text-photo-text">
                    <Icon size={18} strokeWidth={2.2}>
                      <path d="M12 5v14M5 12h14" />
                    </Icon>
                  </span>
                  <span className="text-[14.5px] font-extrabold text-clay-deep">
                    Vincular otro padre
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
