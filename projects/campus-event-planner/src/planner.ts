import Anthropic from '@anthropic-ai/sdk'

interface EventInput {
  name: string
  type: 'workshop' | 'hackathon' | 'meetup' | 'demo'
  date: string
  durationHours: number
  location: string
}

export class EventPlanner {
  private client: Anthropic

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey })
  }

  async createEvent(input: EventInput): Promise<string> {
    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are an event planner for the Claude Builder Club at the University of Rwanda.

Create a detailed event plan for:
- Name: ${input.name}
- Type: ${input.type}
- Date: ${input.date}
- Duration: ${input.durationHours} hours
- Location: ${input.location}

Include:
1. A polished event title
2. An engaging description (2-3 paragraphs)
3. A suggested agenda/schedule
4. What attendees should bring
5. Expected outcomes

Keep the tone professional but welcoming for university students.`,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  }

  async generatePromo(name: string, description: string, platform: string): Promise<string> {
    const constraints: Record<string, string> = {
      twitter: 'Keep it under 280 characters. Use relevant hashtags.',
      instagram: 'Write a caption with emojis and relevant hashtags. Include a call to action.',
      whatsapp: 'Write a concise message suitable for a WhatsApp group. Include key details and a link placeholder.',
    }

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Create a ${platform} post for this event:
Event: ${name}
Description: ${description}
Club: Claude Builder Club - University of Rwanda

${constraints[platform] || 'Write an engaging social media post.'}`,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  }

  async generateEmail(
    name: string,
    date: string,
    location: string,
    description: string
  ): Promise<string> {
    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Write a professional email invitation for a university club event:

Event: ${name}
Date: ${date}
Location: ${location}
Description: ${description}
Organizer: Claude Builder Club, University of Rwanda

Include a subject line, greeting, event details, RSVP call-to-action, and a friendly closing. Keep it concise.`,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  }
}
