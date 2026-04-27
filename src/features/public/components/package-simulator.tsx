"use client";


// Penjelasan file: komponen publik untuk tampilan website dan interaksi calon klien.
import { useMemo, useState } from "react";
import { formatCurrency } from "@/shared/lib/format";

type PackageItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  facilities: string;
  minGuests: number | null;
  maxGuests: number | null;
  recommendedVenue: string | null;
};

export function PackageSimulator({ packages }: { packages: PackageItem[] }) {
  const [venue, setVenue] = useState("");
  const [budget, setBudget] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const recommendation = useMemo(() => {
    const budgetValue = Number(budget) || 0;
    const guestValue = Number(guestCount) || 0;

    return (
      packages.find((pkg) => {
        const budgetMatch = !budgetValue || pkg.price <= budgetValue * 1.15;
        const venueMatch =
          !venue ||
          !pkg.recommendedVenue ||
          pkg.recommendedVenue === venue ||
          pkg.recommendedVenue === "FLEKSIBEL";
        const guestMatch =
          !guestValue ||
          ((!pkg.minGuests || guestValue >= pkg.minGuests) &&
            (!pkg.maxGuests || guestValue <= pkg.maxGuests));
        return budgetMatch && venueMatch && guestMatch;
      }) ?? packages[0]
    );
  }, [budget, guestCount, packages, venue]);

  return (
    <div className="paper-panel ornament-ring rounded-[32px] p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <select className="input-base" value={venue} onChange={(event) => setVenue(event.target.value)}>
          <option value="">Pilih venue</option>
          <option value="RUMAH">Nikah di rumah</option>
          <option value="GEDUNG">Nikah di gedung</option>
          <option value="FLEKSIBEL">Fleksibel</option>
        </select>
        <input
          className="input-base"
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
        />
        <input
          className="input-base"
          type="number"
          placeholder="Jumlah tamu"
          value={guestCount}
          onChange={(event) => setGuestCount(event.target.value)}
        />
      </div>

      {recommendation ? (
        <div className="mt-6 rounded-[28px] border border-[rgba(212,175,55,0.12)] bg-[rgba(255,255,255,0.03)] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Rekomendasi paket</p>
          <h3 className="mt-2 section-title text-4xl font-semibold">{recommendation.name}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{recommendation.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="rounded-full border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.1)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]">
              {formatCurrency(recommendation.price)}
            </div>
            <div className="text-sm text-[var(--muted)]">{recommendation.facilities}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
