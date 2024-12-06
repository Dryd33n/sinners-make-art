CREATE TABLE IF NOT EXISTS "home_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"img_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "home" (
	"id" serial PRIMARY KEY NOT NULL,
	"about_title" text NOT NULL,
	"content" text NOT NULL
);
