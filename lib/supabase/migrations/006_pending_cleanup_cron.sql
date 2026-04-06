-- Migration 6: Auto-expire pending pixel reservations after 30 minutes
-- Requires pg_cron extension (enable in Supabase dashboard under Extensions)

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup-pending-pixels',
  '*/5 * * * *', -- every 5 minutes
  $$DELETE FROM pixels WHERE status = 'pending' AND created_at < now() - interval '30 minutes'$$
);
