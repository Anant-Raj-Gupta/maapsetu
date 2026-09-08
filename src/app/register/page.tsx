import { RegisterForm } from "@/components/forms";
import { PublicHeader, PublicFooter } from "@/components/public";

export default function RegisterPage() {
  return (
    <div>
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-5 py-12">
        <h1 className="font-display text-3xl text-[var(--navy)]">Register as an instrument user</h1>
        <p className="text-sm text-[var(--muted)] mt-2 mb-6">
          Shops, weighbridge owners and filling stations. Officers and GATCs are provisioned by the
          department in this prototype.
        </p>
        <div className="card p-5">
          <RegisterForm />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
