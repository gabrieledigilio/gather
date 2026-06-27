export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[var(--ambient-opacity)]"
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8ECAE6" />
            <stop offset="38%" stopColor="#9B5DE5" />
            <stop offset="68%" stopColor="#F15BB5" />
            <stop offset="100%" stopColor="#FEAE57" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="absolute -left-[10%] top-[5%] size-[420px] rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgb(142 202 230 / 0.55) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[5%] top-[15%] size-[380px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgb(155 93 229 / 0.45) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[10%] left-[20%] size-[340px] rounded-full blur-[85px]"
        style={{
          background:
            "radial-gradient(circle, rgb(241 91 181 / 0.4) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[25%] right-[15%] size-[300px] rounded-full blur-[75px]"
        style={{
          background:
            "radial-gradient(circle, rgb(254 174 87 / 0.45) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
