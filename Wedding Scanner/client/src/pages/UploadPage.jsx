import { useState } from "react";
import apiClient from "../api/client";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [guests, setGuests] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a CSV or JSON file.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGuests(response.data.guests || []);
      setMessage(response.data.message || "Uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Upload Guest List</h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload CSV or JSON with at least <code className="rounded bg-slate-100 px-1">name</code> and{" "}
          <code className="rounded bg-slate-100 px-1">phone</code> fields.
        </p>

        <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="file"
            accept=".csv,application/json,.json"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm md:max-w-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {message && <p className="mt-3 text-sm font-medium text-emerald-600">{message}</p>}
        {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Uploaded Guests ({guests.length})</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Phone</th>
                <th className="px-3 py-2 font-semibold">Category</th>
                <th className="px-3 py-2 font-semibold">Checked In</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest._id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{guest.name}</td>
                  <td className="px-3 py-2">{guest.phone}</td>
                  <td className="px-3 py-2">{guest.category || "General"}</td>
                  <td className="px-3 py-2">{guest.checkedIn ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default UploadPage;
