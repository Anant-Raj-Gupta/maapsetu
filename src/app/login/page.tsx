import Link from "next/link";
import { LoginForm } from "@/components/forms";
import { PublicHeader, PublicFooter, PageBanner } from "@/components/public";

export default function LoginPage() {
  return (
    <div>
      <PublicHeader search />
      <PageBanner title="Stakeholder login" crumbs="Home / Stakeholder Login" />
      <main id="main-content" className="gov-wrap max-w-xl py-10">
        <p className="text-sm text-[var(--muted)] mb-6">
          Role-based access for instrument users, Legal Metrology Officers, GATCs and the Controller
          of Legal Metrology.
        </p>
        <div className="card p-6">
          <LoginForm />
        </div>
        <p className="text-sm mt-4">
          New instrument user?{" "}
          <Link href="/register" className="text-[var(--navy)] font-semibold underline">
            Register
          </Link>
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
