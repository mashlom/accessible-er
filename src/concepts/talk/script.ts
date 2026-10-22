import { keyed } from '../../lib/keyed'
import type { RoniMood } from '../../components/Roni'
import { getStageIndex } from '../../data/journey'
import { procedures } from '../../data/procedures'
import { parentJourney, parentProcedure } from '../../data/parent'
import { parentPaths } from '../../data/parent/paths'
import supportI18n from '../../data/i18n/support.json'
import talkTexts from '../../data/parent/talk.json'
import { parentChannelLabel, parentLoadLabel, parentMapAreas } from '../../data/parent/map'
import i18nUi from '../../data/i18n/ui.json'
import homeJson from '../../data/parent/home.json'
import careI18n from '../../data/i18n/careCard.json'
import { distressTips, readySentences, staffRequests } from '../../data/support'
import { cardSections, isCardEmpty, type CardArrayField, type CareCard } from '../../data/careCard'
import type { Procedure } from '../../data/types'

type Lang = 'he' | 'en' | 'ru'

/** The same list in the chosen language, merged by position over the code's list (ids, emoji and values stay from the code) */
function inLang<T extends object>(src: T[], lang: Lang, bucket: Record<string, unknown>, key: string): T[] {
  const tr = ((bucket as Record<Lang, Record<string, unknown>>)[lang]?.[key] ?? []) as Partial<T>[]
  return src.map((item, i) => ({ ...item, ...(tr[i] ?? {}) }))
}
// the position of the 'ask for a break' tip in the support list
const PAUSE_TIP = distressTips.findIndex((tip) => tip.id === 'pause')

/** The ready sentences in the chosen language, for the buttons only */
const readySentencesIn = (lang: Lang): string[] =>
  (keyed((supportI18n as unknown as Record<Lang, { readySentences?: string[] }>)[lang], 'i18n/support')?.readySentences ?? [])

const distressTipsIn = (lang: Lang) => inLang(distressTips, lang, supportI18n, 'distressTips')
const staffRequestsIn = (lang: Lang) => inLang(staffRequests, lang, supportI18n, 'staffRequests')
// the section titles are translated; the options stay the Hebrew values that are saved on the card
/** The translated labels of one section's options, by position (the saved values stay Hebrew) */
function cardLabels(lang: Lang, n: number): string[] {
  const sec = cardSections[n]
  const tr = (keyed((careI18n as unknown as Record<Lang, { cardSections: { options: string[] }[] }>)[lang], 'i18n/careCard')?.cardSections ?? [])[n]
  return sec.options.map((o, i) => tr?.options?.[i] ?? o)
}

const cardSectionsIn = (lang: Lang) => cardSections.map((sec, i) => {
  const tr = (keyed((careI18n as unknown as Record<Lang, { cardSections: { title: string }[] }>)[lang], 'i18n/careCard')?.cardSections ?? [])[i]
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
  /** the options are saved in Hebrew (for the staff); `labels` are what the family reads */
  multi?: { field: CardArrayField; options: string[]; labels: string[] }
}

export interface Ctx {
  reasonId: string | null
  stageId: string | null
  card: CareCard
  lang: Lang
}

// the topics of the helper: the labels come from talk.json (topicNames) in the chosen language
const TOPIC_IDS: { emoji: string; go: string }[] = [
  { emoji: '💭', go: 'reason' },
  { emoji: '📍', go: 'where' },
  { emoji: '🎬', go: 'prep' },
  { emoji: '🪪', go: 'card' },
  { emoji: '🗺️', go: 'map' },
  { emoji: '💗', go: 'calm' },
  { emoji: '🙋', go: 'ask' },
  { emoji: '🏠', go: 'home' },
]
export const topicChoices = (lang: Lang): Choice[] =>
  TOPIC_IDS.map((t) => ({ ...t, label: talkText(lang).topicNames[t.go as keyof (typeof talkTexts.he)['topicNames']] }))

/** Every node offers a way back to the topics — a thread you cannot leave is a trap. */
// the label of the way back is shown by the page (its topics text), so the choice itself carries none
const BACK: Choice = { emoji: '↩️', label: '', go: 'topics', quiet: true }


function bullets(items: string[]): string {
  return items.map((i) => `· ${i}`).join('\n')
}

/** One block of the discharge texts, the same blocks as on the quest's celebration screen (src/data/i18n/ui.json) */
function dischargeBody(lang: Lang, i: number): string {
  const blocks = (keyed((i18nUi as unknown as Record<Lang, { celebrate: { discharge: { body: string }[] } }>)[lang], 'i18n/ui') ?? keyed((i18nUi as unknown as Record<'he', { celebrate: { discharge: { body: string }[] } }>).he, 'i18n/ui')).celebrate.discharge
  return blocks[i].body
}

/** The dialogue lines of this part of the talk, in the chosen language (src/data/parent/talk.json) */
// the words Roni shares with the ui and the care card: read from there, not copied into talk.json
const sharedWords = (lang: Lang) => {
  const ui = (i18nUi as unknown as Record<Lang, UiWords>)[lang]
  const home = (homeJson as unknown as Record<Lang, { reason: { title: string; optional: string } }>)[lang]
  const care = (careI18n as unknown as Record<Lang, { cardSections: { title: string }[] }>)[lang].cardSections
  return {
    calm: { watchBtn: ui.tiles.distract.desc },
    topicNames: { ask: ui.storyRequests.title, prep: ui.tiles.procedures.title, calm: ui.buttons.hardNow, reason: home.reason.title },
    buttons: { helpedLess: ui.storyFeedback.team.rating[1], helpedSome: ui.storyFeedback.team.rating[2], helpedMuch: ui.storyFeedback.team.rating[3] },
    card: { cardNextStep: ui.buttons.continue, questions: { communication: care[0].title, sensitivities: care[1].title, calming: care[2].title, escalators: care[3].title, hardMoments: care[4].title, pain: care[5].title, avoid: care[6].title } },
    prep: { feel: ui.procedurePage.feel },
    reason: { routeHeading: ui.labels.adult.expectedRoute, optional: home.reason.optional },
  }
}

type UiWords = {
  tiles: { distract: { desc: string }; procedures: { title: string } }
  storyRequests: { title: string }
  buttons: { hardNow: string; continue: string }
  storyFeedback: { team: { rating: Record<string, string> } }
  procedurePage: { feel: string }
  labels: { adult: { expectedRoute: string } }
}

export function talkText(lang: Lang) {
  const base = keyed(keyed((talkTexts as unknown as Record<Lang, typeof talkTexts.he>)[lang], 'parent/talk') ?? talkTexts.he, 'parent/talk')
  const s = sharedWords(lang)
  return {
    ...base,
    calm: { ...base.calm, ...s.calm },
    topicNames: { ...base.topicNames, ...s.topicNames },
    buttons: { ...base.buttons, ...s.buttons },
    card: { ...base.card, cardNextStep: s.card.cardNextStep, questions: { ...base.card.questions, ...s.card.questions } },
    prep: { ...base.prep, ...s.prep },
    reason: { ...base.reason, ...s.reason },
  }
}

const talkHome = (lang: Lang) => keyed((homeJson as unknown as Record<Lang, { reasonAsk: string }>)[lang], 'parent/home') ?? homeJson.he
const uiTiles = (lang: Lang) =>
  (keyed((i18nUi as unknown as Record<Lang, { tiles: Record<string, { title: string }> }>)[lang], 'i18n/ui') ?? i18nUi.he).tiles

const hebrewNote = (lang: Lang) => (i18nUi as unknown as Record<Lang, { careView: { hebrewNote: string } }>)[lang].careView.hebrewNote

function unknown(lang: Lang = 'he'): TalkNode {
  return {
    say: [{ text: talkText(lang).unknown, mood: 'curious' }],
    choices: topicChoices(lang),
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
          text: talkText(lang).stage.reassure,
          mood: 'hug',
        },
      ],
      choices: [
        { label: talkText(lang).stage.askHere, go: `stage:${id}:ask` },
        { emoji: '💗', label: talkText(lang).stage.hardNowBtn, go: 'calm' },
        BACK,
      ],
    }
  }

  if (tail === 'ask') {
    return {
      say: [
        { text: talkText(lang).stage.askIntro, mood: 'happy' },
        { text: bullets(stage.canAsk) },
        { text: talkText(lang).stage.askOk, mood: 'calm' },
      ],
      choices: [
        { label: talkText(lang).stage.askMore, go: 'ask' },
        next ? { label: talkText(lang).stage.after, go: `stage:${next.id}` } : BACK,
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
          ? talkText(lang).stage.waitShort.replace('{range}', stage.waitRange)
          : talkText(lang).stage.waitLong.replace('{range}', stage.waitRange),
    })
  }

  const choices: Choice[] = [
    { label: talkText(lang).stage.hard, go: `stage:${id}:hard` },
    { label: uiTiles(lang).requests.title, go: `stage:${id}:ask` },
  ]
  for (const pid of stage.procedureIds ?? []) {
    const p = parentProcedure(lang, pid)
    if (p) choices.push({ emoji: p.emoji, label: talkText(lang).prep.for.replace('{title}', p.title), go: `prep:${pid}` })
  }
  if (next) choices.push({ label: talkText(lang).stage.next, go: `stage:${next.id}` })
  choices.push(BACK)

  return { say, choices }
}

/* ------------------------------------------------------------------ */
/* Procedures                                                          */
/* ------------------------------------------------------------------ */

function prepNode(pid: string, rest: string[], lang: Lang): TalkNode | null {
  const p = parentProcedure(lang, pid)
  if (!p) return null

  if (rest[0] === 'feel') {
    return {
      say: [
        { text: p.feel, mood: 'curious' },
        { text: `${talkText(lang).prep.howPrepare} ${p.prepare}`, mood: 'calm' },
      ],
      choices: [
        { label: uiTiles(lang).requests.title, go: `prep:${pid}:ask` },
        BACK,
      ],
    }
  }

  if (rest[0] === 'ask') {
    return {
      say: [
        { text: talkText(lang).prep.askBefore.replace('{title}', p.title), mood: 'happy' },
        { text: bullets(p.adaptations) },
      ],
      choices: [
        { emoji: '🙋', label: talkText(lang).stage.askMore, go: 'ask' },
        BACK,
      ],
    }
  }

  // the procedure's opening card
  const choices: Choice[] = []
  choices.push({ label: talkText(lang).prep.feel, go: `prep:${pid}:feel` })
  choices.push({ label: uiTiles(lang).requests.title, go: `prep:${pid}:ask` })
  choices.push(BACK)

  return {
    say: [
      { text: `${p.title}`, mood: 'curious', art: p.emoji },
      { text: p.what },
      { text: talkText(lang).prep.whoDur.replace('{who}', p.who).replace('{duration}', p.duration) },
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
        choices: topicChoices(ctx.lang),
      }

    case 'topics':
      return {
        say: [{ text: talkText(ctx.lang).topics.ask, mood: 'curious' }],
        choices: topicChoices(ctx.lang),
      }

    /* ---------- reason ---------- */
    case 'reason':
      return {
        say: [
          { text: talkHome(ctx.lang).reasonAsk, mood: 'curious' },
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
          { emoji: '🎬', label: uiTiles(ctx.lang).procedures.title, go: 'prep' },
          { label: talkText(ctx.lang).reason.change, go: 'reason', quiet: true },
          BACK,
        ],
      }
    }

    /* ---------- journey ---------- */
    case 'where':
      return {
        say: [
          { text: talkText(ctx.lang).where.hint },
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
        ? procedures.map((p) => parentProcedure(ctx.lang, p.id)).filter((p): p is Procedure => !!p)
        : likelyIds.map((id) => parentProcedure(ctx.lang, id)).filter((p): p is Procedure => !!p)

      return {
        say: [
          {
            text: showAll
              ? talkText(ctx.lang).prep.whatAll
              : talkText(ctx.lang).prep.intro,
            mood: 'curious',
          },
        ],
        choices: [
          ...list.map((p) => ({ emoji: p.emoji, label: p.title, go: `prep:${p.id}` })),
          ...(showAll ? [] : [{ label: talkText(ctx.lang).buttons.allTests, go: 'prep:all' }]),
          BACK,
        ],
      }
    }

    /* ---------- adaptations card ---------- */
    case 'card': {
      // a card that is already filled (here or on another page) is shown, not offered to fill again
      if (rest.length === 0 && !isCardEmpty(ctx.card)) {
        return {
          say: [
            { text: talkText(ctx.lang).card.cardDone, mood: 'proud' },
            { text: talkText(ctx.lang).card.cardDoneShow },
            { text: hebrewNote(ctx.lang) },
          ],
          choices: [
            { emoji: '🪪', label: talkText(ctx.lang).card.cardShow, action: { kind: 'open', to: '/card/view' } },
            BACK,
          ],
        }
      }

      if (rest.length === 0) {
        return {
          say: [
            { text: talkText(ctx.lang).card.cardIntro, mood: 'curious' },
            {
              text: talkText(ctx.lang).card.cardPrivacy,
              mood: 'calm',
            },
            { text: hebrewNote(ctx.lang) },
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
          { text: `${section.emoji} ${talkText(ctx.lang).card.questions[section.key]}`, mood: 'curious' },
          { text: talkText(ctx.lang).card.cardPickMany },
        ],
        multi: { field: section.key, options: section.options, labels: cardLabels(ctx.lang, n) },
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
          { text: talkText(ctx.lang).map.heading, mood: 'curious' },
          { text: talkText(ctx.lang).map.body },
        ],
        choices: [
          ...parentMapAreas(ctx.lang).map((a) => ({ emoji: a.emoji, label: a.name, go: `area:${a.id}` })),
          BACK,
        ],
      }

    case 'area': {
      const area = parentMapAreas(ctx.lang).find((a) => a.id === rest[0])
      if (!area) return unknown(ctx.lang)
            return {
        say: [
          { text: `${area.name}`, mood: 'calm', art: area.emoji },
          { text: area.note },
          {
            text: `${talkText(ctx.lang).map.load.replace('{label}', parentLoadLabel(ctx.lang, area.load))}\n🔊 ${parentChannelLabel(ctx.lang, 'sound')} ${area.sensory.sound}/5 · 💡 ${parentChannelLabel(ctx.lang, 'light')} ${area.sensory.light}/5 · 👃 ${parentChannelLabel(ctx.lang, 'smell')} ${area.sensory.smell}/5 · 👥 ${parentChannelLabel(ctx.lang, 'people')} ${area.sensory.people}/5`,
          },
          ...(area.next ? [{ text: talkText(ctx.lang).map.next.replace('{next}', area.next) }] : []),
        ],
        choices: [
          { emoji: '🗺️', label: talkText(ctx.lang).buttons.otherPlace, go: 'map' },
          { emoji: '🙋', label: talkText(ctx.lang).buttons.quietPlace, go: 'ask' },
          BACK,
        ],
      }
    }

    /* ---------- distress ---------- */
    case 'calm':
      if (rest[0] === 'tips') {
        return {
          say: [{ text: talkText(ctx.lang).calm.tipsHint, mood: 'hug' }],
          choices: [
            ...distressTipsIn(ctx.lang).map((t, i) => ({ emoji: t.emoji, label: t.title, go: `tip:${i}` })),
            BACK,
          ],
        }
      }
      if (rest[0] === 'say') {
        return {
          say: [
            { text: talkText(ctx.lang).calm.sayHint, mood: 'calm' },
            { text: talkText(ctx.lang).calm.sayHint2 },
          ],
          choices: [
            // the button shows the parent's language; what is shown on the screen for the staff stays Hebrew
            ...readySentences.map((s, i) => ({
              label: readySentencesIn(ctx.lang)[i] ?? s,
              action: { kind: 'showBig', text: s } as Action,
            })),
            BACK,
          ],
        }
      }
      if (rest[0] === 'watch') {
        return {
          say: [
            { text: talkText(ctx.lang).calm.watchOne, mood: 'hug' },
            { art: '🌈', text: talkText(ctx.lang).calm.watchTwo },
            { art: '💧' },
            { art: '🌟', text: talkText(ctx.lang).calm.watchThree },
          ],
          choices: [
            { label: talkText(ctx.lang).calm.again, go: 'calm:watch' },
            { label: talkText(ctx.lang).calm.moreHelp, go: 'calm:tips' },
            BACK,
          ],
        }
      }
      return {
        say: [
          { text: talkText(ctx.lang).calm.hardNow1, mood: 'hug' },
          { text: talkText(ctx.lang).calm.hardNow2, mood: 'calm' },
          { text: talkText(ctx.lang).calm.hardNow3, mood: 'proud' },
          { text: talkText(ctx.lang).calm.question, mood: 'curious' },
        ],
        choices: [
          { emoji: '🫧', label: talkText(ctx.lang).calm.watchBtn, go: 'calm:watch' },
          { emoji: '💡', label: talkText(ctx.lang).calm.helpBtn, go: 'calm:tips' },
          { emoji: '🗣️', label: talkText(ctx.lang).calm.sayBtn, go: 'calm:say' },
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
          ...(isPause ? [{ emoji: '⏸️', label: talkText(ctx.lang).staffPause, action: { kind: 'showBig', text: talkText(ctx.lang).staffPauseBig } as Action }] : []),
          { label: talkText(ctx.lang).calm.moreHelpBtn, go: 'calm:tips' },
          // the break tip already has its own button for the staff
          ...(isPause ? [] : [{ emoji: '🗣️', label: talkText(ctx.lang).calm.howSayBtn, go: 'calm:say' }]),
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
              text: talkText(ctx.lang).ask.availability,
              mood: 'calm',
            },
          ],
          choices: [
            { label: talkText(ctx.lang).buttons.moreAsk, go: 'ask' },
            { emoji: '🗣️', label: talkText(ctx.lang).buttons.howAsk, go: 'calm:say' },
            BACK,
          ],
        }
      }
      return {
        say: [
          { text: talkText(ctx.lang).ask.askGeneral, mood: 'happy' },
          { text: talkText(ctx.lang).ask.askAbout },
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
            { text: dischargeBody(ctx.lang, 2), mood: 'sleepy' },
            { text: dischargeBody(ctx.lang, 4), mood: 'calm' },
          ],
          choices: [
            { emoji: '💬', label: talkText(ctx.lang).home.tellUs, go: 'bye' },
            BACK,
          ],
        }
      }
      return {
        say: [
          { text: dischargeBody(ctx.lang, 0), mood: 'calm' },
          { text: dischargeBody(ctx.lang, 1), mood: 'hug' },
          { text: dischargeBody(ctx.lang, 3) },
        ],
        choices: [
          { emoji: '🏠', label: talkText(ctx.lang).home.homeAfter, go: 'home:after' },
          BACK,
        ],
      }

    /* ---------- feedback ---------- */
    case 'bye':
      if (rest[0] === 'thanks') {
        return {
          say: [
            { text: talkText(ctx.lang).bye.thanks1, mood: 'cheer' },
            {
              text: talkText(ctx.lang).bye.thanks2,
            },
            { text: talkText(ctx.lang).bye.thanks3, mood: 'proud' },
          ],
          choices: [
            { label: talkText(ctx.lang).buttons.restart, action: { kind: 'restart' }, quiet: true },
            BACK,
          ],
        }
      }
      return {
        say: [
          { text: talkText(ctx.lang).bye.ask, mood: 'curious' },
          { text: talkText(ctx.lang).bye.askNote },
        ],
        choices: [
          { emoji: '😀', label: talkText(ctx.lang).buttons.helpedMuch, action: { kind: 'feedback', rating: 3 }, go: 'bye:thanks' },
          { emoji: '🙂', label: talkText(ctx.lang).buttons.helpedSome, action: { kind: 'feedback', rating: 2 }, go: 'bye:thanks' },
          { emoji: '😕', label: talkText(ctx.lang).buttons.helpedLess, action: { kind: 'feedback', rating: 1 }, go: 'bye:thanks' },
          BACK,
        ],
      }

    default:
      return unknown(ctx.lang)
  }
}
