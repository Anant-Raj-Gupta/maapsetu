import { PublicFooter, PublicHeader } from "@/components/public";
import { VerifySearch } from "@/components/forms";

export default function VerifyIndexPage() {
  return (
    <div>
      <PublicHeader />
      <main className="mx-auto max-w-xl px-5 py-14">
        <h1 className="font-display text-4xl text-[var(--navy)]">Verify a stamp</h1>
        <p className="text-[var(--muted)] mt-3 mb-6">
          Enter the certificate number from the QR code on a weighing or measuring instrument. No
          login required.
        </p>
        <div className="card p-5">
          <VerifySearch />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
