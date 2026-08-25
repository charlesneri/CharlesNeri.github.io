import { createApp, reactive, ref } from 'vue'
import { isSupabaseConfigured, supabase } from './supabase'

const element = document.querySelector('#contact-form')

if (element) {
  createApp({
    setup() {
      const form = reactive({ name: '', email: '', subject: '', message: '' })
      const sending = ref(false)
      const status = ref('')
      const statusType = ref('')

      async function submit() {
        status.value = ''
        if (!isSupabaseConfigured) {
          statusType.value = 'error'
          status.value = 'The contact form is not configured yet.'
          return
        }
        sending.value = true
        try {
          const message = { ...form }
          const { error: emailError } = await supabase.functions.invoke('send-contact-email', { body: message })
          if (emailError) throw emailError
          const { error } = await supabase.from('contact_messages').insert(message)
          if (error) throw error
        } catch {
          statusType.value = 'error'
          status.value = 'Your message could not be sent. Check your connection and try again, or email me directly.'
          sending.value = false
          return
        }
        sending.value = false
        statusType.value = 'success'
        status.value = 'Thank you — your message has been sent.'
        Object.assign(form, { name: '', email: '', subject: '', message: '' })
      }

      return { form, sending, status, statusType, submit }
    },
    template: `<div class="row mt-5"><div class="col-lg-9 mx-auto"><form class="php-email-form contact-message-form" @submit.prevent="submit">
      <div class="contact-form-heading"><span>Start a conversation</span><h3>Send a message</h3><p>Share a few details and I’ll get back to you as soon as possible.</p></div>
      <div class="row gy-4"><div class="col-md-6"><label for="contact-name">Name</label><input id="contact-name" v-model.trim="form.name" type="text" name="name" placeholder="Your name" autocomplete="name" required maxlength="120"></div>
      <div class="col-md-6"><label for="contact-email">Email</label><input id="contact-email" v-model.trim="form.email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required maxlength="320"></div>
      <div class="col-12"><label for="contact-subject">Subject <small>(optional)</small></label><input id="contact-subject" v-model.trim="form.subject" type="text" name="subject" placeholder="What would you like to discuss?" maxlength="200"></div>
      <div class="col-12"><label for="contact-message">Message</label><textarea id="contact-message" v-model.trim="form.message" name="message" rows="6" placeholder="Tell me a little about your project or inquiry…" required maxlength="5000"></textarea></div>
      <div class="col-12"><p v-if="status" class="form-status" :class="statusType === 'success' ? 'is-success' : 'is-error'" role="alert" aria-live="polite">{{ status }}</p><button type="submit" :disabled="sending">{{ sending ? 'Sending...' : 'Send message' }} <i v-if="!sending" class="bi bi-arrow-up-right"></i></button></div></div>
    </form></div></div>`,
  }).mount(element)
}
