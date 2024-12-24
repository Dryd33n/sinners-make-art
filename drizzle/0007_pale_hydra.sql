CREATE TABLE IF NOT EXISTS "posts_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"tag" text NOT NULL,
	"order" integer NOT NULL,
	"portfolio" boolean DEFAULT false NOT NULL
);
