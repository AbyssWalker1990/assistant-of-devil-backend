CREATE TABLE "ai_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"pass_phrase" varchar(500) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_facts" (
	"id" serial PRIMARY KEY NOT NULL,
	"ai_user_id" integer NOT NULL,
	"content" text NOT NULL,
	"moral_score" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_facts" ADD CONSTRAINT "user_facts_ai_user_id_ai_users_id_fk" FOREIGN KEY ("ai_user_id") REFERENCES "public"."ai_users"("id") ON DELETE cascade ON UPDATE no action;