import { createApp } from 'vue'
import { isSupabaseConfigured, supabase } from './supabase'

async function loadPublicContent() {
  if (!isSupabaseConfigured) return
  const [profile, about, skills, experiences, contact] = await Promise.all([
    supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
    supabase.from('about').select('*').eq('id', 1).maybeSingle(),
    supabase.from('skills').select('*').eq('published', true).order('sort_order'),
    supabase.from('experiences').select('*').eq('published', true).order('sort_order'),
    supabase.from('contact_details').select('*').eq('id', 1).maybeSingle(),
  ])
  if (profile.error || about.error || skills.error || experiences.error || contact.error) return

  if (profile.data) {
    createApp({ data: () => ({ profile: profile.data, contact: contact.data || {} }), template: `<div class="hero-details"><h2>{{ profile.full_name }}</h2><p>I'm <span>{{ profile.headline }}</span></p><p class="hero-intro">{{ profile.introduction }}</p><div class="social-links"><a v-if="contact.facebook_url" :href="contact.facebook_url" target="_blank" rel="noopener"><i class="bi bi-facebook"></i></a><a v-if="contact.linkedin_url" :href="contact.linkedin_url" target="_blank" rel="noopener"><i class="bi bi-linkedin"></i></a><a v-if="contact.github_url" :href="contact.github_url" target="_blank" rel="noopener"><i class="bi bi-github"></i></a></div></div>` }).mount('#hero .hero-details')
    document.querySelector('#hero .hero-image img').src = profile.data.profile_image_url || 'assets/img/Hero_true.JPG'
  }

  if (about.data) {
    createApp({ data: () => ({ about: about.data }), template: `<div class="col-lg-7 content"><h3>{{ about.summary }}</h3><hr><h4><b>Education</b></h4><ul class="education-list"><li v-for="item in about.education" :key="item.title" class="education-item"><div class="edu-left"><i class="bi bi-check2-all"></i><b>{{ item.title }}</b><br>{{ item.school }}</div><div class="edu-right">{{ item.date }}</div></li></ul></div>` }).mount('#about .content')
    document.querySelector('#about .profile-img img').src = about.data.image_url || 'assets/img/dp-final.png'
  }

  createApp({ data: () => ({ skills: skills.data }), template: `<div class="skills-list"><div v-for="skill in skills" :key="skill.id" class="service-item"><div class="icon"><i :class="'bi ' + skill.icon"></i></div><div><h4 class="title">{{ skill.name }}</h4><p class="description">{{ skill.description }}</p></div></div></div>` }).mount('#services .skills-list')
  createApp({ data: () => ({ items: experiences.data }), template: `<div class="experience-list"><article v-for="item in items" :key="item.id" class="experience-item"><div class="experience-icon"><i :class="'bi ' + item.icon"></i></div><div class="experience-content"><p class="experience-meta">{{ item.label }}</p><h3>{{ item.title }}</h3><p>{{ item.description }}</p></div></article></div>` }).mount('#services .experience-list')
  if (contact.data) createApp({ data: () => ({ contact: contact.data }), template: `<div class="info-wrap"><div class="row gy-5"><div class="col-lg-4"><div class="info-item d-flex align-items-center"><i class="bi bi-geo-alt flex-shrink-0"></i><div><h3>Address</h3><p>{{ contact.address }}</p></div></div></div><div class="col-lg-4"><div class="info-item d-flex align-items-center"><i class="bi bi-telephone flex-shrink-0"></i><div><h3>Call</h3><p>{{ contact.phone }}</p><div class="contact-actions"><a :href="'tel:' + contact.phone.replace(/[^+0-9]/g, '')">Call now</a></div></div></div></div><div class="col-lg-4"><a class="info-item contact-link d-flex align-items-center" :href="'mailto:' + contact.email"><i class="bi bi-envelope flex-shrink-0"></i><div><h3>Email</h3><p>{{ contact.email }}</p></div></a></div></div></div>` }).mount('#contact .info-wrap')
}

loadPublicContent()
