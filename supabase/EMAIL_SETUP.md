# Contact email delivery

The contact form stores messages in Supabase and emails them to you through the `send-contact-email` Edge Function.

1. Create a [Resend](https://resend.com) account and verify a domain you own. Create an API key with permission to send email.
2. Install and sign in to the Supabase CLI, then set these secrets. Replace the example values with your own:

   ```powershell
   supabase secrets set RESEND_API_KEY=re_your_key
   supabase secrets set RESEND_FROM_EMAIL="Portfolio <hello@your-domain.com>"
   supabase secrets set CONTACT_RECIPIENT_EMAIL=charlesqneri@gmail.com
   ```

3. Deploy the function:

   ```powershell
   supabase functions deploy send-contact-email --no-verify-jwt
   ```

The `--no-verify-jwt` option allows public visitors to submit the contact form. The function validates field sizes and email format before sending. Never put the Resend API key in `.env.local` or browser code.

4. If your database was created before this update, run `supabase/allow-short-contact-messages.sql` in Supabase SQL Editor to allow messages shorter than 10 characters.
