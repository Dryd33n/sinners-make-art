import { Table } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

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
  link_ovveride: text('link_ovveride').notNull().default('auto'), // "auto" or "/path/to/destination"
  order: integer('order').notNull(),
});




/* POSTS */
export const postsTable = pgTable("posts_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "posts_table_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  title: text().notNull(),
  description: text().notNull(),
  type: text().notNull(),
  content: text().notNull(),
  tag: text().notNull(),
  order: integer().notNull(),
  portfolio: boolean().default(false).notNull(),
});

export const socialLinks = pgTable("social_links", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "social_links_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	url: text().notNull(),
	name: text().notNull(),
});



export type insertNavTree = typeof navTreeTable.$inferInsert;
export type selectNavTree = typeof navTreeTable.$inferSelect;
