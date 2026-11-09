/*
# Route inquiry submissions through the submit-inquiry function

1. Changes
- Removes the public INSERT policy on qpr_inquiries so the browser can no longer write inquiries directly.
- Inquiries are now saved by the submit-inquiry edge function, which validates input, applies spam and rate limits, and sends notification emails.

2. Security
- Row level security remains enabled.
- Public read, update, and delete policies are unchanged and still deny all access.
- The edge function writes with the service role, which keeps its existing INSERT and SELECT privileges.

3. Important Notes
- If the contact form stops saving, check that the submit-inquiry function is deployed.
*/

DROP POLICY IF EXISTS "Public can submit QPR inquiries" ON public.qpr_inquiries;
