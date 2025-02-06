import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const hometable = pgTable("hometable", {
	id: serial().primaryKey().notNull(),
	aboutTitle: text("about_title").notNull(),
	aboutText: text("about_text").notNull(),
	images: text().notNull(),
});

export const cvEducation = pgTable("cv_education", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cv_education_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: text().notNull(),
	location: text().notNull(),
	type: text().notNull(),
	date: text().notNull(),
	order: integer().notNull(),
});

export const navTree = pgTable("nav_tree", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	path: text().notNull(),
	order: integer().notNull(),
	linkOvveride: text("link_ovveride").default('auto').notNull(),
});

export const postsTable = pgTable("posts_table", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "posts_table_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: text().notNull(),
	description: text().notNull(),
	type: text().notNull(),
	content: text().notNull(),
	tag: text().notNull(),
	portfolio: boolean().default(false).notNull(),
	order: integer().notNull(),
});

export const socialLinks = pgTable("social_links", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "social_links_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	url: text().notNull(),
	name: text().notNull(),
});

export const highlightsTable = pgTable("highlights_table", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "highlights_table_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	highlightTag: text("highlight_tag").notNull(),
	highlightName: text("highlight_name").notNull(),
	highlightDesc: text("highlight_desc").notNull(),
	type: text().notNull(),
	content: text().notNull(),
	order: integer().notNull(),
});

export const cvSkills = pgTable("cv_skills", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cv_skills_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	skill: text().notNull(),
	order: integer().notNull(),
});

export const cvExhibition = pgTable("cv_exhibition", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cv_experience_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: text().notNull(),
	location: text().notNull(),
	date: text().notNull(),
	description: text().notNull(),
	order: integer().notNull(),
});

export const cvWorkexperience = pgTable("cv_workexperience", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cv_workexperience_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: text().notNull(),
	location: text().notNull(),
	date: text().notNull(),
	description: text().notNull(),
});

export const cvAwards = pgTable("cv_awards", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cv_awards_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: text().notNull(),
	description: text().notNull(),
	order: integer().notNull(),
});
