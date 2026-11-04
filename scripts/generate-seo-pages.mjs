import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const base = await readFile(join(dist, 'index.html'), 'utf8')

const pages = [
  {
    path: '/yonalishlar-2026/',
    title: '2026-yil OTM kirish ballari va yo‘nalishlar — ME’ROJ Mandat',
    description: '2026-yil qabul ma’lumotlari: oliygohlar, ta’lim yo‘nalishlari, grant va kontrakt ballari. Yo‘nalishlarni qidirib, ma’lumotlarni solishtiring.',
    heading: '2026-yil OTM kirish ballari va yo‘nalishlar',
    intro: 'Oliy ta’lim muassasalari va yo‘nalishlar bo‘yicha 2026-yil qabul ballarini qidiring. Grant va kontrakt ko‘rsatkichlarini ta’lim shakli, tili va hudud bo‘yicha ko‘rib chiqing.',
  },
  {
    path: '/ball-hisoblash/',
    title: 'OTM kirish ballini hisoblash va mos yo‘nalishlar — ME’ROJ Mandat',
    description: 'Fanlaringiz va test ballingizni kiriting. ME’ROJ Mandat yordamida grant yoki kontrakt bo‘yicha mos ta’lim yo‘nalishlarini aniqlang.',
    heading: 'Kirish ballingizga mos OTM yo‘nalishlarini toping',
    intro: 'Fanlaringiz va test natijangizni kiriting. ME’ROJ Mandat mos ta’lim yo‘nalishlarini hamda o‘tgan yillar ballari asosidagi grant va kontrakt imkoniyatlarini ko‘rsatadi.',
  },
  {
    path: '/fanlar-majmuasi/',
    title: 'OTM yo‘nalishlari va fanlar majmuasi — ME’ROJ Mandat',
    description: 'Oliy ta’lim yo‘nalishlariga mos fanlar majmuasini qidiring. O‘tgan yillardagi qabul ma’lumotlarini ME’ROJ Mandat’da ko‘ring.',
    heading: 'OTM yo‘nalishlari uchun fanlar majmuasi',
    intro: 'Ta’lim yo‘nalishiga mos fanlarni tanlang va oliygohlar bo‘yicha qabul ma’lumotlarini o‘rganing. Fanlar majmuasi hamda tarixiy ballar 2023–2025-yillar kesimida berilgan.',
  },
]

function setMeta(html, attribute, value, replacement) {
  const tagPattern = new RegExp(`<meta ${attribute}="${value}"[^>]*>`, 'i')
  return html.replace(tagPattern, replacement)
}

for (const page of pages) {
  const canonical = `https://mandat.meroj.uz${page.path}`
  let html = base
    .replace(/<title>.*?<\/title>/s, `<title>${page.title}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)

  html = setMeta(html, 'name', 'description', `<meta name="description" content="${page.description}" />`)
  html = setMeta(html, 'property', 'og:url', `<meta property="og:url" content="${canonical}" />`)
  html = setMeta(html, 'property', 'og:title', `<meta property="og:title" content="${page.title}" />`)
  html = setMeta(html, 'property', 'og:description', `<meta property="og:description" content="${page.description}" />`)
  html = setMeta(html, 'name', 'twitter:title', `<meta name="twitter:title" content="${page.title}" />`)
  html = setMeta(html, 'name', 'twitter:description', `<meta name="twitter:description" content="${page.description}" />`)
  html = html.replace(
    /"@type": "WebPage",[\s\S]*?"inLanguage": "uz"/,
    `"@type": "WebPage",
            "@id": "${canonical}#webpage",
            "url": "${canonical}",
            "name": "${page.title}",
            "description": "${page.description}",
            "isPartOf": { "@id": "https://mandat.meroj.uz/#website" },
            "author": { "@id": "https://mandat.meroj.uz/#author" },
            "inLanguage": "uz"`,
  )
  html = html.replace(
    '<div id="root">',
    `<div id="root"><main><h1>${page.heading}</h1><p>${page.intro}</p><nav aria-label="ME’ROJ Mandat bo‘limlari"><a href="/">Bosh sahifa</a> · <a href="/yonalishlar-2026/">2026-yil qabul ballari</a> · <a href="/ball-hisoblash/">Kirish ballini hisoblash</a> · <a href="/fanlar-majmuasi/">Fanlar majmuasi</a></nav></main>`,
  )

  const output = join(dist, page.path.slice(1, -1), 'index.html')
  await mkdir(join(dist, page.path.slice(1, -1)), { recursive: true })
  await writeFile(output, html)
}

