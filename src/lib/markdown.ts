import { numberSections, type Block, type PlanDocument } from '../templates'

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim() || ' '
const inline = (s: string) => s.replace(/\r?\n+/g, ' ').trim()

function blockToMd(block: Block): string {
  const label = block.label ? `**${block.label}**\n\n` : ''
  switch (block.kind) {
    case 'text':
      return label + block.text.trim()
    case 'list':
      return label + block.items.map((i) => `- ${inline(i)}`).join('\n')
    case 'table': {
      const head = `| ${block.headers.map(cell).join(' | ')} |`
      const sep = `| ${block.headers.map(() => '---').join(' | ')} |`
      const rows = block.rows.map((r) => `| ${r.map(cell).join(' | ')} |`)
      return label + [head, sep, ...rows].join('\n')
    }
  }
}

export function toMarkdown(doc: PlanDocument): string {
  const out: string[] = [`# ${doc.title}`]

  if (doc.meta.length) {
    out.push(doc.meta.map((m) => `**${m.label}:** ${inline(m.value)}`).join('  \n'))
  }

  for (const { section, number } of numberSections(doc.sections)) {
    const hashes = section.level === 1 ? '##' : '###'
    out.push(`${hashes} ${number}. ${section.title}`)
    if (section.container) continue
    out.push(
      section.blocks.length ? section.blocks.map(blockToMd).join('\n\n') : `_${doc.pending}_`,
    )
  }

  out.push('---', `_${doc.footer}_`)
  return out.join('\n\n') + '\n'
}
