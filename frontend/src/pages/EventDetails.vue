<template>
  <div class="page event-details-page">
    <div v-if="loading" class="container section text-center">
      <div class="adm-spinner-sm" style="margin: 0 auto 20px;"></div>
      <p>Loading event moments...</p>
    </div>

    <div v-else-if="!event" class="container section text-center">
      <h2 class="section-title">Event Not Found</h2>
      <p class="section-subtitle">The event you're looking for doesn't exist or has been removed.</p>
      <router-link to="/events" class="btn btn-primary">Back to Events Room</router-link>
    </div>

    <div v-else>
      <!-- Event Hero Header with thumbnail background -->
      <div class="event-hero" :style="heroBgStyle" id="event-hero">
        <div class="event-hero-bg-overlay"></div>
        <div class="event-hero-gradient"></div>
        <div class="container event-hero-content">
          <!-- Removed Back to Events Room and Photos count elements -->
          <h1 class="event-title">{{ event.event_name }}</h1>
          <div class="event-meta">
            <span v-if="event.client_name" class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {{ event.client_name }}
            </span>
            <span v-if="event.event_date" class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ formatDate(event.event_date) }}
            </span>
          </div>
          <!-- Hero actions -->
          <div class="hero-actions-row">
            <button class="hero-share-btn" @click="shareEvent" :class="{ copied: heroCopied }">
              <svg v-if="!heroCopied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ heroCopied ? 'Link Copied!' : 'Share Event' }}
            </button>
            
            <button v-if="event.photos?.length" class="hero-download-all-btn" @click="downloadAllImages" :disabled="downloadingZip">
              <svg v-if="!downloadingZip" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              <div v-else class="btn-spinner"></div>
              {{ downloadingZip ? 'Preparing Zip...' : 'Download All Photos' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Video Highlight -->
      <section v-if="event.video_url" class="section video-section">
        <div class="container">
          <h2 class="section-title reveal">Video <span class="gradient-text">Highlight</span></h2>
          <div class="video-container reveal reveal-delay-1">
            <iframe
              v-if="isVideoEmbed(event.video_url)"
              :src="getEmbedUrl(event.video_url)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <video v-else :src="getMediaUrl(event.video_url)" controls class="local-video"></video>
          </div>
        </div>
      </section>

      <!-- Photo Gallery -->
      <section class="section photos-section">
        <div class="container">
          <h2 class="section-title reveal">Photo <span class="gradient-text">Gallery</span></h2>
          <div v-if="!event.photos || !event.photos.length" class="empty-gallery reveal reveal-delay-1">
            <p>No photos uploaded for this event yet.</p>
          </div>
          <div v-else class="photo-grid">
            <div
              v-for="(photo, i) in event.photos"
              :key="i"
              class="photo-item reveal"
              :style="{ '--delay': (i % 4) * 0.1 + 's' }"
            >
              <img :src="getMediaUrl(photo)" :alt="event.event_name + ' photo ' + (i+1)" loading="lazy" @click="openLightbox(photo, i)" />

              <!-- Action buttons bar -->
              <div class="photo-actions">
                <!-- Expand / view -->
                <button class="photo-action-btn photo-btn-expand" @click="openLightbox(photo, i)" title="View full size">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </button>
                <!-- Download -->
                <button class="photo-action-btn photo-btn-download" @click.stop="downloadPhoto(photo, i)" title="Download photo">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                </button>
                <!-- Share -->
                <button class="photo-action-btn photo-btn-share" @click.stop="sharePhoto(photo, i)" :class="{ shared: sharedIndex === i }" title="Share">
                  <svg v-if="sharedIndex !== i" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
                <!-- Like -->
                <button class="photo-action-btn photo-btn-like" @click.stop="toggleLike(photo)" :class="{ liked: isLiked(photo) }" title="Like">
                  <svg width="15" height="15" viewBox="0 0 24 24" :fill="isLiked(photo) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Toast notification -->
    <transition name="toast">
      <div v-if="toastMsg" class="photo-toast">{{ toastMsg }}</div>
    </transition>

    <!-- Lightbox -->
    <transition name="lightbox">
      <div v-if="lightboxPhoto" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <button class="lightbox-nav lightbox-prev" @click="prevPhoto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button class="lightbox-nav lightbox-next" @click="nextPhoto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <div class="lightbox-content">
          <img :src="lightboxPhoto" alt="Full size photo" />
        </div>
        <!-- Lightbox action bar -->
        <div class="lightbox-actions">
          <button class="lb-action-btn" @click="downloadPhoto(event.photos[lightboxIndex], lightboxIndex)" title="Download">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
            Download
          </button>
          <button class="lb-action-btn" @click="sharePhoto(event.photos[lightboxIndex], lightboxIndex)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
          <button class="lb-action-btn" :class="{ 'lb-liked': isLiked(event.photos[lightboxIndex]) }" @click="toggleLike(event.photos[lightboxIndex])">
            <svg width="18" height="18" viewBox="0 0 24 24" :fill="isLiked(event.photos[lightboxIndex]) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
            </svg>
            {{ isLiked(event.photos[lightboxIndex]) ? 'Liked' : 'Like' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { eventsApi } from '@/services/api.js'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

const { initReveal, refresh } = useScrollReveal()
const route = useRoute()
const event = ref(null)
const loading = ref(true)
const lightboxPhoto = ref(null)
const lightboxIndex = ref(0)
const heroCopied = ref(false)
const sharedIndex = ref(null)
const toastMsg = ref('')
const likedPhotos = ref(new Set())
const downloadingZip = ref(false)

const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${url}`;
};

// Dynamic hero background using first event photo
const heroBgStyle = computed(() => {
  if (!event.value?.photos?.length) return {}
  return { '--hero-bg-img': `url("${getMediaUrl(event.value.photos[0])}")` }
})

async function loadEvent() {
  try {
    const res = await eventsApi.getById(route.params.idOrSlug)
    event.value = res.data
  } catch (err) {
    console.error('Failed to load event details:', err)
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

function isVideoEmbed(url) {
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')
}

function getEmbedUrl(url) {
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
  if (url.includes('youtu.be/'))            return url.replace('youtu.be/', 'youtube.com/embed/')
  if (url.includes('vimeo.com/'))           return url.replace('vimeo.com/', 'player.vimeo.com/video/')
  return url
}

function openLightbox(photo, index) {
  lightboxPhoto.value = getMediaUrl(photo)
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxPhoto.value = null
  document.body.style.overflow = ''
}

function prevPhoto() {
  const len = event.value.photos.length
  lightboxIndex.value = (lightboxIndex.value - 1 + len) % len
  lightboxPhoto.value = getMediaUrl(event.value.photos[lightboxIndex.value])
}

function nextPhoto() {
  const len = event.value.photos.length
  lightboxIndex.value = (lightboxIndex.value + 1) % len
  lightboxPhoto.value = getMediaUrl(event.value.photos[lightboxIndex.value])
}

// Share — copies current event page URL to clipboard
function shareEvent() {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    heroCopied.value = true
    showToast('Event link copied to clipboard!')
    setTimeout(() => { heroCopied.value = false }, 2500)
  })
}

async function downloadAllImages() {
  if (downloadingZip.value) return
  downloadingZip.value = true
  
  try {
    const eventId = event.value.slug || event.value.id
    const downloadUrl = `${import.meta.env.VITE_API_URL || 'https://fourk-production.onrender.com'}/api/events/${eventId}/download-all`
    
    // Create a hidden link and click it to trigger download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', '')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast('Download started...')
  } catch (err) {
    console.error('Download failed:', err)
    showToast('Failed to start download')
  } finally {
    setTimeout(() => {
      downloadingZip.value = false
    }, 2000)
  }
}

// Share photo — copies the event URL (so anyone can open the event room)
function sharePhoto(photo, index) {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    sharedIndex.value = index
    showToast('Event link copied to clipboard!')
    setTimeout(() => { sharedIndex.value = null }, 2000)
  })
}

// Download a single photo
async function downloadPhoto(photo, index) {
  const url = getMediaUrl(photo)
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    const ext = url.split('.').pop().split('?')[0] || 'jpg'
    a.download = `${event.value.event_name.replace(/\s+/g, '-')}-photo-${index + 1}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(objectUrl)
    showToast('Photo downloaded!')
  } catch {
    // Fallback: open in new tab
    window.open(url, '_blank')
  }
}

// Like / unlike a photo (stored in memory per session)
function isLiked(photo) {
  return likedPhotos.value.has(photo)
}

function toggleLike(photo) {
  if (likedPhotos.value.has(photo)) {
    likedPhotos.value.delete(photo)
    showToast('Removed from liked photos')
  } else {
    likedPhotos.value.add(photo)
    showToast('Added to liked photos ❤️')
  }
}

let toastTimer = null
function showToast(msg) {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 2400)
}

onMounted(() => {
  initReveal()
  loadEvent()
})
</script>

<style scoped>
/* ── Hero ─────────────────────────────────────────── */
.event-hero {
  position: relative;
  height: 60vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  padding: 60px 0;
  overflow: hidden;
  background-color: #0a0a0f;
}

/* Blurred photo background */
.event-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--hero-bg-img, none);
  background-size: cover;
  background-position: center;
  filter: blur(3px) brightness(0.6) saturate(1.1);
  transform: scale(1.08); /* avoids blur fringe */
  z-index: 0;
}

/* Gradient overlay on top of blurred image */
.event-hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.15) 0%,
    rgba(6, 182, 212, 0.10) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 1;
}

/* Extra bottom fade so text is always readable */
.event-hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%);
  z-index: 2;
}

.event-hero-content {
  position: relative;
  z-index: 3;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.88rem;
  margin-bottom: 20px;
  transition: color 0.2s;
  backdrop-filter: blur(6px);
}
.back-link:hover { color: #67e8f9; }

.event-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(10px);
  color: rgba(255,255,255,0.9);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 999px;
  margin-bottom: 14px;
}
.hero-badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #a78bfa;
  box-shadow: 0 0 8px #a78bfa;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.4; }
}

.event-title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  margin-bottom: 16px;
  font-family: var(--font-display);
  color: #fff;
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
}

.event-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(255,255,255,0.8);
  font-size: 0.92rem;
}

.hero-share-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(10px);
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}
.hero-share-btn:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.4); }

.hero-actions-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-download-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.hero-download-all-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  filter: brightness(1.1);
}

.hero-download-all-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: btn-spin 0.8s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
.hero-share-btn.copied { background: rgba(52,211,153,0.25); border-color: rgba(52,211,153,0.5); color: #6ee7b7; }

/* ── Video ────────────────────────────────────────── */
.video-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  aspect-ratio: 16/9;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-glow);
  background: #000;
}
.video-container iframe, .local-video { width: 100%; height: 100%; }

/* ── Gallery grid ─────────────────────────────────── */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.photo-item {
  aspect-ratio: 1/1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: var(--bg-card);
  group: true;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block;
}
.photo-item:hover img { transform: scale(1.08); }

/* Action buttons bar — slides up on hover */
.photo-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 14px 10px 12px;
  background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%);
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.28s ease, transform 0.28s ease;
  z-index: 2;
}

.photo-action-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.22);
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.photo-action-btn:hover { background: rgba(255,255,255,0.28); transform: scale(1.12); }

.photo-btn-download:hover { background: rgba(6,182,212,0.45); border-color: rgba(6,182,212,0.6); }
.photo-btn-share:hover, .photo-btn-share.shared   { background: rgba(139,92,246,0.45); border-color: rgba(139,92,246,0.6); }
.photo-btn-like:hover, .photo-btn-like.liked       { background: rgba(239,68,68,0.45); border-color: rgba(239,68,68,0.6); color: #fca5a5; }
.photo-btn-expand:hover { background: rgba(255,255,255,0.28); }

/* ── Empty state ──────────────────────────────────── */
.empty-gallery {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
}

/* ── Toast ────────────────────────────────────────── */
.photo-toast {
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

/* ── Lightbox ─────────────────────────────────────── */
.lightbox {
  position: fixed; inset: 0; z-index: 200000;
  background: rgba(0,0,0,0.95);
  display: flex; align-items: center; justify-content: center;
  padding: 40px; backdrop-filter: blur(10px);
  flex-direction: column;
  gap: 0;
}

.lightbox-content {
  max-width: 90%; max-height: calc(90vh - 80px);
  display: flex; align-items: center; justify-content: center;
  z-index: 200000;
}
.lightbox-content img {
  max-width: 100%; max-height: calc(90vh - 80px);
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 40px rgba(0,0,0,0.5);
}

.lightbox-close {
  position: absolute; top: 20px; right: 20px;
  background: rgba(255,255,255,0.1); border: none;
  color: #fff; width: 44px; height: 44px; border-radius: 50%;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.lightbox-close:hover { background: rgba(255,255,255,0.2); }

.lightbox-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.1); border: none;
  color: #fff; width: 50px; height: 50px; border-radius: 50%;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.lightbox-nav:hover { background: rgba(255,255,255,0.22); }
.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }

/* Lightbox action bar at bottom */
.lightbox-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0 0;
  z-index: 10;
}
.lb-action-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.85);
  font-size: 0.82rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  font-family: inherit;
}
.lb-action-btn:hover { background: rgba(255,255,255,0.18); }
.lb-action-btn.lb-liked { color: #fca5a5; border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.15); }

.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.3s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .photo-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .lightbox { padding: 20px; }
  .lightbox-nav { width: 40px; height: 40px; }
  .photo-actions { opacity: 1; transform: none; }
  .event-hero { min-height: 360px; }
  .lightbox-actions { gap: 6px; }
  .lb-action-btn { padding: 8px 13px; font-size: 0.78rem; }
}
</style>
