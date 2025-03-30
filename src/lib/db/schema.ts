import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user']);

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', { length: 255 }).notNull(), //pointing to clerk user id
  fileKey: text('file_key').notNull(), //name of file retreived from s3
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .references(() => chats.id)
    .notNull(), //pointing to chat id
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role: userSystemEnum('role').notNull(),
});
