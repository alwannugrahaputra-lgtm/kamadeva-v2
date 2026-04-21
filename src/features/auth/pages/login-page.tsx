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
        <div className="glass-card rounded-[36px] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Kamadeva WO</p>
          <h1 className="section-title mt-4 text-6xl font-semibold text-[var(--brand-deep)]">
            Akses dashboard internal Kamadeva.
          </h1>
          <Link href="/" className="mt-6 inline-block text-sm font-semibold text-[var(--brand-deep)]">
            Kembali ke website publik
          </Link>
        </div>

        <form
          method="post"
          action="/api/auth/login"
          className="glass-card rounded-[36px] p-8"
        >
          <input type="hidden" name="next" value={next} />
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Masuk ke dashboard</p>
          <div className="mt-6 space-y-4">
            <input name="email" type="email" placeholder="Email" className="input-base" required />
            <input name="password" type="password" placeholder="Password" className="input-base" required />
          </div>
          {error ? (
            <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : null}
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-deep)] px-5 py-3 text-sm font-semibold text-white"
          >
            Login Admin
          </button>
        </form>
      </div>
    </section>
  );
}
