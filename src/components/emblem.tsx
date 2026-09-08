export function Emblem({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#0b3a82" />
      <circle cx="32" cy="32" r="26" fill="#fff" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#0b3a82" strokeWidth="1.5" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const x1 = 32 + Math.cos(a) * 6;
        const y1 = 32 + Math.sin(a) * 6;
        const x2 = 32 + Math.cos(a) * 22;
        const y2 = 32 + Math.sin(a) * 22;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0b3a82" strokeWidth="1.2" />;
      })}
      <circle cx="32" cy="32" r="4" fill="#0b3a82" />
    </svg>
  );
}

export function TricolourFlag({ className = "h-5 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="National flag">
      <rect width="36" height="8" fill="#FF9933" />
      <rect y="8" width="36" height="8" fill="#fff" />
      <rect y="16" width="36" height="8" fill="#138808" />
      <circle cx="18" cy="12" r="3.2" fill="none" stroke="#0b3a82" strokeWidth="0.8" />
    </svg>
  );
}
