/** A stage icon is an emoji, or a path to an image (starting with "/") drawn at the same emoji size. */
export function StageIcon({ icon }: { icon: string }) {
  if (!icon.startsWith('/')) return <>{icon}</>
  return <img src={icon} alt="" style={{ height: '1.2em', width: 'auto', verticalAlign: 'middle' }} />
}
