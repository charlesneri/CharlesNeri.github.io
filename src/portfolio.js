import { createApp, ref, onMounted } from 'vue'
import { isSupabaseConfigured, supabase } from './supabase'

const fallbackProjects = [
  { title: 'Figma Interface Design', image_url: 'assets/img/first page.png', item_type: 'UI/UX Design', tools: 'Figma', description: 'An interactive interface prototype created in Figma to explore page structure, navigation, and user experience.', link_url: 'https://www.figma.com/proto/PkkPQ083pV0mRVWnF5nUg7/Untitled?node-id=0-1&t=fy1PccKmXFPQ5VEJ-1', link_name: 'View Figma prototype' },
  { title: 'Guitar Song Platform Redesign', image_url: 'assets/img/Android Compact - 1.png', item_type: 'Web & UI Design', tools: 'Figma', description: 'An educational redesign of an existing platform, focused on cleaner mobile navigation.', link_url: 'https://guitar-song.vercel.app/', link_name: 'Visit Guitar Song' },
  { title: 'Teach & Learn Platform', image_url: 'assets/img/teachandlearn.png', item_type: 'Full-stack Web Development', tools: 'Vue.js, Supabase, Vercel', description: 'An educational website developed with Vue.js and Supabase.', link_url: 'https://teachandlearn.vercel.app/', link_name: 'Visit Teach & Learn' },
  { title: 'ServiceHub PH Logo', image_url: 'assets/img/SERVICEHUB PH.png', item_type: 'Brand Identity', tools: 'Canva', description: 'A logo designed for an academic Technopreneurship system proposal.', link_url: '', link_name: '' },
  { title: 'Teach & Learn Logo', image_url: 'assets/img/Teach&Learn.png', item_type: 'Logo Design', tools: 'Canva', description: 'A logo created for the Teach & Learn educational platform.', link_url: 'https://teachandlearn.vercel.app/', link_name: 'Visit Teach & Learn' },
  { title: 'Capstone Conference Poster', image_url: 'assets/img/Poster for scii-com.png', item_type: 'Poster Design', tools: 'Canva', description: 'A conference poster presenting the relevance and development of our capstone project.', link_url: '', link_name: '' },
  { title: 'Birthday Cake Topper — Design 1', image_url: 'assets/img/1.png', item_type: 'Personal Design', tools: 'Canva', description: 'A custom birthday cake topper concept created in Canva for personal use.', link_url: '', link_name: '' },
  { title: 'Birthday Cake Topper — Design 2', image_url: 'assets/img/2.png', item_type: 'Personal Design', tools: 'Canva', description: 'A second custom birthday cake topper concept created in Canva for personal use.', link_url: '', link_name: '' },
  { title: 'Zapier Email Inquiry Automation', image_url: 'assets/img/Email Message inquiry- ai zapier.png', item_type: 'Workflow Automation', tools: 'Zapier, Email Automation, AI', description: 'A Zapier automation mockup for handling email-message inquiries.', link_url: '', link_name: '' },
]

const fallbackCertificates = [
  { title: 'Introduction to HTML', image_url: 'cerificates/sololearn.png', item_type: 'Course Certificate', tools: 'HTML, SoloLearn', description: "Awarded after completing SoloLearn's introductory HTML course and its foundational lessons on structuring web pages.", link_url: '', link_name: '' },
  { title: 'Responsive Web Design', image_url: 'cerificates/web-design.png', item_type: 'Course Certificate', tools: 'HTML, CSS, Responsive Design', description: 'Completed FreeCodeCamp training in responsive web design.', link_url: '', link_name: '' },
  { title: 'Digital Marketing', image_url: 'cerificates/DM001.png', item_type: 'Training Certificate', tools: 'Digital Marketing', description: 'Completed digital marketing upskilling through DICT.', link_url: '', link_name: '' },
  { title: 'Google Ads Search Certification', image_url: 'assets/img/Google ads Search.png', item_type: 'Professional Certification', tools: 'Google Ads, Search Advertising', description: 'Demonstrates foundational knowledge of search campaign setup, keyword targeting, ad creation, and performance optimization.', link_url: '', link_name: '' },
  { title: 'Google Ads Video Certification', image_url: 'assets/img/Google ads video.png', item_type: 'Professional Certification', tools: 'Google Ads, Video Advertising', description: 'Demonstrates foundational knowledge of video campaign setup, audience targeting, ad creation, and performance optimization.', link_url: '', link_name: '' },
]

function mountGallery(selector, table, fallbackItems) {
  const element = document.querySelector(selector)
  if (!element) return

  createApp({
    setup() {
      const items = ref(fallbackItems)
      const loading = ref(isSupabaseConfigured)
      const error = ref('')
      onMounted(async () => {
        if (!isSupabaseConfigured) return
        const fields = table === 'projects'
          ? 'id, title, image_url, category, tools, description, link_url, link_name, sort_order'
          : 'id, title, image_url, category, skills, description, sort_order'
        const { data, error: queryError } = await supabase.from(table).select(fields).eq('published', true).order('sort_order')
        loading.value = false
        if (queryError) { error.value = 'Could not load the latest items. Showing saved portfolio content.'; return }
        items.value = data.map((item) => table === 'projects'
          ? { ...item, image_url: freshImageUrl(item.image_url, item.updated_at), item_type: item.category }
          : { ...item, image_url: freshImageUrl(item.image_url), item_type: item.category, tools: item.skills, link_url: '', link_name: '' })
      })
      return { items, loading, error }
    },
    template: `<div class="row gy-4 portfolio-dialog-grid">
      <div v-for="item in items" :key="item.id || item.title" class="col-lg-4 col-md-6">
        <button class="work-card" type="button" data-bs-toggle="modal" data-bs-target="#workDialog" :data-title="item.title" :data-image="item.image_url" :data-type="item.item_type" :data-tools="item.tools" :data-description="item.description" :data-link="item.link_url" :data-link-name="item.link_name">
          <img :src="item.image_url" :alt="item.title + ' preview'"><span><strong>{{ item.title }}</strong><small>{{ item.item_type }} · {{ item.tools }}</small></span>
        </button>
      </div>
      <p v-if="loading" class="text-center">Loading portfolio items…</p><p v-if="error" class="text-center small">{{ error }}</p>
    </div>`,
  }).mount(element)
}

function freshImageUrl(url, version = Date.now()) { return url ? `${url}${url.includes('?') ? '&' : '?'}v=${version}` : '' }

mountGallery('#portfolio .portfolio-dialog-grid', 'projects', fallbackProjects)
mountGallery('#certificates .portfolio-dialog-grid', 'certificates', fallbackCertificates)
