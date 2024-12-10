import { pgTable, serial, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const home = pgTable("home", {
	id: serial().primaryKey().notNull(),
	aboutTitle: text("about_title").notNull(),
	aboutText: text("about_text").notNull(),
	aboutImages: text("about_images").notNull(),
});
