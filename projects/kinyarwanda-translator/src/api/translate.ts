import Anthropic from '@anthropic-ai/sdk'
import type { Direction } from '../App'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function translate(
  text: string,
  direction: Direction,
  technical: boolean
): Promise<string> {
  const fromLang = direction === 'en-to-rw' ? 'English' : 'Kinyarwanda'
  const toLang = direction === 'en-to-rw' ? 'Kinyarwanda' : 'English'

  const technicalNote = technical
    ? `\nThis is technical/programming documentation. Preserve code blocks, variable names, and technical terms that don't have direct translations. Add translator notes in [brackets] for culturally specific adaptations.`
    : ''

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Translate the following text from ${fromLang} to ${toLang}. Return ONLY the translation, no explanations.${technicalNote}\n\nText to translate:\n${text}`,
      },
    ],
  })

  const block = message.content[0]
  if (block.type === 'text') {
    return block.text
  }

  throw new Error('Unexpected response format')
}
