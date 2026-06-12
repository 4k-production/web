<template>
  <div class="page events-page">
    <!-- Page Header -->
    <div class="page-hero">
      <div class="page-hero-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>
      <div class="container page-hero-content reveal">
        <span class="section-label">Client Access</span>
        <h1 class="page-title">
          Events <span class="gradient-text">Room</span>
        </h1>
        <p class="page-subtitle">
          A special space for our clients to relive their special moments. 
          Browse through the events we've captured.
        </p>
      </div>
    </div>

    <!-- Events Grid -->
    <section class="section events-section">
      <div class="container">
        <div v-if="loading" class="events-grid">
          <div v-for="n in 6" :key="n" class="skeleton" style="aspect-ratio:16/10;border-radius:var(--radius-lg)"></div>
        </div>

        <div v-else-if="!events.length" class="empty-state">
          <div class="empty-icon">📸</div>
          <p>No events uploaded yet. Check back soon!</p>
        </div>

        <div v-else class="events-grid">
          <div v-for="event in events" :key="event.id" class="event-card reveal" @click="goToEvent(event.slug || event.id)">
            <div class="event-card-media">
              <img :src="getMediaUrl(event.photos[0])" :alt="event.event_name" />
              <div class="event-card-overlay">
                <span class="btn btn-primary btn-sm">View Event</span>
              </div>
              <!-- Share button on thumbnail -->
              <button
                class="event-card-share"
                @click.stop="shareEvent(event)"
                :class="{ copied: sharedEventId === (event.slug || event.id) }"
                title="Share event"
              >
                <svg v-if="sharedEventId !== (event.slug || event.id)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
            </div>
            <div class="event-card-info">
              <h3 class="event-card-title">{{ event.event_name }}</h3>
              <div class="event-card-meta">
                <span v-if="event.client_name">{{ event.client_name }}</span>
                <span v-if="event.event_date" class="event-date">{{ formatDate(event.event_date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast notification -->
    <transition name="toast">
      <div v-if="toastMsg" class="events-toast">{{ toastMsg }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { eventsApi } from '@/services/api.js'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

const { initReveal, refresh } = useScrollReveal()
const router = useRouter()
const events = ref([])
const loading = ref(true)
const sharedEventId = ref(null)
const toastMsg = ref('')

const getMediaUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${url}`;
};

async function loadEvents() {
  try {
    const res = await eventsApi.getAll()
    events.value = res.data || []
  } catch (err) {
    console.error('Failed to load events:', err)
  } finally {
    loading.value = false
    await nextTick()
    initReveal()
    refresh()
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function goToEvent(idOrSlug) {
  router.push(`/events/${idOrSlug}`)
}

function shareEvent(event) {
  const idOrSlug = event.slug || event.id
  const url = `${window.location.origin}/events/${idOrSlug}`
  navigator.clipboard.writeText(url).then(() => {
    sharedEventId.value = idOrSlug
    showToast(`Link for "${event.event_name}" copied!`)
    setTimeout(() => { sharedEventId.value = null }, 2200)
  })
}

let toastTimer = null
function showToast(msg) {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 2400)
}

onMounted(() => {
  initReveal()
  loadEvents()
})
</script>

<style scoped>
.page-hero {
  position: relative;
  min-height: 320px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 60px;
  padding-top: calc(var(--header-height) + 20px);
  overflow: hidden;
  text-align: center;
}
.page-hero-orbs { position: absolute; inset: 0; z-index: 0; }
.orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.1; }
.orb-1 { width: 400px; height: 400px; background: var(--clr-purple); top: -100px; right: -50px; }
.orb-2 { width: 300px; height: 300px; background: var(--clr-aqua); bottom: -100px; left: -50px; }
.page-hero-content { position: relative; z-index: 1; }
.page-title { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; margin: 12px 0 16px; }
.page-subtitle { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto; }

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.event-card {
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: var(--glass-blur);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-glow);
}

.event-card-media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.event-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.event-card:hover .event-card-media img {
  transform: scale(1.05);
}

.event-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover .event-card-overlay {
  opacity: 1;
}

.event-card-info {
  padding: 20px;
}

.event-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.event-card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.3;
}

@media (max-width: 600px) {
  .events-grid { grid-template-columns: 1fr; }
}

/* Share button on card thumbnail */
.event-card-share {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.2s, transform 0.2s, background 0.2s;
  z-index: 5;
}
.event-card:hover .event-card-share {
  opacity: 1;
  transform: scale(1);
}
.event-card-share:hover { background: rgba(139,92,246,0.6); border-color: rgba(139,92,246,0.5); }
.event-card-share.copied { background: rgba(52,211,153,0.55); border-color: rgba(52,211,153,0.5); }

/* Toast */
.events-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20,20,30,0.92);
  color: #fff;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 600;
  border: 1px solid rgba(139,92,246,0.3);
  backdrop-filter: blur(12px);
  z-index: 3000;
  white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>
