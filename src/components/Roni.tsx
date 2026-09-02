import styles from './Roni.module.css'

export type RoniMood =
  | 'calm'
  | 'happy'
  | 'wave'
  | 'cheer'
  | 'hug'
  | 'sleepy'
  | 'curious'
  | 'proud'

interface RoniProps {
  size?: number
  mood?: RoniMood
  /** gentle up-and-down float; off by default so it can be used inline */
  float?: boolean
  /** plays a one-off bounce whenever this number changes */
  bounceKey?: number
  className?: string
  /** decorative use — the surrounding text already says what Roni does */
  decorative?: boolean
}

const moodLabel: Record<RoniMood, string> = {
  calm: 'רוני מחייך חיוך רגוע',
  happy: 'רוני שמח',
  wave: 'רוני מנופף לשלום',
  cheer: 'רוני מריע בשתי הידיים',
  hug: 'רוני פורש ידיים לחיבוק',
  sleepy: 'רוני נח בעיניים עצומות',
  curious: 'רוני סקרן',
  proud: 'רוני גאה',
}

/**
 * רוני — the companion character of the "story" concept.
 *
 * Deliberately much more expressive than the calm concept's mascot: a big
 * rounded creature with a scarf, arms and feet, eight moods, blinking and
 * an optional float. Children can tap him (see RoniCompanion), which is
 * where the `bounceKey` prop comes in — a small dose of agency, per the
 * feedback asking that the avatar be something the child can act on.
 */
export function Roni({
  size = 120,
  mood = 'calm',
  float = false,
  bounceKey = 0,
  className,
  decorative = false,
}: RoniProps) {
  const armsUp = mood === 'cheer'
  const waving = mood === 'wave'
  const hugging = mood === 'hug'

  return (
    <svg
      key={bounceKey}
      className={[
        styles.roni,
        float ? styles.float : '',
        bounceKey ? styles.bounce : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : moodLabel[mood]}
    >
      {/* ground shadow */}
      <ellipse cx="100" cy="188" rx="52" ry="8" fill="#2f4858" opacity="0.10" />

      {/* feet */}
      <ellipse cx="78" cy="180" rx="17" ry="11" fill="#5cbfb4" />
      <ellipse cx="122" cy="180" rx="17" ry="11" fill="#5cbfb4" />

      {/* arms */}
      {hugging ? (
        <>
          <ellipse cx="60" cy="160" rx="12" ry="21" fill="#5cbfb4" transform="rotate(52 60 160)" />
          <ellipse cx="140" cy="160" rx="12" ry="21" fill="#5cbfb4" transform="rotate(-52 140 160)" />
        </>
      ) : armsUp ? (
        <>
          <ellipse cx="44" cy="104" rx="12" ry="23" fill="#5cbfb4" transform="rotate(38 44 104)" />
          <ellipse cx="156" cy="104" rx="12" ry="23" fill="#5cbfb4" transform="rotate(-38 156 104)" />
        </>
      ) : (
        <>
          <ellipse cx="52" cy="150" rx="12" ry="21" fill="#5cbfb4" transform="rotate(18 52 150)" />
          {waving ? (
            <g className={styles.waveArm}>
              <ellipse
                cx="156"
                cy="106"
                rx="12"
                ry="23"
                fill="#5cbfb4"
                transform="rotate(-38 156 106)"
              />
            </g>
          ) : (
            <ellipse
              cx="148"
              cy="150"
              rx="12"
              ry="21"
              fill="#5cbfb4"
              transform="rotate(-18 148 150)"
            />
          )}
        </>
      )}

      {/* body + belly */}
      <ellipse cx="100" cy="148" rx="46" ry="40" fill="#7ecfc6" />
      <ellipse cx="100" cy="155" rx="28" ry="26" fill="#d9f3ef" />

      {/* scarf — the warm accent that makes him "someone", not a shape */}
      <path
        d="M62 122 Q100 140 138 122 L140 134 Q100 152 60 134 Z"
        fill="#ff8a75"
      />
      <path d="M132 132 q14 6 10 24 q-10 2 -16 -4 z" fill="#f4705d" />

      {/* ears */}
      <circle cx="58" cy="50" r="19" fill="#7ecfc6" />
      <circle cx="142" cy="50" r="19" fill="#7ecfc6" />
      <circle cx="58" cy="50" r="9" fill="#ffb3a7" />
      <circle cx="142" cy="50" r="9" fill="#ffb3a7" />

      {/* head */}
      <circle cx="100" cy="90" r="52" fill="#7ecfc6" />

      {/* cheeks */}
      <ellipse cx="70" cy="104" rx="12" ry="9" fill="#ffb3a7" opacity="0.85" />
      <ellipse cx="130" cy="104" rx="12" ry="9" fill="#ffb3a7" opacity="0.85" />

      {/* eyebrows (curious only) */}
      {mood === 'curious' && (
        <>
          <path d="M70 68 q10 -7 20 -2" stroke="#2f4858" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M110 66 q10 -5 20 2" stroke="#2f4858" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* eyes */}
      {mood === 'sleepy' ? (
        <>
          <path d="M72 88 q10 9 20 0" stroke="#2f4858" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M108 88 q10 9 20 0" stroke="#2f4858" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'cheer' || mood === 'proud' ? (
        <>
          <path d="M72 90 q10 -11 20 0" stroke="#2f4858" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M108 90 q10 -11 20 0" stroke="#2f4858" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <g className={styles.eyes}>
          <ellipse cx="82" cy="87" rx="7.5" ry="8.5" fill="#2f4858" />
          <ellipse cx="118" cy="87" rx="7.5" ry="8.5" fill="#2f4858" />
          <circle cx="84.5" cy="84" r="2.6" fill="#fff" />
          <circle cx="120.5" cy="84" r="2.6" fill="#fff" />
        </g>
      )}

      {/* mouth */}
      {mood === 'cheer' || mood === 'wave' ? (
        <path d="M86 106 q14 18 28 0 q-14 8 -28 0 z" fill="#2f4858" />
      ) : mood === 'curious' ? (
        <ellipse cx="100" cy="112" rx="6" ry="7" fill="#2f4858" />
      ) : mood === 'sleepy' ? (
        <path d="M94 112 q6 5 12 0" stroke="#2f4858" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : mood === 'happy' || mood === 'proud' || mood === 'hug' ? (
        <path d="M86 106 q14 14 28 0" stroke="#2f4858" strokeWidth="5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M89 108 q11 8 22 0" stroke="#2f4858" strokeWidth="5" fill="none" strokeLinecap="round" />
      )}

      {/* mood extras */}
      {mood === 'cheer' && (
        <g fill="#ffd166">
          <path d="M32 60 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z" />
          <path d="M170 46 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" />
        </g>
      )}
      {mood === 'proud' && (
        <path
          d="M100 20 l5 11 12 2 -9 9 2 12 -10 -6 -10 6 2 -12 -9 -9 12 -2 z"
          fill="#ffd166"
        />
      )}
      {mood === 'sleepy' && (
        <g fill="#8fa3b0" fontFamily="inherit" fontWeight="700">
          <text x="152" y="46" fontSize="20">z</text>
          <text x="170" y="30" fontSize="14">z</text>
        </g>
      )}
    </svg>
  )
}
