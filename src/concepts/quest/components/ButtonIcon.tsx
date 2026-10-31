import css from '../quest.module.css'

export type ButtonIconKind = 'home' | 'hospital' | 'shop' | 'colouring'

/** The texts carry an emoji (kept for the screens without drawn icons): where a drawn icon stands for it, it goes */
export function withoutEmoji(text: string): string {
  return text.replace(/^\p{Extended_Pictographic}\uFE0F?\s*|\s*\p{Extended_Pictographic}\uFE0F?$/gu, '')
}

/**
 * A drawn icon in a white circle before a button's words, so it shows on a coloured button: Shevi's house (going
 * home), the red Star of David of Magen David Adom (staying in the hospital), a shopping bag (the shop), a colouring
 * sheet with a pencil (the shop's PDF).
 */
export function ButtonIcon({ kind }: { kind: ButtonIconKind }) {
  return (
    <span className={css.answerIcon} aria-hidden>
      {kind === 'home' && (
        <svg viewBox="0 0 24 24" className={css.answerIconLine}>
          <path d="M4 11l8-7 8 7M6 10v9h4v-5h4v5h4v-9" />
        </svg>
      )}
      {kind === 'hospital' && (
        <svg viewBox="0 0 24 24" className={css.answerIconStar}>
          <path d="M12 2.5l8.2 14.2H3.8z M12 21.5L3.8 7.3h16.4z" />
        </svg>
      )}
      {kind === 'shop' && (
        <svg viewBox="0 0 24 24" className={css.answerIconLine}>
          <path d="M5 8h14l-1 12H6z M9 8V6.5a3 3 0 0 1 6 0V8" />
        </svg>
      )}
      {kind === 'colouring' && (
        <svg viewBox="0 0 24 24" className={css.answerIconLine}>
          <path d="M6 3h8l4 4v14H6z M14 3v4h4 M9 17l1-3 5-5 2 2-5 5z" />
        </svg>
      )}
    </span>
  )
}
