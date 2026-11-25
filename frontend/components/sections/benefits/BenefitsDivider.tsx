export function BenefitsDivider() {
  return (
    <div
      className="relative py-10 md:py-16 flex items-center justify-center max-w-5xl mx-auto px-6"
      aria-hidden="true"
    >
      {/* 1px line fading out towards the edges */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      {/* Centered 10x10px diamond in zinc-900 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-zinc-900 ring-4 ring-white shadow-2xs" />
    </div>
  );
}
