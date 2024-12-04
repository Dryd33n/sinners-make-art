
import {  text, serial, pgTable, timestamp } from "drizzle-orm/pg-core";

export const homeTable = pgTable("home", {
        id: serial("id").primaryKey().notNull(),
        about_text: text("content").notNull()
    }
)