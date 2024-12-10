CREATE TABLE IF NOT EXISTS "nav_tree" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"order" integer NOT NULL
);
