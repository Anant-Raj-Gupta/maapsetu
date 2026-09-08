import { PublicFooter, PublicHeader, PageBanner } from "@/components/public";

export default function NotFound() {
  return (
    <div>
      <PublicHeader search />
      <PageBanner title="Certificate not found" crumbs="Home / Know Your Certificate" />
      <main id="main-content" className="gov-wrap max-w-xl py-12">
        <p className="text-[var(--muted)]">
          No verification certificate matches that number in the MaapSetu repository. Please check
          the QR code or contact the circle office.
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
