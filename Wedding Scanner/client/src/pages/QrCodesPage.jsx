import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

function QrCodesPage() {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await apiClient.get("/guests");
        setGuests(response.data || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to fetch guests.");
      }
    };
    fetchGuests();
  }, []);

  const filteredGuests = useMemo(() => {
    if (!search.trim()) {
      return guests;
    }
    const term = search.trim().toLowerCase();
    return guests.filter(
      (guest) =>
        guest.name.toLowerCase().includes(term) ||
        guest.phone.toLowerCase().includes(term) ||
        (guest.category || "").toLowerCase().includes(term),
    );
  }, [guests, search]);

  const downloadQr = (token, name) => {
    const link = document.createElement("a");
    link.href = `/api/qrcode/${token}`;
    link.download = `${name.replace(/\s+/g, "_")}_qr.png`;
    link.click();
  };

  const downloadAll = async () => {
    for (const guest of filteredGuests) {
      downloadQr(guest.qrToken, guest.name);
    }
  };

  return (
    <section className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">Guest QR Codes</h2>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search guest, phone, category..."
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              onClick={downloadAll}
              disabled={!filteredGuests.length}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
            >
              Download All QR Codes
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGuests.map((guest) => (
          <article key={guest._id} className="rounded-xl bg-white p-4 shadow-sm">
            <img
              src={`/api/qrcode/${guest.qrToken}`}
              alt={`QR for ${guest.name}`}
              className="mx-auto h-56 w-56 rounded border border-slate-200 object-contain"
            />
            <h3 className="mt-3 text-lg font-semibold">{guest.name}</h3>
            <p className="text-sm text-slate-600">{guest.phone}</p>
            <p className="text-sm text-slate-600">{guest.category || "General"}</p>
            <button
              onClick={() => downloadQr(guest.qrToken, guest.name)}
              className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Download QR
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default QrCodesPage;
