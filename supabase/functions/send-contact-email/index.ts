// Deploy with: supabase functions deploy send-contact-email --no-verify-jwt
// Required secrets: RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_RECIPIENT_EMAIL

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const { name, email, subject = '', message } = await request.json()
    const valid = typeof name === 'string' && name.trim().length >= 2 && name.length <= 120
      && typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320
      && typeof subject === 'string' && subject.length <= 200
      && typeof message === 'string' && message.trim().length >= 1 && message.length <= 5000
    if (!valid) return new Response(JSON.stringify({ error: 'Invalid message details.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const apiKey = Deno.env.get('RESEND_API_KEY')
    const from = Deno.env.get('RESEND_FROM_EMAIL')
    const recipient = Deno.env.get('CONTACT_RECIPIENT_EMAIL')
    if (!apiKey || !from || !recipient) throw new Error('Email delivery is not configured.')

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email.trim(),
        subject: subject.trim() || `Portfolio message from ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      }),
    })
    if (!response.ok) throw new Error('Email provider rejected the message.')
    return new Response(JSON.stringify({ sent: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Unable to send email.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
