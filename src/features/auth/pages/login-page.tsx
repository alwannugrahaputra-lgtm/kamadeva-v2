// Penjelasan file: halaman autentikasi untuk pengguna internal.
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;
  const next = params.next ?? "/admin";

  return (
    <section className="container-shell flex min-h-[calc(100vh-120px)] items-center py-14">
      <div className="grid w-full gap-4 rounded-[34px] border border-[rgba(184,139,84,0.14)] bg-[rgba(255,251,246,0.82)] p-3 shadow-[0_28px_60px_rgba(123,96,68,0.1)] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(55,41,31,0.98),rgba(35,26,20,0.98))] p-6 text-white">
          <div className="flex min-h-full flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[rgba(255,241,224,0.72)]">
                Kamadeva
              </p>
              <h1 className="mt-5 font-display text-[2.8rem] leading-none text-[#fffaf3]">
                Wedding Organizer
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-7 text-[rgba(255,243,229,0.74)]">
                Satu sistem. Semua terorganisir untuk kebutuhan owner, admin, dan staf operasional.
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
              <div className="aspect-[4/5] w-full bg-[linear-gradient(180deg,rgba(255,236,212,0.08),rgba(255,236,212,0.02)),url('/portfolio/hadiyan-annisa.jpg')] bg-cover bg-center" />
            </div>
            <Link href="/" className="mt-6 inline-block text-sm font-semibold text-[#f0c486]">
              Kembali ke website publik
            </Link>
          </div>
        </div>

        <form method="post" action="/api/auth/login" className="paper-panel rounded-[28px] p-7 lg:p-8">
          <input type="hidden" name="next" value={next} />
          <p className="text-sm font-semibold text-[var(--brand)]">Selamat Datang Kembali</p>
          <h2 className="section-title mt-3 text-4xl font-semibold text-[var(--brand-deep)]">Login untuk mengakses sistem</h2>
          <p className="section-copy mt-3 text-sm">Gunakan akun internal Kamadeva untuk masuk ke dashboard.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--brand-deep)]">Email</label>
              <input name="email" type="email" placeholder="admin@kamadeva.com" className="input-base" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--brand-deep)]">Password</label>
              <input name="password" type="password" placeholder="Masukkan password" className="input-base" required />
            </div>
          </div>
          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#d1a365,#b88748)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(184,139,84,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(184,139,84,0.24)]"
          >
            Login
          </button>
          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            Belum punya akun? Hubungi owner.
          </p>
        </form>
      </div>
    </section>
  );
}
