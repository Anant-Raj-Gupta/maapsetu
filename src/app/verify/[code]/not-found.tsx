import { PublicFooter, PublicHeader } from "@/components/public";

export default function NotFound() {
  return (
    <div>
      <PublicHeader />
      <main className="mx-auto max-w-xl px-5 py-16">
        <h1 className="font-display text-3xl">Certificate not found</h1>
        <p className="mt-3 text-[var(--muted)]">
          No verification certificate matches that number. Check the QR code or application status.
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
