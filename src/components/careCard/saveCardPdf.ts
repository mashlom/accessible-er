/**
 * Saves the card as a PDF file on the device, without the print window.
 * The card is drawn by the browser (so the Hebrew and the emoji come out as on
 * screen), taken as a picture and put on an A4 page. Nothing leaves the device.
 * The libraries load only when the parent asks for the file.
 */
export async function saveCardPdf(node: HTMLElement, fileName: string) {
  const [{ toJpeg }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')])
  await document.fonts.ready
  const jpeg = await toJpeg(node, { pixelRatio: 2, quality: 0.92, backgroundColor: '#fff', fontEmbedCSS: await pageFontsCss() })

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  // the paper is one A4 width; a long card is shrunk to stay on one page
  const ratio = node.offsetHeight / node.offsetWidth
  const w = Math.min(pageW, pageH / ratio)
  doc.addImage(jpeg, 'JPEG', (pageW - w) / 2, 0, w, w * ratio)
  doc.save(`${fileName}.pdf`)
}

/**
 * The page's web font (Assistant, from Google Fonts) with its files inlined:
 * the browser does not let the picture read a stylesheet from another site,
 * and without it the card would come out in a fallback font.
 */
export async function pageFontsCss(): Promise<string> {
  const link = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"][href*="fonts.googleapis.com"]')
  if (!link) return ''
  try {
    const css = await (await fetch(link.href)).text()
    const urls = [...new Set(css.match(/https:\/\/[^)'"]+/g) ?? [])]
    const inlined = await Promise.all(urls.map(async (url) => [url, await asDataUrl(url)] as const))
    return inlined.reduce((out, [url, data]) => out.split(url).join(data), css)
  } catch {
    return ''
  }
}

async function asDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
