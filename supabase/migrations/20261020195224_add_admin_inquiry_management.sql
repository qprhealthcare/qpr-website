/*
# Add admin management for QPR inquiries

1. Changes
- Creates the qpr_inquiries table if it does not already exist (same schema as the original migration plus a status column).
- Adds a `status` column (text, not null, default 'new') to track inquiry progress.
- Status values used by the admin dashboard: 'new', 'reviewed', 'archived'.

2. Security — Row Level Security
- RLS is enabled on qpr_inquiries.
- Public (anon + authenticated) can INSERT inquiries with the same field-length validation as the original migration. The public contact form continues to work unchanged.
- Only the configured admin email (hello@sitesonpolaris.com) can SELECT, UPDATE, and DELETE inquiries. The check uses auth.jwt() ->> 'email' so the admin must be signed in via Supabase Auth.
- Non-admin authenticated users and anon users cannot read, modify, or delete any inquiry — no matching policy exists for them, so RLS denies by default.

3. Important Notes
1. The admin signs in via Supabase magic link authentication on /admin/login.
2. The public contact form on the homepage continues to work exactly as before.
3. Only the configured admin email can view or manage submissions.
4. If the admin email needs to change, a new migration must update the RLS policies.
*/

CREATE TABLE IF NOT EXISTS public.qpr_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  audience text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'qpr_inquiries'
      AND column_name = 'status'
  ) THEN
    ALTER TABLE public.qpr_inquiries ADD COLUMN status text NOT NULL DEFAULT 'new';
  END IF;
END $$;

ALTER TABLE public.qpr_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit QPR inquiries" ON public.qpr_inquiries;
DROP POLICY IF EXISTS "Public cannot read QPR inquiries" ON public.qpr_inquiries;
DROP POLICY IF EXISTS "Public cannot update QPR inquiries" ON public.qpr_inquiries;
DROP POLICY IF EXISTS "Public cannot delete QPR inquiries" ON public.qpr_inquiries;
DROP POLICY IF EXISTS "Admin can read QPR inquiries" ON public.qpr_inquiries;
DROP POLICY IF EXISTS "Admin can update QPR inquiries" ON public.qpr_inquiries;
DROP POLICY IF EXISTS "Admin can delete QPR inquiries" ON public.qpr_inquiries;

CREATE POLICY "Public can submit QPR inquiries"
  ON public.qpr_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 2 AND 120
    AND length(trim(email)) BETWEEN 5 AND 254
    AND length(trim(audience)) BETWEEN 2 AND 80
    AND length(trim(message)) BETWEEN 10 AND 4000
  );

CREATE POLICY "Admin can read QPR inquiries"
  ON public.qpr_inquiries FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@sitesonpolaris.com');

CREATE POLICY "Admin can update QPR inquiries"
  ON public.qpr_inquiries FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@sitesonpolaris.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'hello@sitesonpolaris.com');

CREATE POLICY "Admin can delete QPR inquiries"
  ON public.qpr_inquiries FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@sitesonpolaris.com');