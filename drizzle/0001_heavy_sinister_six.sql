ALTER TABLE "home" RENAME COLUMN "content" TO "about_text";--> statement-breakpoint
ALTER TABLE "home" DROP COLUMN IF EXISTS "id";