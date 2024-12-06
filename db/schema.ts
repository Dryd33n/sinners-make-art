import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/* HOME PAGE CONTENT */
export const homeTable = pgTable('home', {
  id : serial("id").primaryKey().notNull(),
  about_title: text('about_title').notNull(),
  about_text: text('about_text').notNull(),
});

/* IMAGES TO DISPLAY ON HOME PAGE IMAGE CAROUSEL */
const homeImageTable = pgTable("home_image", {
        id : serial("id").primaryKey().notNull(),
        img_url: text("img_url").notNull(),
    }
)

export { homeImageTable };

export type insertHomeTableContent = typeof homeTable.$inferInsert;
export type selectHomeTableContent = typeof homeTable.$inferSelect;