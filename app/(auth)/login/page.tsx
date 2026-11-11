import { SunLogo } from "../../_components/sun-logo";

/* Login solo diseño según login.dc.html, sin selector de rol ni lógica */
export default function LoginPage() {
  return (
    <main className="grid min-h-dvh grid-cols-1 bg-auth-bg md:grid-cols-[1.05fr_1fr]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,var(--color-auth-from)_0%,var(--color-avatar-to)_45%,var(--color-auth-to)_100%)] px-8 py-10 text-white md:px-[60px] md:py-14">
        <div aria-hidden className="absolute -right-[120px] -top-[140px] size-[420px] rounded-full bg-white/12" />
        <div aria-hidden className="absolute -bottom-[110px] -left-[80px] size-[300px] rounded-full bg-white/10" />

        <div className="relative flex items-center gap-[13px]">
          <div className="flex size-[46px] items-center justify-center rounded-cta bg-white/22">
            <SunLogo size={26} />
          </div>
          <span className="font-display text-[21px] font-semibold tracking-[.5px]">OpenDayCare</span>
        </div>

        <div className="relative">
          <h1 className="font-display text-[32px] font-semibold leading-[1.12] md:text-[42px]">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p className="mt-[18px] max-w-[430px] text-[15px] leading-[1.6] text-white/92 md:text-[17px]">
            Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.
          </p>
        </div>

        <div className="relative text-sm text-white/90">🌿 Guardería Sala Soles</div>
      </section>

      <section className="flex items-center justify-center p-10">
        <div className="w-full max-w-[392px]">
          <h2 className="font-display text-[30px] font-semibold text-ink">Iniciar sesión</h2>
          <p className="mb-7 mt-1.5 text-[15px] text-muted-dark">Ingresá para ver el día de hoy.</p>

          <label htmlFor="email" className="mb-2 block text-xs font-bold tracking-[.7px] text-muted-dark">
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            defaultValue="caro@opendaycare.com"
            className="mb-[18px] w-full rounded-cta border border-auth-border bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-placeholder focus:outline-none"
          />

          <label htmlFor="password" className="mb-2 block text-xs font-bold tracking-[.7px] text-muted-dark">
            CONTRASEÑA
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="mb-[10px] w-full rounded-cta border border-auth-border bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-placeholder focus:outline-none"
          />

          <div className="mb-5 text-right">
            <a href="#" className="text-[13.5px] font-bold text-clay-deep">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <a
            href="#"
            className="block rounded-[15px] bg-[linear-gradient(180deg,var(--color-cta-from),var(--color-cta-to))] py-[15px] text-center text-base font-extrabold text-white shadow-auth-cta"
          >
            Iniciar sesión
          </a>

          <p className="mt-6 text-center text-[14.5px] text-muted-dark">
            ¿Te invitó la guardería?{" "}
            <a href="#" className="font-extrabold text-clay-deep">
              Activá tu cuenta
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
