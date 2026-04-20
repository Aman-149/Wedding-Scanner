import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

function DashboardPage() {
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await apiClient.get("/guests");
        setGuests(response.data || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load dashboard data.");
      }
    };
    fetchGuests();
  }, []);

  const stats = useMemo(() => {
    const total = guests.length;
    const checkedIn = guests.filter((guest) => guest.checkedIn).length;
    return {
      total,
      checkedIn,
      notCheckedIn: total - checkedIn,
    };
  }, [guests]);

  const cards = [
    { label: "Total Guests", value: stats.total, style: "bg-blue-50 text-blue-700" },
    { label: "Checked In", value: stats.checkedIn, style: "bg-emerald-50 text-emerald-700" },
    { label: "Not Checked In", value: stats.notCheckedIn, style: "bg-amber-50 text-amber-700" },
  ];

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-xl p-5 shadow-sm ${card.style}`}>
            <p className="text-sm font-medium">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
