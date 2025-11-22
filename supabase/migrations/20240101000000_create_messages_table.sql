-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to SELECT (read-only)
CREATE POLICY "Allow authenticated users to read messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow anon users to SELECT (read-only) - for public feed
CREATE POLICY "Allow anon users to read messages"
  ON public.messages
  FOR SELECT
  TO anon
  USING (true);

-- CRITICAL: NO INSERT/UPDATE/DELETE policies for anon or authenticated
-- This ensures only the Edge Function (using service_role) can write to the database

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at DESC);

-- Create index for user_id if needed
CREATE INDEX IF NOT EXISTS messages_user_id_idx ON public.messages(user_id);

