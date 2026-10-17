import type { RoniMood } from '../../components/Roni'
import { getStageIndex } from '../../data/journey'
import { procedures } from '../../data/procedures'
import { parentJourney, parentProcedure } from '../../data/parent'
import { parentPaths } from '../../data/parent/paths'
import supportI18n from '../../data/i18n/support.json'
import talkTexts from '../../data/parent/talk.json'
import careI18n from '../../data/i18n/careCard.json'
import { mapAreas, loadLabels } from '../../data/map'
import { distressTips, readySentences, staffRequests } from '../../data/support'
import { cardSections, type CardArrayField, type CareCard } from '../../data/careCard'

type Lang = 'he' | 'en' | 'ru'

/** The same list in the chosen language, merged by position over the code's list (ids, emoji and values stay from the code) */
function inLang<T extends object>(src: T[], lang: Lang, bucket: Record<string, unknown>, key: string): T[] {
  const tr = ((bucket as Record<Lang, Record<string, unknown>>)[lang]?.[key] ?? []) as Partial<T>[]
  return src.map((item, i) => ({ ...item, ...(tr[i] ?? {}) }))
}
// the position of the 'ask for a break' tip in the support list
const PAUSE_TIP = distressTips.findIndex((tip) => tip.title === 'לבקש הפסקה')

const distressTipsIn = (lang: Lang) => inLang(distressTips, lang, supportI18n, 'distressTips')
const staffRequestsIn = (lang: Lang) => inLang(staffRequests, lang, supportI18n, 'staffRequests')
// the section titles are translated; the options stay the Hebrew values that are saved on the card
const cardSectionsIn = (lang: Lang) => cardSections.map((sec, i) => {
  const tr = ((careI18n as unknown as Record<Lang, { cardSections: { title: string }[] }>)[lang]?.cardSections ?? [])[i]
  return { ...sec, title: tr?.title ?? sec.title }
})

/**
 * The conversation engine of concept 3.
 *
 * There is no navigation tree here: the whole app is one thread, and a
 * "screen" is a node — what Roni says, and what the family can answer. Nodes
 * are resolved from the shared content in `src/data`, so this file holds the
 * dialogue shape, never the content itself.
 *
 * Node ids are strings so they can carry parameters:
 *   stage:triage          one journey stage
 *   prep:blood-test:v0:s2 procedure, story variant 0, step 2
 *   card:3                fourth section of the adaptations card
 */

export interface Say {
  text?: string
  mood?: RoniMood
  /** an emoji shown large and animated inside the bubble */
  art?: string
}

export type Action =
  | { kind: 'setReason'; id: string }
  | { kind: 'setStage'; id: string }
  | { kind: 'showBig'; text: string }
  | { kind: 'open'; to: string }
  | { kind: 'feedback'; rating: number }
  | { kind: 'restart' }

export interface Choice {
  label: string
  emoji?: string
  /** the node this answer leads to; omitted for answers that only act */
  go?: string
  action?: Action
  /** styled as the quiet way out rather than a step forward */
  quiet?: boolean
}

export interface TalkNode {
  say: Say[]
  choices: Choice[]
  /**
   * A section of the adaptations card, answered by toggling chips that stay
   * on screen — the one place a single answer isn't enough.
   */
  multi?: { field: CardArrayField; options: string[] }
}

export interface Ctx {
  reasonId: string | null
  stageId: string | null
  card: CareCard
  lang: Lang
}

const TOPICS: Choice[] = [
  { emoji: '💭', label: 'למה באנו היום', go: 'reason' },
  { emoji: '📍', label: 'איפה אנחנו בתהליך', go: 'where' },
  { emoji: '🎬', label: 'מה עומד לקרות', go: 'prep' },
  { emoji: '🪪', label: 'מה חשוב לדעת עליי', go: 'card' },
  { emoji: '🗺️', label: 'איפה אנחנו במיון', go: 'map' },
  { emoji: '💗', label: 'קשה לנו עכשיו', go: 'calm' },
  { emoji: '🙋', label: 'מה אפשר לבקש', go: 'ask' },
  { emoji: '🏠', label: 'מה יהיה בסוף', go: 'home' },
]

/** Every node offers a way back to the topics — a thread you cannot leave is a trap. */
const BACK: Choice = { emoji: '↩️', label: talkTexts.he.topics.back, go: 'topics', quiet: true }

export const topicChoices = TOPICS

function bullets(items: string[]): string {
  return items.map((i) => `· ${i}`).join('\n')
}

/** The dialogue lines of this part of the talk, in the chosen language (src/data/parent/talk.json) */
export function talkText(lang: Lang): typeof talkTexts.he {
  return (talkTexts as unknown as Record<Lang, typeof talkTexts.he>)[lang] ?? talkTexts.he
}

function unknown(lang: Lang = 'he'): TalkNode {
  return {
    say: [{ text: talkText(lang).unknown, mood: 'curious' }],
    choices: [...TOPICS],
  }
}

/* ------------------------------------------------------------------ */
/* Journey                                                             */
/* ------------------------------------------------------------------ */

function stageNode(id: string, tail: string | undefined, lang: Lang): TalkNode | null {
  const i = getStageIndex(id)
  if (i < 0) return null
  const journey = parentJourney(lang)
  const stage = journey[i]
  const next = journey[i + 1]

  if (tail === 'hard') {
    return {
      say: [
        { text: stage.challenge, mood: 'curious' },
        {
          text: 'אם זה קורה — זה בסדר גמור, וזה לא סימן שמשהו השתבש. יש דברים שעוזרים.',
          mood: 'hug',
        },
      ],
      choices: [
        { label: 'מה אפשר לבקש כאן?', go: `stage:${id}:ask` },
        { emoji: '💗', label: 'קשה לנו ממש עכשיו', go: 'calm' },
        BACK,
      ],
    }
  }

  if (tail === 'ask') {
    return {
      say: [
        { text: 'הנה מה שאפשר לבקש בשלב הזה:', mood: 'happy' },
        { text: bullets(stage.canAsk) },
        { text: 'מותר לבקש. הצוות רגיל לזה.', mood: 'calm' },
      ],
      choices: [
        { label: 'עוד דברים שאפשר לבקש', go: 'ask' },
        next ? { label: 'ומה אחרי זה?', go: `stage:${next.id}` } : BACK,
        BACK,
      ].filter((c, i, a) => a.indexOf(c) === i),
    }
  }

  const say: Say[] = [
    { text: `${stage.emoji} ${stage.title}`, mood: 'calm' },
    { text: stage.meaning, mood: 'calm' },
    { text: stage.whatHappens },
  ]
  if (stage.waitRange) {
    say.push({
      text:
        stage.waitKind === 'duration'
          ? `זה לוקח בערך ${stage.waitRange}. זה טווח בלבד.`
          : `ההמתנה כאן היא בערך ${stage.waitRange}. זה טווח בלבד — הצוות מחליט לפי המצב והעומס.`,
    })
  }

  const choices: Choice[] = [
    { label: 'מה עלול להיות קשה כאן?', go: `stage:${id}:hard` },
    { label: 'מה אפשר לבקש?', go: `stage:${id}:ask` },
  ]
  for (const pid of stage.procedureIds ?? []) {
    const p = parentProcedure(lang, pid)
    if (p) choices.push({ emoji: p.emoji, label: `להתכונן ל${p.title}`, go: `prep:${pid}` })
  }
  if (next) choices.push({ label: 'ומה השלב הבא?', go: `stage:${next.id}` })
  choices.push(BACK)

  return { say, choices }
}

/* ------------------------------------------------------------------ */
/* Procedures                                                          */
/* ------------------------------------------------------------------ */

function prepNode(pid: string, rest: string[], lang: Lang): TalkNode | null {
  const p = parentProcedure(lang, pid)
  if (!p) return null
  const variants = p.storyVariants

  if (rest[0] === 'feel') {
    return {
      say: [
        { text: p.feel, mood: 'curious' },
        { text: `איך אפשר להתכונן: ${p.prepare}`, mood: 'calm' },
      ],
      choices: [
        { label: 'מה אפשר לבקש?', go: `prep:${pid}:ask` },
        { label: 'בואו נראה איך זה הולך', go: `prep:${pid}:v0:s0` },
        BACK,
      ],
    }
  }

  if (rest[0] === 'ask') {
    return {
      say: [
        { text: `לפני ${p.title} אפשר לבקש:`, mood: 'happy' },
        { text: bullets(p.adaptations) },
      ],
      choices: [
        { label: 'בואו נראה איך זה הולך', go: `prep:${pid}:v0:s0` },
        { emoji: '🙋', label: 'עוד דברים שאפשר לבקש', go: 'ask' },
        BACK,
      ],
    }
  }

  // prep:<pid>:v<i>:s<n>  /  prep:<pid>:v<i>:done
  const vMatch = rest[0]?.match(/^v(\d+)$/)
  if (vMatch) {
    const vi = Number(vMatch[1])
    const steps = variants ? (variants[vi] ?? variants[0]).steps : p.story
    const stepMatch = rest[1]?.match(/^s(\d+)$/)

    if (rest[1] === 'done') {
      return {
        say: [
          { text: 'סיימנו את כל הסיפור! 🌟', mood: 'cheer' },
          { text: 'עכשיו כבר יודעים מה עומד לקרות. אני אהיה שם איתכם.', mood: 'proud' },
        ],
        choices: [
          { label: 'עוד פעם מההתחלה', go: `prep:${pid}:v${vi}:s0` },
          { label: 'מה אפשר לבקש?', go: `prep:${pid}:ask` },
          { emoji: '🎬', label: 'להתכונן למשהו אחר', go: 'prep' },
          BACK,
        ],
      }
    }

    if (stepMatch) {
      const n = Number(stepMatch[1])
      if (n >= steps.length) return null
      const last = n === steps.length - 1
      return {
        say: [
          {
            text: steps[n],
            mood: n === 0 ? 'curious' : last ? 'cheer' : 'calm',
            art: n === 0 ? p.emoji : undefined,
          },
        ],
        choices: [
          last
            ? { label: 'וזהו — סיימנו! 🌟', go: `prep:${pid}:v${vi}:done` }
            : { label: 'ואז? ←', go: `prep:${pid}:v${vi}:s${n + 1}` },
          ...(n > 0
            ? [{ label: '→ רגע, אחורה', go: `prep:${pid}:v${vi}:s${n - 1}`, quiet: true }]
            : []),
          { emoji: '💗', label: 'רגע — נעצור', go: 'calm', quiet: true },
        ],
      }
    }
  }

  // the procedure's opening card
  const choices: Choice[] = []
  if (variants && variants.length > 1) {
    for (const [i, v] of variants.entries()) {
      choices.push({ label: `לראות איך זה הולך — ${v.label}`, go: `prep:${pid}:v${i}:s0` })
    }
  } else {
    choices.push({ label: 'בואו נראה איך זה הולך, שלב אחרי שלב', go: `prep:${pid}:v0:s0` })
  }
  choices.push({ label: 'מה אני עשוי להרגיש?', go: `prep:${pid}:feel` })
  choices.push({ label: 'מה אפשר לבקש?', go: `prep:${pid}:ask` })
  choices.push(BACK)

  return {
    say: [
      { text: `${p.title}`, mood: 'curious', art: p.emoji },
      { text: p.what },
      { text: `מי עושה את זה: ${p.who}\nכמה זמן: ${p.duration}` },
    ],
    choices,
  }
}

/* ------------------------------------------------------------------ */
/* The resolver                                                        */
/* ------------------------------------------------------------------ */

export function resolveNode(id: string, ctx: Ctx): TalkNode {
  const [head, ...rest] = id.split(':')
  const path = ctx.reasonId ? parentPaths(ctx.lang).find((p) => p.id === ctx.reasonId) : undefined

  switch (head) {
    case 'start':
      return {
        say: [
          { text: talkText(ctx.lang).intro.hi, mood: 'wave' },
          { text: talkText(ctx.lang).intro.line1, mood: 'happy' },
          { text: talkText(ctx.lang).intro.line2, mood: 'curious' },
        ],
        choices: [...TOPICS],
      }

    case 'topics':
      return {
        say: [{ text: talkText(ctx.lang).topics.ask, mood: 'curious' }],
        choices: [...TOPICS],
      }

    /* ---------- reason ---------- */
    case 'reason':
      return {
        say: [
          { text: talkText(ctx.lang).reason.ask, mood: 'curious' },
          { text: talkText(ctx.lang).reason.hint },
        ],
        choices: [
          ...parentPaths(ctx.lang).map((p) => ({
            emoji: p.emoji,
            label: p.label,
            go: 'route',
            action: { kind: 'setReason', id: p.id } as Action,
          })),
          BACK,
        ],
      }

    case 'route': {
      if (!path) return resolveNode('reason', ctx)
      return {
        say: [
          { text: talkText(ctx.lang).reason.understood.replace('{label}', path.label), mood: 'calm', art: path.emoji },
          { text: path.blurb },
          {
            text:
              talkText(ctx.lang).reason.routeHeading + '\n' +
              path.route
                .map((s, i) => `${i + 1}. ${s.title}${s.optional ? talkText(ctx.lang).reason.optional : ''}`)
                .join('\n'),
          },
          {
            text: talkText(ctx.lang).reason.note,
            mood: 'calm',
          },
        ],
        choices: [
          { emoji: '📍', label: talkText(ctx.lang).reason.where, go: 'where' },
          { emoji: '🎬', label: talkText(ctx.lang).reason.prep, go: 'prep' },
          { label: talkText(ctx.lang).reason.change, go: 'reason', quiet: true },
          BACK,
        ],
      }
    }

    /* ---------- journey ---------- */
    case 'where':
      return {
        say: [
          { text: 'איפה אתם עכשיו?', mood: 'curious' },
          { text: 'סמנו את השלב, ואספר לכם מה קורה בו.' },
        ],
        choices: [
          ...parentJourney(ctx.lang).map((s) => ({
            emoji: s.emoji,
            label: s.title + (s.id === ctx.stageId ? ' ✓' : ''),
            go: `stage:${s.id}`,
            action: { kind: 'setStage', id: s.id } as Action,
          })),
          BACK,
        ],
      }

    case 'stage':
      return stageNode(rest[0], rest[1], ctx.lang) ?? unknown(ctx.lang)

    /* ---------- procedures ---------- */
    case 'prep': {
      if (rest.length > 0 && rest[0] !== 'all') {
        return prepNode(rest[0], rest.slice(1), ctx.lang) ?? unknown(ctx.lang)
      }

      const likelyIds = [
        ...new Set(
          (path?.route ?? []).map((s) => s.procedureId).filter((x): x is string => !!x),
        ),
      ]
      const showAll = rest[0] === 'all' || likelyIds.length === 0
      const list = showAll
        ? procedures.map((p) => parentProcedure(ctx.lang, p.id) ?? p)
        : likelyIds.map((id) => parentProcedure(ctx.lang, id)).filter((p): p is (typeof procedures)[number] => !!p)

      return {
        say: [
          {
            text: showAll
              ? 'על מה נכין את עצמנו?'
              : `לפי מה שסיפרתם לי, אלה הדברים שכנראה נפגוש היום. על מה נדבר?`,
            mood: 'curious',
          },
        ],
        choices: [
          ...list.map((p) => ({ emoji: p.emoji, label: p.title, go: `prep:${p.id}` })),
          ...(showAll ? [] : [{ label: 'להראות לי את כל הבדיקות', go: 'prep:all' }]),
          BACK,
        ],
      }
    }

    /* ---------- adaptations card ---------- */
    case 'card': {
      if (rest.length === 0) {
        return {
          say: [
            { text: talkText(ctx.lang).card.cardIntro, mood: 'curious' },
            {
              text: talkText(ctx.lang).card.cardPrivacy,
              mood: 'calm',
            },
            { text: talkText(ctx.lang).card.cardQuestions },
          ],
          choices: [
            { label: talkText(ctx.lang).card.cardStart, go: 'card:0' },
            { label: talkText(ctx.lang).card.cardNotNow, go: 'topics', quiet: true },
          ],
        }
      }

      if (rest[0] === 'done') {
        const filled = cardSectionsIn(ctx.lang).filter((s) => ctx.card[s.key].length > 0).length
        return {
          say: [
            { text: talkText(ctx.lang).card.cardDone, mood: 'proud' },
            {
              text: filled
                ? talkText(ctx.lang).card.cardDoneShow
                : talkText(ctx.lang).card.cardDoneEmpty,
            },
          ],
          choices: [
            {
              emoji: '🪪',
              label: talkText(ctx.lang).card.cardShow,
              action: { kind: 'open', to: '/card/view' },
            },
            { label: talkText(ctx.lang).card.cardFix, go: 'card:0', quiet: true },
            BACK,
          ],
        }
      }

      const n = Number(rest[0])
      const section = cardSectionsIn(ctx.lang)[n]
      if (!section) return unknown(ctx.lang)
      const last = n === cardSectionsIn(ctx.lang).length - 1
      return {
        say: [
          { text: `${section.emoji} ${section.title}`, mood: 'curious' },
          { text: talkText(ctx.lang).card.cardPickMany },
        ],
        multi: { field: section.key, options: section.options },
        choices: [
          {
            label: last ? talkText(ctx.lang).card.cardLastStep : talkText(ctx.lang).card.cardNextStep,
            go: last ? 'card:done' : `card:${n + 1}`,
          },
          { label: talkText(ctx.lang).card.cardSkipQ, go: last ? 'card:done' : `card:${n + 1}`, quiet: true },
        ],
      }
    }

    /* ---------- map ---------- */
    case 'map':
      return {
        say: [
          { text: 'איזה מקום במלר״ד מעניין אתכם?', mood: 'curious' },
          { text: 'אספר מה קורה שם, וכמה רועש או שקט בו.' },
        ],
        choices: [
          ...mapAreas.map((a) => ({ emoji: a.emoji, label: a.name, go: `area:${a.id}` })),
          BACK,
        ],
      }

    case 'area': {
      const area = mapAreas.find((a) => a.id === rest[0])
      if (!area) return unknown(ctx.lang)
      const load = loadLabels[area.load]
      return {
        say: [
          { text: `${area.name}`, mood: 'calm', art: area.emoji },
          { text: area.note },
          {
            text: `כמה עמוס שם: ${load.label}\n🔊 רעש ${area.sensory.sound}/5 · 💡 אור ${area.sensory.light}/5 · 👃 ריח ${area.sensory.smell}/5 · 👥 אנשים ${area.sensory.people}/5`,
          },
          ...(area.next ? [{ text: `מכאן ממשיכים אל: ${area.next}` }] : []),
        ],
        choices: [
          { emoji: '🗺️', label: 'מקום אחר', go: 'map' },
          { emoji: '🙋', label: 'אפשר לבקש מקום שקט?', go: 'ask' },
          BACK,
        ],
      }
    }

    /* ---------- distress ---------- */
    case 'calm':
      if (rest[0] === 'tips') {
        return {
          say: [{ text: 'על מה נדבר? כל אחד מאלה עוזר.', mood: 'hug' }],
          choices: [
            ...distressTipsIn(ctx.lang).map((t, i) => ({ emoji: t.emoji, label: t.title, go: `tip:${i}` })),
            BACK,
          ],
        }
      }
      if (rest[0] === 'say') {
        return {
          say: [
            { text: 'קשה לדבר עכשיו? בחרו משפט, ואציג אותו בגדול על המסך.', mood: 'calm' },
            { text: 'ככה אפשר פשוט להראות אותו לצוות, בלי להסביר.' },
          ],
          choices: [
            ...readySentences.map((s) => ({
              label: s,
              action: { kind: 'showBig', text: s } as Action,
            })),
            BACK,
          ],
        }
      }
      if (rest[0] === 'watch') {
        return {
          say: [
            { text: 'אפשר להסתכל לכאן במקום על היד. אני נשאר איתכם.', mood: 'hug' },
            { art: '🌈', text: 'תסתכלו על הקשת… היא לא הולכת לשום מקום, וגם אני לא.' },
            { art: '💧' },
            { art: '🌟', text: 'אפשר גם לספור איתי לאט עד עשר. אחת… שתיים… שלוש…' },
          ],
          choices: [
            { label: 'עוד פעם', go: 'calm:watch' },
            { label: 'מה עוד עוזר?', go: 'calm:tips' },
            BACK,
          ],
        }
      }
      return {
        say: [
          { text: 'קשה עכשיו? זה בסדר גמור. אני כאן.', mood: 'hug' },
          { text: 'קודם כל — ננשום יחד. פנימה… והחוצה… עוד פעם, לאט.', mood: 'calm' },
          { text: 'אתם עושים עבודה נהדרת. באמת.', mood: 'proud' },
        ],
        choices: [
          { emoji: '🫧', label: 'משהו רגוע להסתכל עליו', go: 'calm:watch' },
          { emoji: '💡', label: 'מה עוזר עכשיו?', go: 'calm:tips' },
          { emoji: '🗣️', label: 'קשה לי לדבר עם הצוות', go: 'calm:say' },
          BACK,
        ],
      }

    case 'tip': {
      const tip = distressTipsIn(ctx.lang)[Number(rest[0])]
      if (!tip) return unknown(ctx.lang)
      // the break tip also offers the phrase for the staff, shown big in Hebrew on the screen
      const isPause = Number(rest[0]) === PAUSE_TIP
      return {
        say: [
          { text: tip.title, mood: 'hug', art: tip.emoji },
          { text: tip.body },
        ],
        choices: [
          ...(isPause ? [{ emoji: '⏸️', label: talkText(ctx.lang).staffPause, action: { kind: 'showBig', text: 'אנחנו צריכים דקה' } as Action }] : []),
          { label: 'עוד משהו שעוזר', go: 'calm:tips' },
          { emoji: '🗣️', label: 'איך אומרים את זה לצוות?', go: 'calm:say' },
          BACK,
        ],
      }
    }

    /* ---------- requests ---------- */
    case 'ask': {
      if (rest.length) {
        const r = staffRequestsIn(ctx.lang)[Number(rest[0])]
        if (!r) return unknown(ctx.lang)
        return {
          say: [
            { text: r.title, mood: 'happy', art: r.emoji },
            { text: r.detail },
            {
              text: 'הזמינות תלויה במצב, בציוד ובעומס באותו רגע. גם כשלא מתאפשר — שווה לשאול.',
              mood: 'calm',
            },
          ],
          choices: [
            { label: 'מה עוד אפשר לבקש?', go: 'ask' },
            { emoji: '🗣️', label: 'איך מבקשים את זה?', go: 'calm:say' },
            BACK,
          ],
        }
      }
      return {
        say: [
          { text: 'מותר לבקש! הצוות רגיל לזה, וזה בסדר גמור.', mood: 'happy' },
          { text: 'על מה תרצו לשמוע?' },
        ],
        choices: [
          ...staffRequestsIn(ctx.lang).map((r, i) => ({ emoji: r.emoji, label: r.title, go: `ask:${i}` })),
          BACK,
        ],
      }
    }

    /* ---------- going home ---------- */
    case 'home':
      if (rest[0] === 'after') {
        return {
          say: [
            {
              text: 'בבית אולי יהיה צורך בזמן, בשקט ובחזרה הדרגתית לשגרה.',
              mood: 'sleepy',
            },
            {
              text: 'לפעמים התגובה למה שעברנו מגיעה רק אחר כך — וגם זה טבעי לגמרי.',
            },
            {
              text: 'וחשוב: להמשיך מעקב אצל רופא/ת הילדים בקהילה לפי ההמלצות. הם מכירים אתכם.',
              mood: 'calm',
            },
          ],
          choices: [
            { emoji: '💬', label: 'לספר לכם איך היה לנו', go: 'bye' },
            BACK,
          ],
        }
      }
      return {
        say: [
          {
            text: 'בסוף הביקור הצוות מסכם איתכם, נותן הנחיות להמשך, ולפעמים מרשם.',
            mood: 'calm',
          },
          {
            text: 'גם היציאה הביתה היא מעבר. אחרי יום ארוך זה יכול להרגיש שינוי גדול — אפשר לצאת לאט.',
            mood: 'hug',
          },
          {
            text: 'לפעמים צריך בבית ציוד קטן — למשל כיסוי אטום לגבס. הצוות יסביר מה ואיפה.',
          },
        ],
        choices: [
          { emoji: '🏠', label: 'ומה יהיה בבית?', go: 'home:after' },
          BACK,
        ],
      }

    /* ---------- feedback ---------- */
    case 'bye':
      if (rest[0] === 'thanks') {
        return {
          say: [
            { text: 'תודה רבה! זה עוזר לנו לשפר את הכלי למשפחות אחרות.', mood: 'cheer' },
            {
              text: 'אם נפתחה אצלכם אפליקציית מייל עם הודעה מוכנה — נשאר רק לשלוח אותה.',
            },
            { text: 'היה לי טוב איתכם היום. שיהיה רק טוב 💛', mood: 'proud' },
          ],
          choices: [
            { label: 'להתחיל שיחה מחדש', action: { kind: 'restart' }, quiet: true },
            BACK,
          ],
        }
      }
      return {
        say: [
          { text: 'איך היה לכם היום?', mood: 'curious' },
          { text: 'שאלה אחת קצרה, בלי שם ובלי פרטים מזהים.' },
        ],
        choices: [
          { emoji: '😀', label: 'עזר מאוד', action: { kind: 'feedback', rating: 3 }, go: 'bye:thanks' },
          { emoji: '🙂', label: 'עזר קצת', action: { kind: 'feedback', rating: 2 }, go: 'bye:thanks' },
          { emoji: '😕', label: 'פחות עזר', action: { kind: 'feedback', rating: 1 }, go: 'bye:thanks' },
          BACK,
        ],
      }

    default:
      return unknown(ctx.lang)
  }
}
