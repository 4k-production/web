<template>
  <section class="media-showcase">
    <!-- Background ambient glow -->
    <div class="showcase-orb showcase-orb-l"></div>
    <div class="showcase-orb showcase-orb-r"></div>

    <div class="container">
      <!-- Section header -->
      <div class="section-header reveal">
        <span class="section-label">Visual Identity</span>
        <h2 class="section-title">
          Every Frame, a <span class="gradient-text">Masterpiece</span>
        </h2>
        <p class="section-subtitle">
          A curated glimpse at the images, motion and design work we craft for our clients — spanning cinema, photography and creative direction.
        </p>
      </div>

      <!-- Category filter pills -->
      <div class="showcase-filters reveal reveal-delay-1">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="filter-pill"
          :class="{ active: activeCat === cat.id }"
          @click="activeCat = cat.id"
        >
          <span v-html="cat.icon"></span>
          {{ cat.label }}
        </button>
      </div>

      <!-- Bento grid -->
      <div class="bento-grid reveal reveal-delay-2">
        <div
          v-for="(item, i) in visibleItems"
          :key="item.id"
          class="bento-cell"
          :class="[item.size, item.type]"
          @click="openItem(item)"
        >
          <!-- Media -->
          <img
            v-if="item.type !== 'design'"
            :src="item.src"
            :alt="item.title"
            class="bento-img"
            loading="lazy"
            @error="e => e.target.src = fallbackImg"
          />

          <!-- Design / graphic cell -->
          <div v-else class="bento-design-bg" :style="{ background: item.gradient }">
            <div class="design-pattern"></div>
          </div>

          <!-- Type badge -->
          <div class="bento-type-badge" :class="`badge-${item.type}`">
            <span v-html="typeBadgeIcon(item.type)"></span>
            {{ item.typeLabel }}
          </div>

          <!-- Hover overlay -->
          <div class="bento-overlay">
            <div class="bento-overlay-content">
              <!-- Play icon for video -->
              <div v-if="item.type === 'video'" class="bento-play">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <div v-else class="bento-zoom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
              <h4 class="bento-title">{{ item.title }}</h4>
              <span class="bento-cat">{{ item.category }}</span>
            </div>
          </div>

          <!-- Animated corner accent -->
          <div class="bento-corner-tl"></div>
          <div class="bento-corner-br"></div>
        </div>
      </div>

      <!-- View More CTA -->
      <div class="showcase-cta reveal">
        <router-link to="/portfolio" class="btn btn-outline showcase-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Explore Full Portfolio
        </router-link>
        <router-link to="/request" class="btn btn-primary btn-animated">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Start Your Project
        </router-link>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="lightbox-fade">
      <div v-if="lightboxItem" class="showcase-lightbox" @click.self="closeLightbox">
        <button class="lb-close" @click="closeLightbox">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="lb-content">
          <div class="lb-media">
            <!-- Video player -->
            <video
              v-if="lightboxItem.type === 'video'"
              :src="lightboxItem.videoSrc || lightboxItem.src"
              :poster="lightboxItem.src"
              class="lb-video"
              controls
              autoplay
              playsinline
            ></video>
            <!-- Image -->
            <img
              v-else-if="lightboxItem.type !== 'design'"
              :src="lightboxItem.src"
              :alt="lightboxItem.title"
              @error="e => e.target.src = fallbackImg"
            />
            <!-- Design bg -->
            <div v-else class="lb-design" :style="{ background: lightboxItem.gradient }">
              <div class="design-pattern lb-design-pattern"></div>
            </div>
          </div>
          <div class="lb-info">
            <span class="glass-tag glass-tag-purple">{{ lightboxItem.typeLabel }}</span>
            <h3>{{ lightboxItem.title }}</h3>
            <p>{{ lightboxItem.desc }}</p>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { portfolioApi } from '@/services/api.js'
import { resolveMediaUrl } from '@/utils/resolveMediaUrl'


const { initReveal } = useScrollReveal()
onMounted(() => {
  initReveal()
  loadPortfolioItems()
})

const fallbackImg   = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800'
const lightboxItem  = ref(null)
const activeCat     = ref('all')


// ─── Category filter tabs ───────────────────────
const categories = [
  { id: 'all',    label: 'All Work',   icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
  { id: 'image',  label: 'Photography', icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>` },
  { id: 'video',  label: 'Video',       icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>` },
  { id: 'design', label: 'Design',      icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>` }
]

// ─── Static fallback items ───────────────────────
const STATIC_ITEMS = [
  { id:1,  type:'image',  typeLabel:'Photography', size:'cell-large',  category:'Brand Campaign',    title:'Sunrise Brand Campaign',         src:'https://images.unsplash.com/photo-1536240478700-b869ad10e2c0?w=900',  videoSrc:null, desc:'Full 4K commercial photography for Sunrise Beverages brand relaunch.' },
  { id:2,  type:'video',  typeLabel:'Video',       size:'cell-tall',   category:'Documentary',        title:'Mountain Heritage Documentary',   src:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700',  videoSrc:null, desc:'Award-winning documentary shot in 4K RAW across mountain terrain.' },
  { id:3,  type:'image',  typeLabel:'Photography', size:'cell-normal', category:'Event Coverage',     title:'Tech Summit 2024',               src:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700',  videoSrc:null, desc:'Multi-camera event coverage for AfriTech Summit 2024.' },
  { id:4,  type:'design', typeLabel:'Motion',      size:'cell-normal', category:'Motion Graphics',    title:'Brand Identity Package',         src:null, gradient:'linear-gradient(135deg, #6d28d9 0%, #0891b2 100%)',         videoSrc:null, desc:'Complete motion graphics and brand identity system for a media company.' },
  { id:5,  type:'image',  typeLabel:'Photography', size:'cell-wide',   category:'Wedding Film',       title:'Luxury Wedding Cinematic',       src:'https://images.unsplash.com/photo-1519741497674-611481863552?w=900',  videoSrc:null, desc:'Cinematic wedding videography and photography in stunning 4K.' },
  { id:6,  type:'video',  typeLabel:'Commercial',  size:'cell-normal', category:'Commercial Ad',      title:'FuturePay Brand Video',          src:'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=700',  videoSrc:null, desc:'Corporate brand story video for financial services company launch.' },
  { id:7,  type:'design', typeLabel:'Design',      size:'cell-tall',   category:'Visual Design',      title:'Fashion Week Lower Thirds',      src:null, gradient:'linear-gradient(135deg, #d6249f 0%, #fdf497 100%)',         videoSrc:null, desc:'Dynamic animated lower thirds and broadcast graphics package.' },
  { id:8,  type:'image',  typeLabel:'Photography', size:'cell-normal', category:'Product Shoot',      title:'Product Photography Series',     src:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700',  videoSrc:null, desc:'High-end product photography with studio-grade lighting setup.' },
  { id:9,  type:'video',  typeLabel:'Live Stream', size:'cell-wide',   category:'Live Streaming',     title:'National Conference Livestream', src:'https://images.unsplash.com/photo-1492366254240-43affaefc3e3?w=900',  videoSrc:null, desc:'Multi-platform live streaming for a 5,000+ attendee national conference.' },
  { id:10, type:'image',  typeLabel:'Photography', size:'cell-normal', category:'Architecture',       title:'Studio Architecture Shoot',      src:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700',  videoSrc:null, desc:'Architectural photography of our new state-of-the-art production studio.' },
  { id:11, type:'design', typeLabel:'Design',      size:'cell-normal', category:'Brand Design',       title:'NGO Visual Campaign',            src:null, gradient:'linear-gradient(135deg, #0891b2 0%, #6d28d9 60%, #d6249f 100%)', videoSrc:null, desc:'Visual campaign design and motion content for an East African NGO.' },
  { id:12, type:'video',  typeLabel:'Video',       size:'cell-normal', category:'Music Video',        title:'Music Video — Afrobeats Artist', src:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700',  videoSrc:null, desc:'High-energy 4K music video production with choreography and VFX.' }
]

const CELL_SIZES = ['cell-normal', 'cell-wide', 'cell-tall', 'cell-normal', 'cell-normal', 'cell-wide', 'cell-large', 'cell-normal']
const allItems = ref([...STATIC_ITEMS])

async function loadPortfolioItems() {
  try {
    const res = await portfolioApi.getAll()
    const apiItems = (res.data || []).slice(0, 12)
    if (apiItems.length > 0) {
      const converted = apiItems.map((item, idx) => {
        const isVideo = item.media_type === 'video'
        const thumb   = item.thumbnail ? resolveMediaUrl(item.thumbnail) : null
        const mediaUrl = resolveMediaUrl(item.media_url)
        return {
          id:        `api-${item.id}`,
          type:      isVideo ? 'video' : 'image',
          typeLabel: isVideo ? 'Video' : 'Photography',
          size:      CELL_SIZES[idx % CELL_SIZES.length],
          category:  item.category || 'Production',
          title:     item.title,
          src:       isVideo ? (thumb || mediaUrl) : mediaUrl,
          videoSrc:  isVideo ? mediaUrl : null,
          desc:      item.description || ''
        }
      })
      allItems.value = converted
    }
  } catch {
    // Keep static fallback
  }
}

const visibleItems = computed(() => {
  if (activeCat.value === 'all') return allItems.value
  return allItems.value.filter(i => i.type === activeCat.value)
})

function typeBadgeIcon(type) {
  if (type === 'video')  return `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
  if (type === 'design') return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>`
  return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`
}

function openItem(item) {
  lightboxItem.value = item
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxItem.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
/* ─── Section ─────────────────────────────────── */
.media-showcase {
  position:   relative;
  z-index:    1;
  padding:    var(--section-pad) 0;
  overflow:   hidden;
}

/* Ambient orbs */
.showcase-orb {
  position:      absolute;
  border-radius: 50%;
  filter:        blur(120px);
  opacity:       0.07;
  pointer-events: none;
}

.showcase-orb-l {
  width:  500px;
  height: 500px;
  background: var(--clr-purple);
  top:    10%;
  left:   -200px;
}

.showcase-orb-r {
  width:  450px;
  height: 450px;
  background: var(--clr-aqua);
  bottom: 10%;
  right:  -180px;
}

/* ─── Filter pills ────────────────────────────── */
.showcase-filters {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             8px;
  flex-wrap:       wrap;
  margin-bottom:   clamp(32px, 5vw, 52px);
}

.filter-pill {
  display:         inline-flex;
  align-items:     center;
  gap:             6px;
  padding:         8px 20px;
  border-radius:   var(--radius-full);
  font-size:       0.85rem;
  font-weight:     500;
  color:           var(--text-secondary);
  background:      var(--glass-bg);
  border:          var(--glass-border);
  cursor:          pointer;
  transition:      var(--transition-fast);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.filter-pill:hover {
  color:        var(--text-primary);
  border-color: var(--border-glow);
}

.filter-pill.active {
  background:   var(--grad-primary);
  color:        #fff;
  border-color: transparent;
  box-shadow:   0 4px 18px rgba(139,92,246,0.4);
}

/* ─── Bento grid ──────────────────────────────── */
.bento-grid {
  display:               grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows:        220px;
  gap:                   12px;
  margin-bottom:         clamp(32px, 5vw, 52px);
}

/* Cell sizes */
.bento-cell.cell-normal { grid-column: span 1; grid-row: span 1; }
.bento-cell.cell-wide   { grid-column: span 2; grid-row: span 1; }
.bento-cell.cell-tall   { grid-column: span 1; grid-row: span 2; }
.bento-cell.cell-large  { grid-column: span 2; grid-row: span 2; }

/* ─── Cell base ───────────────────────────────── */
.bento-cell {
  position:      relative;
  border-radius: var(--radius-lg);
  overflow:      hidden;
  cursor:        pointer;
  background:    var(--bg-secondary);
  border:        1px solid var(--border-color);
  transition:    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                 box-shadow 0.35s ease,
                 border-color 0.3s ease;
}

.bento-cell:hover {
  transform:    translateY(-4px) scale(1.01);
  box-shadow:   0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.3);
  border-color: rgba(139,92,246,0.4);
  z-index:      2;
}

/* Image */
.bento-img {
  width:      100%;
  height:     100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.bento-cell:hover .bento-img {
  transform: scale(1.06);
}

/* Design bg */
.bento-design-bg {
  width:    100%;
  height:   100%;
  position: relative;
}

.design-pattern {
  position:         absolute;
  inset:            0;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                    radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size:  24px 24px, 12px 12px;
  background-position: 0 0, 12px 12px;
}

/* Type badge */
.bento-type-badge {
  position:        absolute;
  top:             10px;
  left:            10px;
  display:         inline-flex;
  align-items:     center;
  gap:             4px;
  padding:         4px 10px;
  border-radius:   var(--radius-full);
  font-size:       0.65rem;
  font-weight:     700;
  letter-spacing:  0.06em;
  text-transform:  uppercase;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index:         3;
  border:          1px solid;
  transition:      opacity 0.2s ease;
}

.badge-image {
  background:   rgba(6,182,212,0.15);
  border-color: rgba(6,182,212,0.3);
  color:        var(--clr-aqua-light);
}

.badge-video {
  background:   rgba(239,68,68,0.15);
  border-color: rgba(239,68,68,0.3);
  color:        #f87171;
}

.badge-design {
  background:   rgba(139,92,246,0.15);
  border-color: rgba(139,92,246,0.3);
  color:        var(--clr-purple-light);
}

/* Hover overlay */
.bento-overlay {
  position:   absolute;
  inset:      0;
  background: linear-gradient(to top,
    rgba(8,11,20,0.92) 0%,
    rgba(8,11,20,0.5)  50%,
    rgba(139,92,246,0.12) 100%
  );
  display:    flex;
  align-items:     center;
  justify-content: center;
  opacity:    0;
  transition: opacity 0.35s ease;
  z-index:    2;
}

.bento-cell:hover .bento-overlay { opacity: 1; }

.bento-overlay-content {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            8px;
  text-align:     center;
  padding:        16px;
  transform:      translateY(8px);
  transition:     transform 0.35s ease;
}

.bento-cell:hover .bento-overlay-content {
  transform: translateY(0);
}

.bento-play,
.bento-zoom {
  width:           48px;
  height:          48px;
  border-radius:   50%;
  background:      rgba(255,255,255,0.15);
  border:          2px solid rgba(255,255,255,0.4);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  margin-bottom:   4px;
  transition:      transform 0.2s ease, background 0.2s ease;
}

.bento-play { margin-left: 3px; } /* optical center */

.bento-cell:hover .bento-play,
.bento-cell:hover .bento-zoom {
  background: rgba(139,92,246,0.35);
  transform:  scale(1.12);
}

.bento-title {
  font-size:   0.88rem;
  font-weight: 700;
  color:       #fff;
  line-height: 1.3;
}

.bento-cat {
  font-size:   0.72rem;
  color:       var(--clr-aqua-light);
  font-weight: 500;
}

/* Corner accents (decorative) */
.bento-corner-tl,
.bento-corner-br {
  position:   absolute;
  width:      20px;
  height:     20px;
  opacity:    0;
  transition: opacity 0.3s ease;
  z-index:    4;
}

.bento-corner-tl {
  top:          0;
  left:         0;
  border-top:   2px solid var(--clr-purple-light);
  border-left:  2px solid var(--clr-purple-light);
  border-radius: var(--radius-lg) 0 0 0;
}

.bento-corner-br {
  bottom:        0;
  right:         0;
  border-bottom: 2px solid var(--clr-aqua-light);
  border-right:  2px solid var(--clr-aqua-light);
  border-radius: 0 0 var(--radius-lg) 0;
}

.bento-cell:hover .bento-corner-tl,
.bento-cell:hover .bento-corner-br {
  opacity: 1;
}

/* ─── CTA row ─────────────────────────────────── */
.showcase-cta {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             16px;
  flex-wrap:       wrap;
}

.showcase-btn { font-size: 0.9rem; }

/* ─── Lightbox ────────────────────────────────── */
.showcase-lightbox {
  position:   fixed;
  inset:      0;
  z-index:    9999;
  background: rgba(0,0,0,0.92);
  display:    flex;
  align-items:     center;
  justify-content: center;
  padding:    clamp(12px, 3vw, 24px);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.lb-close {
  position:   fixed;
  top:        16px;
  right:      16px;
  z-index:    10000;
  width:      44px;
  height:     44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border:     1px solid rgba(255,255,255,0.15);
  color:      #fff;
  display:    flex;
  align-items:     center;
  justify-content: center;
  cursor:     pointer;
  transition: var(--transition-fast);
}

.lb-close:hover { background: rgba(239,68,68,0.25); }

.lb-content {
  display:        grid;
  grid-template-columns: 1fr 300px;
  max-width:      900px;
  max-height:     calc(100vh - 48px);
  width:          100%;
  border-radius:  var(--radius-xl);
  overflow:       hidden;
  background:     var(--bg-secondary);
  border:         var(--glass-border);
  box-shadow:     var(--shadow-glow);
  margin:         auto;
}

.lb-media {
  position:   relative;
  overflow:   hidden;
  min-height: 240px;
  background: #000;
}

.lb-media img {
  width:      100%;
  height:     100%;
  max-height: calc(100vh - 100px);
  object-fit: cover;
  display:    block;
}

.lb-video {
  width:      100%;
  height:     100%;
  max-height: calc(100vh - 100px);
  object-fit: contain;
  background: #000;
  display:    block;
}

.lb-design {
  width:    100%;
  height:   100%;
  min-height: 300px;
  position:  relative;
}

.lb-design-pattern {
  position:         absolute;
  inset:            0;
  background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size:  20px 20px;
}

.lb-info {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.lb-info h3 { font-size: 1.25rem; font-weight: 800; }
.lb-info p  { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; flex: 1; }

/* Lightbox transition */
.lightbox-fade-enter-active { transition: opacity 0.3s ease; }
.lightbox-fade-leave-active { transition: opacity 0.25s ease; }
.lightbox-fade-enter-from,
.lightbox-fade-leave-to     { opacity: 0; }

/* ─── Responsive ──────────────────────────────── */
@media (max-width: 1100px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows:        200px;
  }
  .bento-cell.cell-large { grid-column: span 2; grid-row: span 2; }
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows:        180px;
  }
  .bento-cell.cell-large,
  .bento-cell.cell-wide  { grid-column: span 2; }
  .bento-cell.cell-tall  { grid-row: span 1; }
}

@media (max-width: 500px) {
  .bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows:        200px;
  }
  .bento-cell { grid-column: span 1 !important; grid-row: span 1 !important; }

  .lb-content {
    grid-template-columns: 1fr;
  }

  .lb-media img,
  .lb-video {
    max-height: 55vw;
  }
}

@media (max-width: 768px) {
  .lb-content {
    grid-template-columns: 1fr;
  }
  .lb-media img,
  .lb-video {
    max-height: 55vw;
  }
}
</style>
