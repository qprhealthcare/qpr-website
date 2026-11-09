/*
# Add second admin email to inquiry management policies

1. Changes
- Drops and recreates the three admin RLS policies (SELECT, UPDATE, DELETE) on qpr_inquiries
  so that BOTH yakitaquick@gmail.com AND hello@sitesonpolaris.com are authorized to manage inquiries.
- The public INSERT policy is unchanged.

2. Security
- Only the two configured admin emails can read, update, or delete inquiries.
- All other users (including non-admin authenticated users) remain denied by default.

3. Important Notes
1. If a third admin is needed in the future, add their email to the IN list in all three policies.
2. The admin email list must also be updated in the NEXT_PUBLIC_ADMIN_EMAIL environment variable.
*/

DROP POLICY IF EXISTS "Admin can read QPR inquiries" ON public.qpr_inquiries;
DROP POLICY IF EXISTS "Admin can update QPR inquiries" ON public.qpr_inquiries;
DROP POLICY IF EXISTS "Admin can delete QPR inquiries" ON public.qpr_inquiries;

CREATE POLICY "Admin can read QPR inquiries"
  ON public.qpr_inquiries FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('yakitaquick@gmail.com', 'hello@sitesonpolaris.com'));

CREATE POLICY "Admin can update QPR inquiries"
  ON public.qpr_inquiries FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('yakitaquick@gmail.com', 'hello@sitesonpolaris.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('yakitaquick@gmail.com', 'hello@sitesonpolaris.com'));

CREATE POLICY "Admin can delete QPR inquiries"
  ON public.qpr_inquiries FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('yakitaquick@gmail.com', 'hello@sitesonpolaris.com'));