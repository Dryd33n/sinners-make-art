import { Table } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

/* HOME PAGE CONTENT */
export const hometable = pgTable('hometable', {
  id : serial("id").primaryKey().notNull(),
  about_title: text('about_title').notNull(),
  about_text: text('about_text').notNull(),
  about_images: text('images').notNull(),
});

export type insertHomeTableContent = typeof hometable.$inferInsert;
export type selectHomeTableContent = typeof hometable.$inferSelect;




/* NAVIGATION TREE */
export const navTreeTable = pgTable('nav_tree', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  path: text('path').notNull(), // e.g., "1/2/3"
  order: integer('order').notNull(),
});

export type insertNavTree = typeof navTreeTable.$inferInsert;
export type selectNavTree = typeof navTreeTable.$inferSelect;
