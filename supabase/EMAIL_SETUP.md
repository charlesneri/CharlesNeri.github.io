# Contact email delivery

The contact form sends messages directly to `charlesqneri@gmail.com` through Web3Forms. It does not require a custom domain, Resend, Supabase secrets, or an Edge Function.

The Web3Forms access key is stored in `src/contact-form.js`. It is a public form identifier, so it may be included in the frontend. In the Web3Forms dashboard, restrict the key to the website's deployed domain (for example, `your-site.vercel.app`) to help reduce misuse.

After deploying the website, submit a test message and check Gmail (including Spam). You can reply directly to the visitor because their submitted email is set as the reply-to address.

The existing `send-contact-email` Supabase function is no longer used. Keep it only if you later choose to move to Resend with a custom domain.
