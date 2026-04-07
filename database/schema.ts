import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  birthdate: timestamp('birthdate', { withTimezone: true }),
  country: varchar('country', { length: 100 }),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const aiUsers = pgTable('ai_users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  passPhrase: varchar('pass_phrase', { length: 500 }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export type AiUser = typeof aiUsers.$inferSelect
export type NewAiUser = typeof aiUsers.$inferInsert

export const userFacts = pgTable('user_facts', {
  id: serial('id').primaryKey(),
  aiUserId: integer('ai_user_id')
    .notNull()
    .references(() => aiUsers.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  moralScore: integer('moral_score').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export type UserFact = typeof userFacts.$inferSelect
export type NewUserFact = typeof userFacts.$inferInsert
