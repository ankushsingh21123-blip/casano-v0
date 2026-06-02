'use client';

export function SkeletonPulse({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`skeleton-pulse rounded-xl ${className}`}
      style={style}
    />
  );
}

export default function MobileHomeSkeleton() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-main)' }}>
      {/* Header skeleton */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <SkeletonPulse className="w-10 h-10 rounded-xl" />
            <div>
              <SkeletonPulse className="w-28 h-4 mb-1.5" />
              <SkeletonPulse className="w-20 h-3" />
            </div>
          </div>
          <SkeletonPulse className="w-16 h-8 rounded-full" />
        </div>
        <SkeletonPulse className="w-full h-11 rounded-xl" />
      </div>

      {/* Deals Carousel skeleton */}
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-hidden">
          <SkeletonPulse className="min-w-[280px] h-[160px] rounded-2xl" />
          <SkeletonPulse className="min-w-[280px] h-[160px] rounded-2xl" />
        </div>
      </div>

      {/* Trust badges skeleton */}
      <div className="px-4 mb-4 flex gap-2 overflow-hidden">
        <SkeletonPulse className="min-w-[115px] h-[58px] rounded-2xl" />
        <SkeletonPulse className="min-w-[115px] h-[58px] rounded-2xl" />
        <SkeletonPulse className="min-w-[115px] h-[58px] rounded-2xl" />
      </div>

      {/* Categories skeleton */}
      <div className="px-4 mb-6">
        <SkeletonPulse className="w-36 h-5 mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <SkeletonPulse className="w-[68px] h-[68px] rounded-2xl" />
              <SkeletonPulse className="w-12 h-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Products skeleton */}
      <div className="px-4 py-5 border-t" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
        <div className="flex justify-between mb-4">
          <SkeletonPulse className="w-28 h-5" />
          <SkeletonPulse className="w-14 h-4" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-[145px] rounded-2xl p-3 border" style={{ borderColor: 'var(--surface-border)' }}>
              <SkeletonPulse className="w-full aspect-square rounded-xl mb-3" />
              <SkeletonPulse className="w-24 h-3 mb-2" />
              <SkeletonPulse className="w-12 h-3 mb-2" />
              <div className="flex justify-between items-center">
                <SkeletonPulse className="w-10 h-4" />
                <SkeletonPulse className="w-14 h-7 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .skeleton-pulse {
          background: linear-gradient(
            90deg,
            var(--surface-border) 0%,
            var(--surface-card) 40%,
            var(--surface-border) 80%
          );
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s ease-in-out infinite;
        }
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
    </div>
  );
}
