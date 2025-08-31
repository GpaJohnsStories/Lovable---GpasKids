
-- One-time hard reset of visitor counters before launch.

begin;

-- Reset per-country visit counts (tracked by the edge function).
truncate table public.monthly_country_visits restart identity;

-- Reset monthly visit aggregates and all sub-counters.
truncate table public.monthly_visits restart identity;

commit;
