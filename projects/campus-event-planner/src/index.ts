import 'dotenv/config'
import { EventPlanner } from './planner.js'
import { createInterface } from 'readline'

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q: string): Promise<string> =>
  new Promise((resolve) => rl.question(q, resolve))

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY not set in .env')
    process.exit(1)
  }

  const planner = new EventPlanner(apiKey)

  console.log('\nCampus Event Planner - Powered by Claude')
  console.log('=========================================\n')

  while (true) {
    console.log('What would you like to do?')
    console.log('1. Create a new event')
    console.log('2. Generate promo content for an event')
    console.log('3. Create email invitation')
    console.log('4. Exit\n')

    const choice = await ask('> ')

    if (choice === '4' || choice.toLowerCase() === 'exit') {
      console.log('\nGoodbye!')
      break
    }

    if (choice === '1') {
      const name = await ask('Event name: ')
      const type = await ask('Event type (workshop/hackathon/meetup/demo): ')
      const date = await ask('Date (YYYY-MM-DD): ')
      const duration = await ask('Duration (hours): ')
      const location = await ask('Location: ')

      console.log('\nGenerating event details...\n')
      const event = await planner.createEvent({
        name,
        type: type as 'workshop' | 'hackathon' | 'meetup' | 'demo',
        date,
        durationHours: parseInt(duration) || 2,
        location,
      })
      console.log(event)
    } else if (choice === '2') {
      const name = await ask('Event name: ')
      const description = await ask('Brief description: ')
      const platform = await ask('Platform (twitter/instagram/whatsapp): ')

      console.log('\nGenerating promo content...\n')
      const promo = await planner.generatePromo(name, description, platform)
      console.log(promo)
    } else if (choice === '3') {
      const name = await ask('Event name: ')
      const date = await ask('Date: ')
      const location = await ask('Location: ')
      const description = await ask('Brief description: ')

      console.log('\nGenerating email invitation...\n')
      const email = await planner.generateEmail(name, date, location, description)
      console.log(email)
    }

    console.log('\n')
  }

  rl.close()
}

main()
