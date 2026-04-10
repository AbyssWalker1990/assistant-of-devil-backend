import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  birthdate: timestamp({ withTimezone: true }),
  country: varchar({ length: 100 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const aiUsers = pgTable('ai_users', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  passPhrase: varchar({ length: 500 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
})

export type AiUser = typeof aiUsers.$inferSelect
export type NewAiUser = typeof aiUsers.$inferInsert

export const userFacts = pgTable('user_facts', {
  id: serial().primaryKey(),
  aiUserId: integer()
    .notNull()
    .references(() => aiUsers.id, { onDelete: 'cascade' }),
  content: text().notNull(),
  moralScore: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
})

export type UserFact = typeof userFacts.$inferSelect
export type NewUserFact = typeof userFacts.$inferInsert
