import React from 'react';

interface YapTrackHomeProps {
  onNavigate: (screen: string) => void;
}

/* ── Mock data (same shape a real API would return) ── */
const weeklyData = [
  { day: 'M', pct: 40 },
  { day: 'T', pct: 65 },
  { day: 'W', pct: 30 },
  { day: 'T', pct: 85, active: true },
  { day: 'F', pct: 55 },
  { day: 'S', pct: 20 },
  { day: 'S', pct: 45 },
];

const stats = [
  { label: 'EXERCISE', idx: '(01)', value: '12.5', unit: 'Hours', trend: '▲ 12%' },
  { label: 'HYDRATION', idx: '(02)', value: '2.4', unit: 'Liters/Avg', trend: '▼ 5%' },
  { label: 'MEALS', idx: '(03)', value: '21', unit: 'Logged', trend: '• STABLE' },
  { label: 'FOCUS', idx: '(04)', value: '85', unit: 'Score', trend: '▲ 2PTS' },
];

const milestones = [
  { num: '14', title: 'Days Active', desc: 'You have maintained a consistent logging streak for two weeks.' },
  { num: '05', title: 'Hydration Goal', desc: 'Daily water intake target met for five consecutive days.' },
];

const marqueeText =
  'ACTIVITY SUMMARY \u00a0•\u00a0 CONSISTENCY IS KEY \u00a0•\u00a0 KEEP MOVING \u00a0•\u00a0 STAY HYDRATED \u00a0•\u00a0 ';

/* ── Shared border style (driven by theme token) ── */
const bdr = 'border-[length:var(--yt-border-width,1.5px)] border-t-border';

const YapTrackHome: React.FC<YapTrackHomeProps> = ({ onNavigate }) => {
  return (
    <div
      className="min-h-screen pb-[80px] bg-t-bg text-t-text overflow-x-hidden"
      style={{ fontFamily: 'var(--t-font-body)' }}
    >
      {/* ── Header ── */}
      <header
        className={`p-4 flex justify-between items-end border-b ${bdr}`}
      >
        <h1
          className="text-[3rem] leading-[0.9] tracking-[-0.02em] uppercase max-w-[70%]"
          style={{ fontFamily: 'var(--t-font-display)', fontWeight: 400 }}
        >
          Yap<br />Track
        </h1>
        <div className="text-right flex flex-col gap-1">
          <span className="text-xs uppercase font-semibold tracking-wider">(01)</span>
          <span className="text-xs uppercase font-semibold tracking-wider">WEEK 42</span>
          <span className="text-xs uppercase font-semibold tracking-wider">2024</span>
        </div>
      </header>

      {/* ── Marquee Ticker ── */}
      <div className={`border-b ${bdr} py-2 overflow-hidden whitespace-nowrap`}>
        <div
          className="inline-block text-xs uppercase font-bold tracking-wider"
          style={{ animation: 'yt-marquee 12s linear infinite' }}
        >
          {marqueeText}{marqueeText}
        </div>
      </div>

      {/* ── Weekly Activity Chart ── */}
      <section className={`p-4 border-b ${bdr}`}>
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider block">WEEKLY ACTIVITY</span>
            <h2 className="text-2xl uppercase mt-1 font-bold">Overview</h2>
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider">TOTAL: 42H</span>
        </div>

        <div className="relative flex justify-between items-end h-[180px] pt-5">
          {/* Guide lines */}
          <div className="absolute inset-x-0 top-0 border-t border-dashed border-t-text/20 pointer-events-none" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-t-text/20 pointer-events-none" />

          {weeklyData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 z-10">
              <div className="relative w-full flex justify-center">
                <div
                  className="w-full max-w-[24px] bg-t-text transition-[height] duration-300 hover:opacity-80"
                  style={{ height: `${d.pct}%` }}
                />
                {d.active && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-t-text" />
                )}
              </div>
              <span className="text-[0.7rem] font-bold">{d.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Grid (2×2) ── */}
      <section className="grid grid-cols-2">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`p-4 flex flex-col justify-between h-[140px] border-b ${bdr} ${
              i % 2 === 0 ? 'border-r' : ''
            }`}
          >
            <div className="flex justify-between w-full">
              <span className="text-xs uppercase font-semibold tracking-wider">{s.label}</span>
              <span className="text-[0.8rem] font-semibold">{s.idx}</span>
            </div>
            <div>
              <div
                className="text-[2.5rem] font-bold leading-none mb-1"
                style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.05em' }}
              >
                {s.value}
              </div>
              <span className="text-[0.8rem] uppercase opacity-70">{s.unit}</span>
              <div className="inline-block ml-2 text-[0.7rem] font-semibold border border-t-border px-1 py-[1px] mt-1">
                {s.trend}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Milestones / Streaks ── */}
      <section>
        <div className={`p-4 flex items-center gap-2 border-b ${bdr}`}>
          <div className="w-3 h-3 rounded-full bg-t-text" />
          <span className="text-xs uppercase font-semibold tracking-wider">CURRENT STREAKS</span>
        </div>

        {milestones.map((m, i) => (
          <div key={i} className={`p-4 flex items-start gap-4 border-b ${bdr}`}>
            <div
              className="text-[3rem] leading-[0.8] font-bold min-w-[60px]"
              style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px' }}
            >
              {m.num}
            </div>
            <div>
              <h3 className="text-xl uppercase mb-1 leading-none font-bold">{m.title}</h3>
              <p className="text-[0.85rem] leading-snug max-w-[30ch]">{m.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default YapTrackHome;
