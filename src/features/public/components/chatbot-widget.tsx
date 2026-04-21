"use client";


// Penjelasan file: komponen publik untuk tampilan website dan interaksi calon klien.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/shared/lib/format";

type ChatbotResponse = {
  message: string;
  recommendation: {
    name: string;
    price: number;
    facilities: string;
  } | null;
};

export function ChatbotWidget() {
  const [question, setQuestion] = useState("");
  const [venue, setVenue] = useState("");
  const [budget, setBudget] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [result, setResult] = useState<ChatbotResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    setLoading(true);
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        venue,
        budget: Number(budget) || undefined,
        guestCount: Number(guestCount) || undefined,
      }),
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="glass-card rounded-[32px] p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Asisten Paket</p>
      <h3 className="mt-2 section-title text-4xl font-semibold">Temukan pilihan yang paling sesuai</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <select className="input-base" value={venue} onChange={(event) => setVenue(event.target.value)}>
          <option value="">Pilih lokasi acara</option>
          <option value="RUMAH">Rumah</option>
          <option value="GEDUNG">Gedung</option>
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
        <input
          className="input-base"
          placeholder="Pertanyaan singkat atau kebutuhan"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
      </div>
      <div className="mt-4">
        <Button onClick={handleAsk} disabled={loading}>
          {loading ? "Memproses..." : "Lihat Rekomendasi"}
        </Button>
      </div>
      {result ? (
        <div className="mt-5 rounded-[24px] bg-white p-5">
          <p className="text-sm leading-7 text-[var(--foreground)]">{result.message}</p>
          {result.recommendation ? (
            <div className="mt-4 rounded-[20px] bg-[var(--soft)] p-4">
              <p className="font-semibold text-[var(--brand-deep)]">{result.recommendation.name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{formatCurrency(result.recommendation.price)}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{result.recommendation.facilities}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
