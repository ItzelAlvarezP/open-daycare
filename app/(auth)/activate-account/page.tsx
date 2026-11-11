import { SunLogo } from "../../_components/sun-logo";

/* Activación de cuenta solo diseño según activar-cuenta.dc.html, sin lógica */
export default function ActivateAccountPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-auth-bg p-6 md:p-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-[22px] flex size-[58px] items-center justify-center rounded-[18px] bg-[linear-gradient(155deg,var(--color-avatar-from),var(--color-avatar-to))] shadow-auth-icon">
          <SunLogo size={30} />
        </div>

        <h1 className="font-display text-[32px] font-semibold leading-[1.15] text-ink">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-[26px] mt-2 text-[15.5px] leading-[1.55] text-muted-dark">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.
        </p>

        <div className="mb-[22px] flex items-center gap-[14px] rounded-[16px] border border-auth-border bg-white px-4 py-3.5">
          <div className="flex size-[44px] items-center justify-center rounded-full bg-kid-avatar font-display text-[19px] font-semibold text-kid-avatar-ink">
            M
          </div>
          <div>
            <div className="text-[13px] text-muted-dark">Te invitaron a seguir a</div>
            <div className="font-display text-[17px] font-semibold text-ink">Mateo · Sala Soles</div>
          </div>
        </div>

        <label htmlFor="code" className="mb-2 block text-xs font-bold tracking-[.7px] text-muted-dark">
          CÓDIGO DE INVITACIÓN
        </label>
        <input
          id="code"
          type="text"
          defaultValue="7K4P9"
          className="mb-[18px] w-full rounded-cta border border-auth-border bg-white px-4 py-[14px] font-display text-[18px] font-bold tracking-[3px] text-ink focus:outline-none"
        />

        <label htmlFor="email" className="mb-2 block text-xs font-bold tracking-[.7px] text-muted-dark">
          EMAIL
        </label>
        <input
          id="email"
          type="email"
          defaultValue="lucia.fernandez@gmail.com"
          className="mb-[18px] w-full rounded-cta border border-auth-border bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-placeholder focus:outline-none"
        />

        <label htmlFor="new-password" className="mb-2 block text-xs font-bold tracking-[.7px] text-muted-dark">
          CREAR CONTRASEÑA
        </label>
        <input
          id="new-password"
          type="password"
          placeholder="••••••••"
          className="mb-[18px] w-full rounded-cta border border-kid-hover bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-placeholder focus:outline-none"
        />

        <div className="mb-6 flex items-start gap-3 rounded-cta bg-consent-bg px-4 py-3.5">
          <div className="mt-px flex size-6 flex-none items-center justify-center rounded-lg bg-consent-check text-white">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-sm leading-[1.45] text-consent-ink">
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.
          </span>
        </div>

        <a
          href="#"
          className="block rounded-[15px] bg-[linear-gradient(180deg,var(--color-cta-from),var(--color-cta-to))] py-[15px] text-center text-base font-extrabold text-white shadow-auth-cta"
        >
          Activar mi cuenta
        </a>

        <p className="mt-[22px] text-center text-[14.5px] text-muted-dark">
          ¿Ya tenés cuenta?{" "}
          <a href="#" className="font-extrabold text-clay-deep">
            Iniciar sesión
          </a>
        </p>
      </div>
    </main>
  );
}
