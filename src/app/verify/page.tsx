import { redirect } from "next/navigation";
import { PublicFooter, PublicHeader, PageBanner } from "@/components/public";
import { VerifySearch } from "@/components/forms";

export default async function VerifyIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  if (q?.trim()) redirect(`/verify/${encodeURIComponent(q.trim())}`);

  return (
    <div>
      <PublicHeader />
      <PageBanner title="Know Your Certificate" crumbs="Home / Know Your Certificate" />
      <main id="main-content" className="gov-wrap max-w-2xl py-10">
        <p className="text-[var(--muted)] mb-6">
          Enter the verification certificate number printed on the stamp / QR code. No login is
          required for citizens.
        </p>
        <div className="card p-6">
          <VerifySearch />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
