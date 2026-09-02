interface MascotProps {
  size?: number
  /** subtle expression variation */
  mood?: 'calm' | 'happy' | 'wave'
  className?: string
}

/**
 * "רוני" — a soft, low-arousal companion character that guides the
 * child through the journey. Deliberately simple, rounded and gentle:
 * muted colours, a calm face, no sudden features.
 */
export function Mascot({ size = 96, mood = 'calm', className }: MascotProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="רוני, החבר שמלווה אותנו"
    >
      {/* body */}
      <ellipse cx="60" cy="66" rx="42" ry="40" fill="#bfe3df" />
      <ellipse cx="60" cy="66" rx="42" ry="40" fill="none" stroke="#8fccc6" strokeWidth="2" />
      {/* ears */}
      <circle cx="30" cy="30" r="12" fill="#bfe3df" stroke="#8fccc6" strokeWidth="2" />
      <circle cx="90" cy="30" r="12" fill="#bfe3df" stroke="#8fccc6" strokeWidth="2" />
      <circle cx="30" cy="30" r="5" fill="#e8a26b" opacity="0.7" />
      <circle cx="90" cy="30" r="5" fill="#e8a26b" opacity="0.7" />
      {/* cheeks */}
      <circle cx="38" cy="72" r="7" fill="#f6c9a6" opacity="0.7" />
      <circle cx="82" cy="72" r="7" fill="#f6c9a6" opacity="0.7" />
      {/* eyes */}
      <circle cx="47" cy="60" r="5" fill="#2f4f4c" />
      <circle cx="73" cy="60" r="5" fill="#2f4f4c" />
      <circle cx="48.5" cy="58.5" r="1.6" fill="#fff" />
      <circle cx="74.5" cy="58.5" r="1.6" fill="#fff" />
      {/* mouth */}
      {mood === 'happy' ? (
        <path d="M50 74 Q60 84 70 74" fill="none" stroke="#2f4f4c" strokeWidth="3" strokeLinecap="round" />
      ) : mood === 'wave' ? (
        <ellipse cx="60" cy="77" rx="5" ry="6" fill="#2f4f4c" />
      ) : (
        <path d="M52 76 Q60 81 68 76" fill="none" stroke="#2f4f4c" strokeWidth="3" strokeLinecap="round" />
      )}
      {/* waving hand */}
      {mood === 'wave' && (
        <circle cx="103" cy="60" r="8" fill="#bfe3df" stroke="#8fccc6" strokeWidth="2" />
      )}
    </svg>
  )
}
