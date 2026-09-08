"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_ACCOUNTS, INSTRUMENT_CATALOGUE } from "@/lib/constants";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Could not sign in");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <label className="lbl">Email</label>
        <input name="email" type="email" required className="field" defaultValue="shop@maapsetu.gov.in" />
      </div>
      <div>
        <label className="lbl">Password</label>
        <input name="password" type="password" required className="field" defaultValue="Shop@123" />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <div className="rounded-xl bg-[var(--cream)] p-3 text-xs space-y-1">
        <p className="font-semibold text-[var(--navy)]">Demo accounts</p>
        {DEMO_ACCOUNTS.map((a) => (
          <p key={a.email}>
            {a.role}: {a.email} / {a.password}
          </p>
        ))}
      </div>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setError("");
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not register");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="lbl">Business / owner name</label>
        <input name="name" required className="field" />
      </div>
      <div>
        <label className="lbl">Email</label>
        <input name="email" type="email" required className="field" />
      </div>
      <div>
        <label className="lbl">Password</label>
        <input name="password" type="password" required className="field" />
      </div>
      <div>
        <label className="lbl">Phone</label>
        <input name="phone" required className="field" />
      </div>
      <div>
        <label className="lbl">Organisation</label>
        <input name="organisation" required className="field" />
      </div>
      <div>
        <label className="lbl">District</label>
        <input name="district" required className="field" defaultValue="Hyderabad" />
      </div>
      <div>
        <label className="lbl">State</label>
        <input name="state" required className="field" defaultValue="Telangana" />
      </div>
      {error ? <p className="sm:col-span-2 text-sm text-red-700">{error}</p> : null}
      <button className="btn btn-primary sm:col-span-2">Create trader account</button>
    </form>
  );
}

export function InstrumentForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    const res = await fetch("/api/instruments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.push("/app/instruments");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="lbl">Instrument category</label>
        <select name="category" className="field" required>
          {INSTRUMENT_CATALOGUE.map((c) => (
            <option key={c.category} value={c.category}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="lbl">Serial number</label>
        <input name="serialNumber" required className="field" />
      </div>
      <div>
        <label className="lbl">Make</label>
        <input name="make" required className="field" />
      </div>
      <div>
        <label className="lbl">Model</label>
        <input name="model" required className="field" />
      </div>
      <div>
        <label className="lbl">Capacity / e</label>
        <input name="capacity" required className="field" placeholder="30 kg / e=5 g" />
      </div>
      <div className="sm:col-span-2">
        <label className="lbl">Premises name</label>
        <input name="premisesName" required className="field" />
      </div>
      <div className="sm:col-span-2">
        <label className="lbl">Address</label>
        <input name="address" required className="field" />
      </div>
      <div>
        <label className="lbl">Latitude</label>
        <input name="lat" required className="field" defaultValue="17.385" />
      </div>
      <div>
        <label className="lbl">Longitude</label>
        <input name="lng" required className="field" defaultValue="78.486" />
      </div>
      {error ? <p className="sm:col-span-2 text-sm text-red-700">{error}</p> : null}
      <button className="btn btn-primary sm:col-span-2">Save instrument</button>
    </form>
  );
}

export function ApplyButton({ instrumentId, type }: { instrumentId: string; type: "FIRST" | "REVERIFICATION" }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function apply() {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instrumentId, type }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.push("/app/applications");
    router.refresh();
  }

  return (
    <div>
      <button onClick={apply} className="btn btn-accent py-2 text-sm">
        Apply {type === "FIRST" ? "first verification" : "re-verification"}
      </button>
      {error ? <p className="text-xs text-red-700 mt-1">{error}</p> : null}
    </div>
  );
}

export function AssignForm({
  applicationId,
  officers,
}: {
  applicationId: string;
  officers: { id: string; name: string; role: string }[];
}) {
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    await fetch(`/api/applications/${applicationId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        officerId: formData.get("officerId"),
        scheduledAt: formData.get("scheduledAt"),
      }),
    });
    router.refresh();
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const value = tomorrow.toISOString().slice(0, 16);

  return (
    <form action={onSubmit} className="flex flex-wrap gap-2 items-end">
      <select name="officerId" className="field" required>
        {officers.map((o) => (
          <option key={o.id} value={o.id}>
            {o.role} — {o.name}
          </option>
        ))}
      </select>
      <input type="datetime-local" name="scheduledAt" className="field" defaultValue={value} />
      <button className="btn btn-primary">Assign</button>
    </form>
  );
}

export function AutoAssignButton() {
  const router = useRouter();
  const [msg, setMsg] = useState("");

  async function run() {
    const res = await fetch("/api/admin/auto-assign", { method: "POST" });
    const data = await res.json();
    setMsg(`Assigned ${data.assigned} pending applications by instrument type and load.`);
    router.refresh();
  }

  return (
    <div>
      <button onClick={run} className="btn btn-accent">
        Auto-assign pending jobs
      </button>
      {msg ? <p className="text-sm mt-2 text-[var(--forest)]">{msg}</p> : null}
    </div>
  );
}

export function InspectForm({
  applicationId,
  lat,
  lng,
}: {
  applicationId: string;
  lat: number;
  lng: number;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [coords, setCoords] = useState({ lat, lng });

  function useLocation() {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }

  async function onSubmit(formData: FormData) {
    formData.set("lat", String(coords.lat));
    formData.set("lng", String(coords.lng));
    const res = await fetch(`/api/applications/${applicationId}/inspect`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.push("/app/applications");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="lbl">Result</label>
          <select name="result" className="field" required>
            <option value="PASS">PASS — within MPE</option>
            <option value="FAIL">FAIL — exceeds MPE</option>
          </select>
        </div>
        <div>
          <label className="lbl">Observed error</label>
          <input name="observedError" required className="field" placeholder="+0.4 e" />
        </div>
        <div className="sm:col-span-2">
          <label className="lbl">Working standard used</label>
          <input name="standardUsed" className="field" placeholder="F2 1 kg working standard" />
        </div>
        <div className="sm:col-span-2">
          <label className="lbl">Observations</label>
          <textarea name="notes" required className="field min-h-24" />
        </div>
        <div className="sm:col-span-2">
          <label className="lbl">Site photograph</label>
          <input name="photo" type="file" accept="image/*" capture="environment" className="field" />
        </div>
      </div>
      <p className="text-xs text-[var(--muted)]">
        Geo-tag: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} — hardcoded onto the inspection
        record with timestamp.
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={useLocation} className="btn btn-ghost">
          Use live GPS
        </button>
        <button className="btn btn-primary">Submit inspection</button>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-primary mt-6 print:hidden">
      Print
    </button>
  );
}

export function VerifySearch() {
  const router = useRouter();
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const value = String(new FormData(e.currentTarget).get("code") || "");
        if (value) router.push(`/verify/${encodeURIComponent(value.trim())}`);
      }}
    >
      <input
        name="code"
        className="field"
        placeholder="VC/TS/HYD/2025/00011"
        defaultValue="VC/TS/HYD/2025/00011"
      />
      <button className="btn btn-primary">Verify</button>
    </form>
  );
}
