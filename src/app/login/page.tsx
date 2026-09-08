import Link from "next/link";
import { LoginForm } from "@/components/forms";
import { PublicHeader, PublicFooter } from "@/components/public";

export default function LoginPage() {
  return (
    <div>
      <PublicHeader />
      <main className="mx-auto max-w-md px-5 py-12">
        <h1 className="font-display text-3xl text-[var(--navy)]">Sign in</h1>
        <p className="text-sm text-[var(--muted)] mt-2 mb-6">
          Role-based access for traders, LMOs, GATCs and the Controller.
        </p>
        <div className="card p-5">
          <LoginForm />
        </div>
        <p className="text-sm mt-4">
          New instrument user?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
