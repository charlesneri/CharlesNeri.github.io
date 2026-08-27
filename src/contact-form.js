import { createApp, reactive, ref } from 'vue'

// Web3Forms access keys are public form identifiers, not private API secrets.
const web3FormsAccessKey = '5c8f6c81-d0ed-4b05-bfef-95c98b63dcc1'

const element = document.querySelector('#contact-form')

if (element) {
  createApp({
    setup() {
      const form = reactive({ name: '', email: '', subject: '', message: '', botcheck: false })
      const sending = ref(false)
      const status = ref('')
      const showSuccessPopup = ref(false)

      async function submit() {
        status.value = ''
        sending.value = true
        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              access_key: web3FormsAccessKey,
              name: form.name,
              email: form.email,
              subject: form.subject || `Portfolio message from ${form.name}`,
              message: form.message,
              from_name: 'Charles Neri Portfolio',
              replyto: form.email,
              botcheck: form.botcheck,
            }),
          })
          const result = await response.json()
          if (!response.ok || !result.success) throw new Error(result.message || 'Unable to send email.')
        } catch {
          status.value = 'Your message could not be sent. Check your connection and try again, or email me directly.'
          sending.value = false
          return
        }

        sending.value = false
        showSuccessPopup.value = true
        Object.assign(form, { name: '', email: '', subject: '', message: '', botcheck: false })
      }

      function closeSuccessPopup() {
        showSuccessPopup.value = false
      }

      return { form, sending, status, showSuccessPopup, submit, closeSuccessPopup }
    },
    template: `<div class="row mt-5"><div class="col-lg-9 mx-auto"><form class="php-email-form contact-message-form" @submit.prevent="submit">
      <div class="contact-form-heading"><span>Start a conversation</span><h3>Send a message</h3><p>Share a few details and I’ll get back to you as soon as possible.</p></div>
      <div class="row gy-4"><div class="col-md-6"><label for="contact-name">Name</label><input id="contact-name" v-model.trim="form.name" type="text" name="name" placeholder="Your name" autocomplete="name" required maxlength="120"></div>
      <div class="col-md-6"><label for="contact-email">Email</label><input id="contact-email" v-model.trim="form.email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required maxlength="320"></div>
      <div class="col-12"><label for="contact-subject">Subject <small>(optional)</small></label><input id="contact-subject" v-model.trim="form.subject" type="text" name="subject" placeholder="What would you like to discuss?" maxlength="200"></div>
      <div class="col-12"><label for="contact-message">Message</label><textarea id="contact-message" v-model.trim="form.message" name="message" rows="6" placeholder="Tell me a little about your project or inquiry…" required maxlength="5000"></textarea></div>
      <input v-model="form.botcheck" type="checkbox" tabindex="-1" autocomplete="off" aria-hidden="true" style="display: none">
      <div class="col-12"><p v-if="status" class="form-status is-error" role="alert" aria-live="polite">{{ status }}</p><button type="submit" :disabled="sending">{{ sending ? 'Sending...' : 'Send message' }} <i v-if="!sending" class="bi bi-arrow-up-right"></i></button></div></div>
    </form><div v-if="showSuccessPopup" class="contact-success-popup" role="dialog" aria-modal="true" aria-labelledby="contact-success-title" @click.self="closeSuccessPopup"><div class="contact-success-popup__content"><div class="contact-success-popup__icon" aria-hidden="true"><i class="bi bi-check-lg"></i></div><h3 id="contact-success-title">Message sent!</h3><p>Thank you — your message has been sent. I’ll check my email, and get back to you as soon as possible.</p><button type="button" @click="closeSuccessPopup">Close</button></div></div></div></div>`,
  }).mount(element)
}
