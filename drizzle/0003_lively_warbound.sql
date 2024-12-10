CREATE TABLE IF NOT EXISTS "hometable" (
	"id" serial PRIMARY KEY NOT NULL,
	"about_title" text NOT NULL,
	"about_text" text NOT NULL,
	"images" text NOT NULL
);