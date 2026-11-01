/**
 * Mail to the mashlom team (mashlom.me@gmail.com). Sent through the same
 * mail API as the contact form on mashlom.me (mashlom-main, Contact.tsx):
 * the API delivers to the team's address, so the request carries only the
 * subject and the body. Nothing is sent unless the parent presses "send".
 */
export const TEAM_EMAIL = 'mashlom.me@gmail.com'

const MAIL_API = 'https://api.mashlom.me/api/mail/send'

/** The subject of every mail: "ביקור במיון, <date>, <topic>" — in Hebrew, as the team reads it */
export function mailSubject(topic: string, date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
  return `ביקור במיון, ${day}, ${topic}`
}

/** A mailto link to the team, for a message the parent sends from their own mail app */
export function mailtoTeam(topic: string, body: string): string {
  return `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(mailSubject(topic))}&body=${encodeURIComponent(body)}`
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Sends a plain-text message to the team. Rejects when the mail was not accepted. */
export async function sendToTeam(topic: string, text: string): Promise<void> {
  const html = `<div dir="rtl">${escapeHtml(text).replace(/\n/g, '<br>')}</div>`
  const response = await fetch(MAIL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject: mailSubject(topic), html }),
  })
  if (!response.ok) throw new Error(`mail not sent: ${response.status}`)
}
