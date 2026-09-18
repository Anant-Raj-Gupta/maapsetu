"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ComplaintForm({ officers }: { officers: { id: string, name: string, role: string, district: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const targetOfficerId = String(formData.get("targetOfficerId"));
    const applicationSerial = String(formData.get("applicationSerial"));
    const description = String(formData.get("description"));

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetOfficerId, applicationSerial, description }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit complaint. Please check your details.");
      }

      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 bg-white space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold text-[var(--navy)] border-b pb-2">Register a Complaint</h2>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-semibold mb-1">Select Officer (LMO / GATC)</label>
        <select name="targetOfficerId" required className="field w-full">
          <option value="">-- Choose an Officer --</option>
          {officers.map(o => (
            <option key={o.id} value={o.id}>{o.name} ({o.role} - {o.district})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Unique Application Serial No.</label>
        <input 
          type="text" 
          name="applicationSerial" 
          required 
          pattern="[0-9]{9}"
          maxLength={9}
          title="Must be exactly 9 digits"
          className="field w-full font-mono" 
          placeholder="e.g. 123456789"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Complaint Details</label>
        <textarea 
          name="description" 
          required 
          className="field w-full min-h-[120px]" 
          placeholder="Describe your issue with this officer..."
        ></textarea>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full py-2 mt-2">
        {loading ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  );
}
