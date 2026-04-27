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
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="paper-panel ornament-ring rounded-[36px] p-8">
          <p className="eyebrow">Kamadeva WO</p>
          <h1 className="section-title mt-5 text-6xl font-semibold text-[var(--brand-deep)]">
            Akses dashboard internal Kamadeva.
          </h1>
          <p className="section-copy mt-4 max-w-md text-sm">
            Flow login tetap sama, tetapi tampil lebih premium dan lebih selaras
            dengan identitas black-gold Kamadeva.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm font-semibold text-[var(--accent)]">
            Kembali ke website publik
          </Link>
        </div>

        <form
          method="post"
          action="/api/auth/login"
          className="paper-panel ornament-ring rounded-[36px] p-8"
        >
          <input type="hidden" name="next" value={next} />
          <p className="eyebrow">Masuk ke dashboard</p>
          <div className="mt-6 space-y-4">
            <input name="email" type="email" placeholder="Email" className="input-base" required />
            <input name="password" type="password" placeholder="Password" className="input-base" required />
          </div>
          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#F5D77A,#D4AF37_52%,#B98E18)] px-5 py-3 text-sm font-semibold text-[#0b0b0b] shadow-[0_18px_38px_rgba(212,175,55,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_22px_44px_rgba(212,175,55,0.28)]"
          >
            Login Admin
          </button>
        </form>
      </div>
    </section>
  );
}
