import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import apiClient from "../api/client";

const parseTokenFromQrText = (text) => {
  if (!text) return null;
  try {
    const url = new URL(text);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments.at(-1) || null;
  } catch {
    const segments = text.split("/").filter(Boolean);
    return segments.at(-1) || null;
  }
};

function ScannerPage() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [lastToken, setLastToken] = useState("");

  const handleScan = async (results) => {
    if (!results?.length) return;
    const scannedText = results[0].rawValue;
    const token = parseTokenFromQrText(scannedText);

    if (!token || token === lastToken) return;
    setLastToken(token);

    try {
      const response = await apiClient.get(`/checkin/${token}`);
      setStatus({
        type: "success",
        message: `Approved: ${response.data.name}`,
      });
    } catch (scanError) {
      if (scanError.response?.status === 409) {
        setStatus({ type: "error", message: "Already checked in." });
      } else if (scanError.response?.status === 404) {
        setStatus({ type: "error", message: "Invalid QR." });
      } else {
        setStatus({ type: "error", message: "Check-in failed." });
      }
    }
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[2fr,1fr]">
      <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Entrance Scanner</h2>
        <Scanner
          onScan={handleScan}
          onError={() => {
            setStatus({ type: "error", message: "Unable to access camera." });
          }}
          constraints={{ facingMode: "environment" }}
        />
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Check-in Status</h3>
        {!status.message ? (
          <p className="mt-3 text-slate-600">Scan a guest QR code to validate entry.</p>
        ) : (
          <p
            className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold ${
              status.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}

export default ScannerPage;
