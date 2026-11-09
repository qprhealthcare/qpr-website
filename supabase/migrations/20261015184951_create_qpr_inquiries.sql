/*
# Create QPR inquiry submissions

1. New Tables
- `qpr_inquiries` stores messages submitted through the public QPR contact form.
- `id` is the unique submission identifier.
- `name` stores the visitor's name.
- `email` stores the visitor's reply email.
- `phone` stores an optional callback number.
- `audience` identifies whether the visitor is a family member, prospective client, referral source, or community partner.
- `message` stores the visitor's inquiry.
- `created_at` records when the inquiry was submitted.

2. Security
- Row level security is enabled.
- Anonymous and authenticated visitors may submit inquiries.
- Inquiry contents cannot be read, changed, or deleted through the public browser client.

3. Important Notes
- This is a single-tenant public inquiry form and does not require sign-in.
- Staff access can be added later through a separate protected workflow.
*/

CREATE TABLE IF NOT EXISTS public.qpr_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  audience text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.qpr_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit QPR inquiries" ON public.qpr_inquiries;
CREATE POLICY "Public can submit QPR inquiries"
  ON public.qpr_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 2 AND 120
    AND length(trim(email)) BETWEEN 5 AND 254
    AND length(trim(audience)) BETWEEN 2 AND 80
    AND length(trim(message)) BETWEEN 10 AND 4000
  );

DROP POLICY IF EXISTS "Public cannot read QPR inquiries" ON public.qpr_inquiries;
CREATE POLICY "Public cannot read QPR inquiries"
  ON public.qpr_inquiries FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Public cannot update QPR inquiries" ON public.qpr_inquiries;
CREATE POLICY "Public cannot update QPR inquiries"
  ON public.qpr_inquiries FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot delete QPR inquiries" ON public.qpr_inquiries;
CREATE POLICY "Public cannot delete QPR inquiries"
  ON public.qpr_inquiries FOR DELETE
  TO anon, authenticated
  USING (false);
