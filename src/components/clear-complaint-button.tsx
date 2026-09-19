"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ClearComplaintButton({ complaintId }: { complaintId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    if (!confirm("Are you sure you want to mark this complaint as cleared?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/complaints/${complaintId}/clear`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to clear complaint");
      router.refresh();
    } catch (err) {
      alert("An error occurred while clearing the complaint.");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClear} 
      disabled={loading} 
      className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors"
    >
      {loading ? "Processing..." : "Mark as Cleared"}
    </button>
  );
}
