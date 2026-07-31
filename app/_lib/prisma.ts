import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

// Este código garante que a conecção com o
// Banco de dados só seja feita uma uníca vez

const globalForPrisma = globalThis as unknown as {
  cachedPrisma?: PrismaClient | undefined
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to initialize PrismaClient")
  }

  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  })

  return new PrismaClient({ adapter })
}

let db: PrismaClient

if (process.env.NODE_ENV === "production") {
  db = createPrismaClient()
} else {
  if (!globalForPrisma.cachedPrisma) {
    globalForPrisma.cachedPrisma = createPrismaClient()
  }
  db = globalForPrisma.cachedPrisma
}

export { db }
