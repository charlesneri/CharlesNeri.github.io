import { createApp, computed, onMounted, ref } from 'vue'
import { isSupabaseConfigured, supabase, supabaseConfigurationError } from './supabase'

const resources = [
  { key: 'profile', label: 'Profile', singleton: true, imageField: 'profile_image_url', fields: [
    ['full_name', 'Full name', 'text', true], ['headline', 'Professional headline', 'text'], ['introduction', 'Introduction', 'textarea'], ['email', 'Email', 'email'], ['phone', 'Phone', 'text'], ['address', 'Address', 'textarea'], ['profile_image_url', 'Hero / profile image URL', 'url'],
  ], blank: { id: 1, full_name: '', headline: '', introduction: '', email: '', phone: '', address: '', profile_image_url: '' } },
  { key: 'about', label: 'About & education', singleton: true, education: true, imageField: 'image_url', fields: [
    ['summary', 'About summary', 'textarea'], ['image_url', 'About image URL', 'url'],
  ], blank: { id: 1, summary: '', image_url: '', education: [] } },
  { key: 'contact_details', label: 'Contact & social links', singleton: true, fields: [
    ['email', 'Public email', 'email'], ['phone', 'Phone', 'text'], ['address', 'Address', 'textarea'], ['map_url', 'Google Maps URL', 'url'], ['facebook_url', 'Facebook URL', 'url'], ['instagram_url', 'Instagram URL', 'url'], ['linkedin_url', 'LinkedIn URL', 'url'], ['github_url', 'GitHub URL', 'url'],
  ], blank: { id: 1, email: '', phone: '', address: '', map_url: '', facebook_url: '', instagram_url: '', linkedin_url: '', github_url: '' } },
  { key: 'skills', label: 'Skills', fields: [
    ['name', 'Skill name', 'text', true], ['category', 'Category', 'text'], ['description', 'Description', 'textarea'], ['icon', 'Bootstrap icon class', 'text'], ['sort_order', 'Display order', 'number'], ['published', 'Published', 'checkbox'],
  ], blank: { name: '', category: '', description: '', icon: 'bi-star', sort_order: 0, published: true } },
  { key: 'experiences', label: 'Experience', fields: [
    ['label', 'Label', 'text'], ['title', 'Title', 'text', true], ['description', 'Description', 'textarea'], ['icon', 'Bootstrap icon class', 'text'], ['sort_order', 'Display order', 'number'], ['published', 'Published', 'checkbox'],
  ], blank: { label: '', title: '', description: '', icon: 'bi-briefcase', sort_order: 0, published: true } },
  { key: 'projects', label: 'Projects', imageField: 'image_url', fields: [
    ['title', 'Project title', 'text', true], ['category', 'Category', 'text'], ['tools', 'Tools / skills', 'text'], ['description', 'Description', 'textarea'], ['image_url', 'Project image URL', 'url', true], ['link_url', 'Project link URL', 'url'], ['link_name', 'Link label', 'text'], ['sort_order', 'Display order', 'number'], ['published', 'Published', 'checkbox'],
  ], blank: { title: '', category: '', tools: '', description: '', image_url: '', link_url: '', link_name: '', sort_order: 0, published: true } },
  { key: 'certificates', label: 'Certificates', imageField: 'image_url', fields: [
    ['title', 'Certificate title', 'text', true], ['issuer', 'Issuer', 'text'], ['category', 'Category', 'text'], ['skills', 'Skills', 'text'], ['description', 'Description', 'textarea'], ['image_url', 'Certificate image URL', 'url', true], ['credential_url', 'Credential URL', 'url'], ['sort_order', 'Display order', 'number'], ['published', 'Published', 'checkbox'],
  ], blank: { title: '', issuer: '', category: 'Course Certificate', skills: '', description: '', image_url: '', credential_url: '', sort_order: 0, published: true } },
]

const copy = (value) => JSON.parse(JSON.stringify(value))

createApp({
  setup() {
    const email = ref(''); const password = ref(''); const user = ref(null); const authorized = ref(false)
    const active = ref(resources[0]); const rows = ref([]); const selectedId = ref(null); const record = ref(null)
    const busy = ref(false); const message = ref(''); const messageType = ref('info')
    const configured = isSupabaseConfigured
    const selected = computed(() => rows.value.find((row) => row.id === selectedId.value) || null)

    function notify(text, type = 'info') { message.value = text; messageType.value = type }
    function recordName(row) { return row.title || row.name || row.full_name || 'Record' }
    function fieldId(name) { return `${active.value.key}-${name}` }
    function normalise(row) {
      const next = copy(row)
      if (active.value.education && !Array.isArray(next.education)) next.education = []
      return next
    }
    async function checkSession() {
      if (!configured) return
      const { data } = await supabase.auth.getUser(); user.value = data.user
      if (!user.value) return
      const { data: admin, error } = await supabase.from('admin_users').select('user_id').eq('user_id', user.value.id).maybeSingle()
      if (error) { notify(error.message, 'danger'); return }
      authorized.value = Boolean(admin)
      if (authorized.value) await load()
    }
    async function login() {
      busy.value = true; message.value = ''
      const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
      busy.value = false
      if (error) { notify(error.message, 'danger'); return }
      await checkSession()
      if (!authorized.value) notify('This account is not authorized to edit the portfolio.', 'danger')
    }
    async function logout() { await supabase.auth.signOut(); user.value = null; authorized.value = false; rows.value = []; record.value = null }
    async function load() {
      busy.value = true; message.value = ''
      let query = supabase.from(active.value.key).select('*')
      if (!active.value.singleton) query = query.order('sort_order')
      const { data, error } = await query
      busy.value = false
      if (error) { notify(error.message, 'danger'); return }
      rows.value = data || []
      if (active.value.singleton) edit(rows.value[0] || active.value.blank)
      else if (rows.value.length) edit(rows.value[0])
      else newRecord()
    }
    async function choose(resource) { active.value = resource; selectedId.value = null; await load() }
    function edit(row) { selectedId.value = row.id || null; record.value = normalise(row) }
    function newRecord() { selectedId.value = null; record.value = normalise(active.value.blank) }
    function addEducation() { record.value.education.push({ title: '', school: '', date: '' }) }
    function removeEducation(index) { record.value.education.splice(index, 1) }
    async function uploadImage(event, fieldName) {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return
      if (!file.type.startsWith('image/')) { notify('Please choose an image file.', 'danger'); return }
      if (file.size > 5 * 1024 * 1024) { notify('Images must be 5 MB or smaller.', 'danger'); return }
      busy.value = true; message.value = ''
      const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const baseName = (record.value.title || record.value.full_name || active.value.key).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || active.value.key
      const path = `${active.value.key}/${baseName}-${crypto.randomUUID()}.${extension}`
      const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { contentType: file.type, upsert: false })
      if (error) { busy.value = false; notify(error.message, 'danger'); return }
      record.value[fieldName] = supabase.storage.from('portfolio-images').getPublicUrl(path).data.publicUrl
      busy.value = false
      notify('Image uploaded. Save changes to publish it.', 'success')
    }
    function addUploadInputs() {
      if (!active.value.imageField) return
      const urlInput = document.getElementById(fieldId(active.value.imageField))
      if (!urlInput || urlInput.dataset.uploadReady) return
      const upload = document.createElement('input')
      upload.type = 'file'; upload.accept = 'image/*'; upload.className = 'form-control mb-2'
      upload.setAttribute('aria-label', `Upload ${active.value.label} image`)
      upload.addEventListener('change', (event) => uploadImage(event, active.value.imageField))
      urlInput.parentElement.insertBefore(upload, urlInput)
      urlInput.placeholder = 'Or paste an image URL'
      urlInput.dataset.uploadReady = 'true'
    }
    async function save() {
      if (!record.value) return
      busy.value = true; message.value = ''
      const value = copy(record.value)
      const { data, error } = await supabase.from(active.value.key).upsert(value).select().single()
      busy.value = false
      if (error) { notify(error.message, 'danger'); return }
      await load()
      if (data) edit(data)
      notify('Saved successfully.', 'success')
    }
    async function remove() {
      if (!selected.value || !confirm(`Delete ${recordName(selected.value)}?`)) return
      busy.value = true
      const { error } = await supabase.from(active.value.key).delete().eq('id', selected.value.id)
      busy.value = false
      if (error) { notify(error.message, 'danger'); return }
      notify('Deleted.', 'success'); await load()
    }
    onMounted(() => {
      const observer = new MutationObserver(addUploadInputs)
      observer.observe(document.getElementById('editor-app'), { childList: true, subtree: true })
      addUploadInputs()
    })
    checkSession()
    return { resources, email, password, user, authorized, active, rows, selectedId, selected, record, busy, message, messageType, configured, configurationError: supabaseConfigurationError, fieldId, recordName, login, logout, choose, edit, newRecord, addEducation, removeEducation, uploadImage, save, remove }
  },
  template: `<main class="container editor-shell py-5">
    <div v-if="!configured" class="alert alert-warning">{{ configurationError || 'Add your Supabase configuration to .env.local and restart Vite.' }}</div>
    <section v-else-if="!authorized" class="card shadow-sm mx-auto" style="max-width:460px"><div class="card-body p-4"><h1 class="h3">Portfolio editor</h1><p class="text-muted">Sign in with your owner account.</p><form @submit.prevent="login"><label class="form-label" for="editor-email">Email</label><input id="editor-email" v-model.trim="email" class="form-control mb-3" type="email" autocomplete="email" required><label class="form-label" for="editor-password">Password</label><input id="editor-password" v-model="password" class="form-control mb-3" type="password" autocomplete="current-password" required><button class="btn btn-primary w-100" :disabled="busy">Sign in</button></form><p v-if="message" class="alert mt-3 mb-0" :class="'alert-' + messageType">{{ message }}</p></div></section>
    <template v-else><header class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><h1 class="h2 mb-1">Portfolio content editor</h1><p class="text-muted mb-0">Update the information shown on your website.</p></div><div><a class="btn btn-outline-secondary me-2" href="/" target="_blank">View website</a><button class="btn btn-outline-danger" @click="logout">Sign out</button></div></header><p v-if="message" class="alert" :class="'alert-' + messageType" role="alert" aria-live="polite">{{ message }}</p><div class="row g-4"><aside class="col-lg-3"><div class="editor-sidebar list-group"><button v-for="item in resources" :key="item.key" class="list-group-item list-group-item-action" :class="{active: active.key === item.key}" @click="choose(item)">{{ item.label }}</button></div></aside><section class="col-lg-9"><div class="card shadow-sm"><div class="card-body p-4"><div class="d-flex justify-content-between align-items-center gap-3 mb-4"><h2 class="h4 mb-0">{{ active.label }}</h2><button v-if="!active.singleton" class="btn btn-outline-primary" @click="newRecord"><i class="bi bi-plus-lg me-1"></i>Add new</button></div><div v-if="!active.singleton" class="row g-3"><div class="col-md-4"><div class="list-group"><button v-for="row in rows" :key="row.id" class="record list-group-item list-group-item-action" :class="{active: selectedId === row.id}" @click="edit(row)">{{ recordName(row) }}</button><p v-if="!rows.length" class="text-muted small mb-0">No items yet.</p></div></div><div class="col-md-8"><form v-if="record" @submit.prevent="save"><template v-for="field in active.fields" :key="field[0]"><div v-if="field[2] === 'checkbox'" class="form-check form-switch mb-3"><input :id="fieldId(field[0])" v-model="record[field[0]]" class="form-check-input" type="checkbox"><label class="form-check-label" :for="fieldId(field[0])">{{ field[1] }}</label></div><div v-else class="mb-3"><label class="form-label" :class="{required: field[3]}" :for="fieldId(field[0])">{{ field[1] }}</label><textarea v-if="field[2] === 'textarea'" :id="fieldId(field[0])" v-model="record[field[0]]" class="form-control" rows="4" :required="field[3]"></textarea><input v-else :id="fieldId(field[0])" v-model="record[field[0]]" class="form-control" :type="field[2]" :required="field[3]"></div></template><div class="d-flex gap-2"><button class="btn btn-success" :disabled="busy">{{ busy ? 'Saving…' : 'Save changes' }}</button><button v-if="selected" class="btn btn-outline-danger" type="button" @click="remove" :disabled="busy">Delete this item</button></div></form></div></div><form v-else-if="record" @submit.prevent="save"><template v-for="field in active.fields" :key="field[0]"><div v-if="field[2] === 'checkbox'" class="form-check form-switch mb-3"><input :id="fieldId(field[0])" v-model="record[field[0]]" class="form-check-input" type="checkbox"><label class="form-check-label" :for="fieldId(field[0])">{{ field[1] }}</label></div><div v-else class="mb-3"><label class="form-label" :class="{required: field[3]}" :for="fieldId(field[0])">{{ field[1] }}</label><textarea v-if="field[2] === 'textarea'" :id="fieldId(field[0])" v-model="record[field[0]]" class="form-control" rows="4" :required="field[3]"></textarea><input v-else :id="fieldId(field[0])" v-model="record[field[0]]" class="form-control" :type="field[2]" :required="field[3]"></div></template><section v-if="active.education" class="mb-4"><div class="d-flex justify-content-between align-items-center mb-2"><h3 class="h6 mb-0">Education</h3><button class="btn btn-sm btn-outline-primary" type="button" @click="addEducation">Add education</button></div><article v-for="(education, index) in record.education" :key="index" class="education-item mb-2"><div class="d-flex justify-content-between mb-2"><strong>Education {{ index + 1 }}</strong><button class="btn btn-sm btn-outline-danger" type="button" @click="removeEducation(index)">Remove education</button></div><input v-model="education.title" class="form-control mb-2" placeholder="Degree or course"><input v-model="education.school" class="form-control mb-2" placeholder="School"><input v-model="education.date" class="form-control" placeholder="Date or year"></article></section><div class="d-flex gap-2"><button class="btn btn-success" :disabled="busy">{{ busy ? 'Saving…' : 'Save changes' }}</button><button v-if="selected" class="btn btn-outline-danger" type="button" @click="remove" :disabled="busy">Delete this section</button></div></form></div></div></section></div></template>
  </main>`,
}).mount('#editor-app')
