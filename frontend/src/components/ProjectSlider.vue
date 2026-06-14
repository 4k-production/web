<template>
  <section class="slider-section">
    <!-- Section header -->
    <div class="container slider-header reveal">
      <div class="header-left">
        <span class="section-label">Completed Work</span>
        <h2 class="section-title">
          Projects That <span class="gradient-text">Define Us</span>
        </h2>
        <p class="section-subtitle" style="text-align:left;margin:0;">
          Each project is a story — told through light, motion, and craft. Scroll through our most celebrated productions.
        </p>
      </div>
      <div class="header-right">
        <!-- Manual nav arrows -->
        <button class="slider-arrow" :disabled="transitioning" @click="prev" aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="slide-counter">
          <span class="counter-cur">{{ String(current + 1).padStart(2,'0') }}</span>
          <span class="counter-sep">/</span>
          <span class="counter-tot">{{ String(slides.length).padStart(2,'0') }}</span>
        </div>
        <button class="slider-arrow" :disabled="transitioning" @click="next" aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Slider track wrapper -->
    <div class="slider-viewport" @mouseenter="pauseAuto" @mouseleave="resumeAuto">

      <!-- Loading skeleton -->
      <div v-if="loading" class="slider-skeleton">
        <div class="skeleton sk-main"></div>
        <div class="sk-side">
          <div class="skeleton sk-card" v-for="n in 3" :key="n"></div>
        </div>
      </div>

      <!-- Main slider -->
      <div v-else class="slider-inner">

        <!-- FEATURED slide (large) -->
        <div class="slide-featured glass-card" @click="openLightbox(activeSlide)">
          <transition name="slide-fade" mode="out-in">
            <div :key="current" class="slide-featured-inner">
              <!-- Background image -->
              <img
                class="slide-bg-img"
                :src="getPreviewUrl(activeSlide)"
                :alt="activeSlide.title"
                @error="e => e.target.src = fallbackImg"
              />
              <!-- Dark gradient overlay -->
              <div class="slide-overlay"></div>

              <!-- Top badges -->
              <div class="slide-top-badges">
                <span class="slide-cat-badge">{{ activeSlide.category }}</span>
                <span v-if="activeSlide.is_featured" class="slide-feat-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Featured
                </span>
              </div>

              <!-- Play icon for video type -->
              <div v-if="activeSlide.media_type === 'video'" class="slide-play-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>

              <!-- Content overlay at bottom -->
              <div class="slide-content">
                <div class="slide-meta">
                  <span class="slide-num gradient-text">{{ String(current + 1).padStart(2,'0') }}</span>
                  <span v-if="activeSlide.client" class="slide-client">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {{ activeSlide.client }}
                  </span>
                </div>
                <h3 class="slide-title">{{ activeSlide.title }}</h3>
                <p v-if="activeSlide.description" class="slide-desc">
                  {{ truncate(activeSlide.description, 120) }}
                </p>
                <router-link to="/portfolio" class="slide-cta" @click.stop>
                  View Full Portfolio
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </transition>

          <!-- Progress bar -->
          <div class="slide-progress-wrap">
            <div
              class="slide-progress-fill"
              :style="{ width: progressPct + '%' }"
              :class="{ paused: isPaused }"
            ></div>
          </div>
        </div>

        <!-- THUMBNAIL stack (right column) -->
        <div class="slide-thumbs">
          <button
            v-for="(slide, i) in slides"
            :key="slide.id"
            class="slide-thumb"
            :class="{ active: i === current }"
            @click="goTo(i)"
          >
            <img
              :src="getPreviewUrl(slide)"
              :alt="slide.title"
              @error="e => e.target.src = fallbackImg"
            />
            <div class="thumb-overlay"></div>
            <div class="thumb-info">
              <span class="thumb-cat">{{ slide.category }}</span>
              <span class="thumb-title">{{ truncate(slide.title, 32) }}</span>
            </div>
            <!-- Active indicator bar -->
            <div class="thumb-active-bar"></div>
          </button>
        </div>

      </div>

      <!-- Dot indicators (mobile) -->
      <div class="slider-dots" v-if="!loading">
        <button
          v-for="(_, i) in slides"
          :key="i"
          class="slider-dot"
          :class="{ active: i === current }"
          @click="goTo(i)"
          :aria-label="`Slide ${i + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { portfolioApi } from '@/services/api.js'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { resolveMediaUrl as getMediaUrl } from '@/utils/resolveMediaUrl'


const { initReveal } = useScrollReveal()

// ─── State ─────────────────────────────────────
const slides       = ref([])
const loading      = ref(true)
const current      = ref(0)
const transitioning = ref(false)
const isPaused     = ref(false)
const progressPct  = ref(0)

const SLIDE_DURATION = 5000  // ms per slide
const TICK           = 50    // ms progress update interval
const fallbackImg    = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900'


// For preview/thumbnail display: videos show their thumbnail image, images show media_url
const getPreviewUrl = (slide) => {
  if (!slide) return ''
  if (slide.media_type === 'video' && slide.thumbnail) {
    return getMediaUrl(slide.thumbnail)
  }
  return getMediaUrl(slide.media_url)
}

let autoTimer    = null
let progressTimer = null

// ─── Fallback data ──────────────────────────────
const FALLBACK_SLIDES = [
  { id:1, title:'Sunrise Brand Campaign',       category:'Commercial',     media_url:'https://images.unsplash.com/photo-1536240478700-b869ad10e2c0?w=1200', client:'Sunrise Beverages',          is_featured:1, media_type:'image', description:'Full commercial ad production for Sunrise Beverages including concept development, 4K shooting and post-production.' },
  { id:2, title:'Mountain Heritage Documentary', category:'Documentary',   media_url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200', client:'Cultural Heritage Foundation', is_featured:1, media_type:'image', description:'A cinematic documentary exploring the cultural heritage of mountain communities, shot entirely in 4K RAW.' },
  { id:3, title:'Tech Summit 2024 Coverage',     category:'Event Coverage', media_url:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200', client:'AfriTech Summit',             is_featured:1, media_type:'image', description:'Complete multi-camera event coverage including keynote sessions, interviews and highlight reels.' },
  { id:4, title:'Fashion Week Motion Package',   category:'Motion Graphics',media_url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200', client:'Style Magazine',               is_featured:0, media_type:'image', description:'Dynamic motion graphics and lower thirds package for the annual Fashion Week broadcast on national TV.' },
  { id:5, title:'Corporate Brand Story',         category:'Video Production',media_url:'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=1200',client:'FuturePay Financial',           is_featured:1, media_type:'video', description:'Brand story video production for a leading financial services company launching across East Africa.' },
  { id:6, title:'Luxury Wedding Cinematic Film', category:'Photography',   media_url:'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200', client:'Private Client',               is_featured:0, media_type:'image', description:'Luxury wedding videography and photography package delivering a cinematic 4K feature film.' }
]

// ─── Computed ───────────────────────────────────
const activeSlide = computed(() => slides.value[current.value] ?? FALLBACK_SLIDES[0])

// ─── Helpers ────────────────────────────────────
function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

// ─── Navigation ────────────────────────────────
function goTo(index) {
  if (transitioning.value || index === current.value) return
  transitioning.value = true
  current.value       = index
  resetProgress()
  setTimeout(() => { transitioning.value = false }, 600)
}

function next() {
  goTo((current.value + 1) % slides.value.length)
}

function prev() {
  goTo((current.value - 1 + slides.value.length) % slides.value.length)
}

// ─── Auto-play + progress ───────────────────────
function resetProgress() {
  progressPct.value = 0
  clearInterval(progressTimer)
  if (!isPaused.value) startProgress()
}

function startProgress() {
  const steps = SLIDE_DURATION / TICK
  const inc   = 100 / steps
  progressTimer = setInterval(() => {
    if (progressPct.value >= 100) {
      clearInterval(progressTimer)
      next()
    } else {
      progressPct.value = Math.min(100, progressPct.value + inc)
    }
  }, TICK)
}

function pauseAuto() {
  isPaused.value = true
  clearInterval(progressTimer)
}

function resumeAuto() {
  isPaused.value = false
  startProgress()
}

// ─── Lightbox emit ──────────────────────────────
const emit = defineEmits(['open-lightbox'])
function openLightbox(item) {
  emit('open-lightbox', item)
}

// ─── Load data ──────────────────────────────────
async function load() {
  try {
    const res = await portfolioApi.getAll()
    const items = res.data || []
    slides.value = items.length >= 3 ? items : FALLBACK_SLIDES
  } catch {
    slides.value = FALLBACK_SLIDES
  } finally {
    loading.value = false
    await nextTick()
    initReveal()
    resetProgress()
  }
}

onMounted(() => {
  initReveal()
  load()
})

onUnmounted(() => {
  clearInterval(autoTimer)
  clearInterval(progressTimer)
})
</script>

<style scoped>
/* ─── Section ─────────────────────────────────── */
.slider-section {
  position:   relative;
  z-index:    1;
  padding:    var(--section-pad) 0;
  overflow:   hidden;
}

/* ─── Header row ──────────────────────────────── */
.slider-header {
  display:         flex;
  align-items:     flex-end;
  justify-content: space-between;
  gap:             24px;
  margin-bottom:   clamp(28px, 4vw, 48px);
  flex-wrap:       wrap;
}

.header-left { flex: 1; min-width: 260px; }

.header-right {
  display:     flex;
  align-items: center;
  gap:         12px;
  flex-shrink: 0;
}

/* Nav arrows */
.slider-arrow {
  width:           44px;
  height:          44px;
  border-radius:   50%;
  background:      var(--glass-bg);
  border:          var(--glass-border);
  color:           var(--text-secondary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  cursor:          pointer;
  transition:      var(--transition-fast);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.slider-arrow:hover:not(:disabled) {
  background:   rgba(139,92,246,0.15);
  border-color: var(--clr-purple);
  color:        var(--text-primary);
  transform:    scale(1.08);
}

.slider-arrow:disabled {
  opacity: 0.4;
  cursor:  not-allowed;
}

/* Counter */
.slide-counter {
  display:     flex;
  align-items: baseline;
  gap:         3px;
  font-family: var(--font-display);
  user-select: none;
}

.counter-cur {
  font-size:   1.5rem;
  font-weight: 800;
  background:  var(--grad-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.counter-sep {
  font-size: 1rem;
  color:     var(--text-muted);
  margin:    0 2px;
}

.counter-tot {
  font-size:  1rem;
  font-weight: 500;
  color:      var(--text-muted);
}

/* ─── Viewport ────────────────────────────────── */
.slider-viewport {
  padding: 0 clamp(16px, 4vw, 40px);
  max-width: 1200px;
  margin:    0 auto;
  position:  relative;
}

/* ─── Skeleton ────────────────────────────────── */
.slider-skeleton {
  display:               grid;
  grid-template-columns: 1fr 280px;
  gap:                   16px;
  height:                480px;
}

.sk-main {
  border-radius: var(--radius-xl);
  height:        100%;
}

.sk-side {
  display:        flex;
  flex-direction: column;
  gap:            12px;
}

.sk-card {
  flex:          1;
  border-radius: var(--radius-lg);
}

/* ─── Main layout ─────────────────────────────── */
.slider-inner {
  display:               grid;
  grid-template-columns: 1fr 280px;
  gap:                   16px;
  align-items:           stretch;
}

/* ─── Featured slide ──────────────────────────── */
.slide-featured {
  position:      relative;
  border-radius: var(--radius-xl);
  overflow:      hidden;
  cursor:        pointer;
  min-height:    480px;
  border:        1px solid rgba(139,92,246,0.2);
  /* no extra bg — the glass-card base handles it */
}

.slide-featured-inner {
  position:      absolute;
  inset:         0;
  display:       flex;
  flex-direction: column;
  justify-content: flex-end;
}

.slide-bg-img {
  position:   absolute;
  inset:      0;
  width:      100%;
  height:     100%;
  object-fit: cover;
  transition: transform 0.8s ease;
  z-index:    0;
}

.slide-featured:hover .slide-bg-img {
  transform: scale(1.04);
}

/* Gradient overlay */
.slide-overlay {
  position:   absolute;
  inset:      0;
  background: linear-gradient(
    to bottom,
    rgba(8,11,20,0.15) 0%,
    rgba(8,11,20,0.3)  40%,
    rgba(8,11,20,0.82) 80%,
    rgba(8,11,20,0.95) 100%
  );
  z-index:    1;
}

/* Top badges */
.slide-top-badges {
  position:  absolute;
  top:       20px;
  left:      20px;
  display:   flex;
  gap:       8px;
  z-index:   3;
}

.slide-cat-badge {
  display:        inline-flex;
  align-items:    center;
  padding:        5px 12px;
  border-radius:  var(--radius-full);
  font-size:      0.72rem;
  font-weight:    700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background:     rgba(6,182,212,0.18);
  border:         1px solid rgba(6,182,212,0.35);
  color:          var(--clr-aqua-light);
  backdrop-filter: blur(8px);
}

.slide-feat-badge {
  display:     inline-flex;
  align-items: center;
  gap:         4px;
  padding:     5px 12px;
  border-radius: var(--radius-full);
  font-size:   0.72rem;
  font-weight: 700;
  background:  rgba(234,179,8,0.18);
  border:      1px solid rgba(234,179,8,0.35);
  color:       #fbbf24;
  backdrop-filter: blur(8px);
}

/* Video play button */
.slide-play-btn {
  position:        absolute;
  top:             50%;
  left:            50%;
  transform:       translate(-50%, -50%);
  width:           72px;
  height:          72px;
  border-radius:   50%;
  background:      rgba(139,92,246,0.25);
  border:          2px solid rgba(139,92,246,0.5);
  backdrop-filter: blur(10px);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  z-index:         3;
  transition:      var(--transition-med);
  margin-left:     4px; /* optical center for play icon */
}

.slide-featured:hover .slide-play-btn {
  background:  rgba(139,92,246,0.5);
  border-color: var(--clr-purple-light);
  transform:   translate(-50%, -50%) scale(1.1);
}

/* Content */
.slide-content {
  position:  relative;
  z-index:   3;
  padding:   28px 28px 36px;
}

.slide-meta {
  display:     flex;
  align-items: center;
  gap:         12px;
  margin-bottom: 10px;
}

.slide-num {
  font-family: var(--font-display);
  font-size:   0.9rem;
  font-weight: 800;
  opacity:     0.8;
}

.slide-client {
  display:     flex;
  align-items: center;
  gap:         5px;
  font-size:   0.78rem;
  color:       rgba(255,255,255,0.65);
  font-weight: 500;
}

.slide-title {
  font-family:   var(--font-display);
  font-size:     clamp(1.4rem, 3vw, 2rem);
  font-weight:   800;
  color:         #fff;
  line-height:   1.15;
  margin-bottom: 10px;
}

.slide-desc {
  font-size:     0.875rem;
  color:         rgba(255,255,255,0.7);
  line-height:   1.65;
  margin-bottom: 18px;
  max-width:     520px;
}

.slide-cta {
  display:         inline-flex;
  align-items:     center;
  gap:             6px;
  font-size:       0.82rem;
  font-weight:     700;
  color:           var(--clr-aqua-light);
  text-decoration: none;
  padding:         7px 16px;
  border-radius:   var(--radius-full);
  background:      rgba(6,182,212,0.12);
  border:          1px solid rgba(6,182,212,0.25);
  transition:      var(--transition-fast);
}

.slide-cta:hover {
  background:   rgba(6,182,212,0.22);
  border-color: rgba(6,182,212,0.5);
  gap:          9px;
}

/* Progress bar */
.slide-progress-wrap {
  position:   absolute;
  bottom:     0;
  left:       0;
  right:      0;
  height:     3px;
  background: rgba(255,255,255,0.1);
  z-index:    4;
}

.slide-progress-fill {
  height:     100%;
  background: linear-gradient(90deg, var(--clr-purple), var(--clr-aqua));
  transition: width 0.05s linear;
  box-shadow: 0 0 8px rgba(139,92,246,0.6);
}

.slide-progress-fill.paused {
  opacity: 0.6;
}

/* ─── Slide transition ────────────────────────── */
.slide-fade-enter-active {
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  position:   absolute;
  inset:      0;
}
.slide-fade-enter-from {
  opacity:   0;
  transform: scale(1.03);
}
.slide-fade-leave-to {
  opacity:   0;
  transform: scale(0.97);
}

/* ─── Thumbnails ──────────────────────────────── */
.slide-thumbs {
  display:        flex;
  flex-direction: column;
  gap:            12px;
}

.slide-thumb {
  flex:          1;
  position:      relative;
  border-radius: var(--radius-lg);
  overflow:      hidden;
  cursor:        pointer;
  border:        1px solid var(--border-color);
  transition:    var(--transition-med);
  min-height:    0;
  background:    none;
  padding:       0;
}

.slide-thumb img {
  width:      100%;
  height:     100%;
  object-fit: cover;
  min-height: 100px;
  transition: transform 0.4s ease;
}

.slide-thumb:hover img,
.slide-thumb.active img {
  transform: scale(1.06);
}

.thumb-overlay {
  position:   absolute;
  inset:      0;
  background: linear-gradient(to top, rgba(8,11,20,0.85) 0%, rgba(8,11,20,0.2) 60%);
  transition: background 0.3s ease;
}

.slide-thumb.active .thumb-overlay {
  background: linear-gradient(to top, rgba(8,11,20,0.9) 0%, rgba(139,92,246,0.15) 100%);
}

.slide-thumb:hover .thumb-overlay {
  background: linear-gradient(to top, rgba(8,11,20,0.9) 0%, rgba(6,182,212,0.1) 100%);
}

.thumb-info {
  position: absolute;
  bottom:   0;
  left:     0;
  right:    0;
  padding:  10px 12px;
  z-index:  2;
}

.thumb-cat {
  display:        block;
  font-size:      0.62rem;
  font-weight:    700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color:          var(--clr-aqua-light);
  margin-bottom:  3px;
  opacity:        0.85;
}

.thumb-title {
  display:     block;
  font-size:   0.78rem;
  font-weight: 600;
  color:       #fff;
  line-height: 1.3;
}

/* Active indicator bar */
.thumb-active-bar {
  position:   absolute;
  left:       0;
  top:        0;
  bottom:     0;
  width:      3px;
  background: var(--grad-primary);
  border-radius: 0 2px 2px 0;
  transform:  scaleY(0);
  transition: transform 0.3s ease;
}

.slide-thumb.active {
  border-color: rgba(139,92,246,0.5);
  box-shadow:   0 4px 20px rgba(139,92,246,0.2);
}

.slide-thumb.active .thumb-active-bar {
  transform: scaleY(1);
}

/* ─── Dot indicators (mobile) ─────────────────── */
.slider-dots {
  display:         none;
  justify-content: center;
  gap:             8px;
  margin-top:      20px;
}

.slider-dot {
  width:         8px;
  height:        8px;
  border-radius: 50%;
  background:    var(--border-color);
  border:        none;
  cursor:        pointer;
  padding:       0;
  transition:    all 0.25s ease;
}

.slider-dot.active {
  background:  var(--grad-primary);
  width:       24px;
  border-radius: 4px;
}

/* ─── Responsive ──────────────────────────────── */
@media (max-width: 900px) {
  .slider-inner {
    grid-template-columns: 1fr;
  }

  .slide-thumbs  { display: none; }
  .slider-dots   { display: flex; }

  .slide-featured { min-height: 400px; }
}

@media (max-width: 600px) {
  .slide-featured { min-height: 320px; }
  .slider-header  { flex-direction: column; align-items: flex-start; }
  .slide-title    { font-size: 1.3rem; }
  .slide-desc     { display: none; }
  .slide-content  { padding: 18px 18px 24px; }
}
</style>
