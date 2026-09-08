import { RegisterForm } from "@/components/forms";
import { PublicHeader, PublicFooter, PageBanner } from "@/components/public";

export default function RegisterPage() {
  return (
    <div>
      <PublicHeader search />
      <PageBanner title="New registration — instrument user" crumbs="Home / New Registration" />
      <main id="main-content" className="gov-wrap max-w-3xl py-10">
        <p className="text-sm text-[var(--muted)] mb-6">
          For shops, weighbridge owners and filling stations. Officers and GATCs are provisioned by
          the department in this prototype.
        </p>
        <div className="card p-6">
          <RegisterForm />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
