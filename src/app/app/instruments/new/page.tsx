import { InstrumentForm } from "@/components/forms";

export default function NewInstrumentPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl">Register an instrument</h1>
      <p className="text-sm text-[var(--muted)] mt-2 mb-6">
        Specifications follow the Legal Metrology (General) Rules, 2011 categories used in this demo.
      </p>
      <div className="card p-5">
        <InstrumentForm />
      </div>
    </div>
  );
}
