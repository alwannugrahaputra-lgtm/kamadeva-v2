"use client";


// Penjelasan file: komponen publik untuk tampilan website dan interaksi calon klien.
import { useState } from "react";
import { Button } from "@/components/ui/button";

type LeadFormProps = {
  compact?: boolean;
};

export function LeadForm({ compact = false }: LeadFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setLoading(false);
    setMessage(result.message);

    if (response.ok) {
      const form = document.getElementById("lead-form") as HTMLFormElement | null;
      form?.reset();
    }
  }

  return (
    <form
      id="lead-form"
      action={handleSubmit}
      className="glass-card rounded-[28px] p-6"
    >
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
          Konsultasi Awal
        </p>
        <h3 className="mt-2 section-title text-3xl font-semibold text-[var(--brand-deep)]">
          Ceritakan rencana pernikahan Anda
        </h3>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
          Isi kebutuhan dasar acara Anda, lalu tim Kamadeva akan menghubungi untuk
          konsultasi lanjutan.
        </p>
      </div>
      <div className={compact ? "form-grid" : "form-grid"}>
        <input name="name" placeholder="Nama lengkap" className="input-base" required />
        <input name="whatsapp" placeholder="Nomor WhatsApp" className="input-base" required />
        <input name="eventDate" type="date" className="input-base" />
        <input name="location" placeholder="Lokasi acara" className="input-base" required />
        <input name="budget" type="number" placeholder="Budget" className="input-base" />
        <select name="preferredVenue" className="input-base" defaultValue="">
          <option value="">Preferensi venue</option>
          <option value="RUMAH">Rumah</option>
          <option value="GEDUNG">Gedung</option>
          <option value="FLEKSIBEL">Fleksibel</option>
        </select>
        <input name="guestCount" type="number" placeholder="Jumlah tamu" className="input-base" />
        <input name="neededServices" placeholder="Layanan yang dibutuhkan" className="input-base md:col-span-2" required />
      </div>
      <textarea
        name="notes"
        placeholder="Catatan tambahan"
        className="input-base mt-4 min-h-28"
      />
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[var(--muted)]">Tim kami akan menghubungi Anda secepatnya.</p>
        <Button type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Konsultasi"}
        </Button>
      </div>
      {message ? <p className="mt-4 text-sm text-[var(--brand-deep)]">{message}</p> : null}
    </form>
  );
}
