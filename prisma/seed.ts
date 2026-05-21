import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 12)

  await prisma.user.upsert({
    where: { email: 'demo@seopilot.ai' },
    update: {},
    create: {
      email: 'demo@seopilot.ai',
      password: hashedPassword,
      name: 'Demo User',
      onboardingComplete: false,
    },
  })

  console.log('Seed completed: demo@seopilot.ai / demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
