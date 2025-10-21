-- Create search_logs table to track all search queries
create table "public"."search_logs" (
    "id" uuid not null default gen_random_uuid(),
    "query" text not null,
    "intent" text,
    "intent_reason" text,
    "overview" text,
    "recommended_trade" text,
    "recommendation_reason" text,
    "confidence_score" integer,
    "created_at" timestamp with time zone not null default now(),
    "user_ip" text,
    "user_agent" text,
    "response_data" jsonb
);

-- Create indexes for better performance
create index "search_logs_created_at_idx" on "public"."search_logs" using btree ("created_at");
create index "search_logs_intent_idx" on "public"."search_logs" using btree ("intent");
create index "search_logs_query_idx" on "public"."search_logs" using gin (to_tsvector('english', "query"));

-- Set up RLS (Row Level Security) - allow all operations for now
alter table "public"."search_logs" enable row level security;

-- Create policies
create policy "Allow all operations on search_logs" on "public"."search_logs"
    for all using (true);

-- Grant permissions
grant all on table "public"."search_logs" to "anon";
grant all on table "public"."search_logs" to "authenticated";
grant all on table "public"."search_logs" to "service_role";

-- Add primary key constraint
alter table "public"."search_logs" add constraint "search_logs_pkey" primary key ("id");
