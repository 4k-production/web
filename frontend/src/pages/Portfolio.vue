<template>
  <div class="page portfolio-page">
    <!-- Page Header -->
    <div class="page-hero">
      <div class="page-hero-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>
      <div class="container page-hero-content reveal">
        <span class="section-label">Our Work</span>
        <h1 class="page-title">
          A Portfolio of <span class="gradient-text">Excellence</span>
        </h1>
        <p class="page-subtitle">
          Browse our collection of multimedia projects spanning commercial ads,
          documentaries, events, and more.
        </p>
      </div>
    </div>

    <!-- Filters -->
    <section class="filters-section">
      <div class="container">
        <div class="filter-bar">
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-btn"
            :class="{ active: activeCategory === cat }"
            @click="setCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <!-- Portfolio Grid -->
    <section class="section portfolio-section">
      <div class="container">
        <!-- Loading -->
        <div v-if="loading" class="portfolio-grid">
          <div
            v-for="n in 6"
            :key="n"
            class="skeleton"
            style="aspect-ratio:16/10;border-radius:var(--radius-lg)"
          ></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!filteredItems.length" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>No projects found in this category.</p>
        </div>

        <!-- Grid -->
        <transition-group
          v-else
          tag="div"
          name="portfolio-item"
          class="portfolio-grid"
        >
          <PortfolioCard
            v-for="(item, i) in filteredItems"
            :key="item.id"
            :item="item"
            :delay="(i % 3) + 1"
            @open="openLightbox"
          />
        </transition-group>
      </div>
    </section>

    <!-- Lightbox -->
    <transition name="lightbox">
      <div v-if="lightboxItem" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Prev / Next -->
        <button class="lightbox-nav lightbox-prev" @click="prevItem">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button class="lightbox-nav lightbox-next" @click="nextItem">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <div class="lightbox-content">
          <div class="lightbox-media">
            <!-- Video player -->
            <video
              v-if="lightboxItem.media_type === 'video'"
              :src="resolveMediaUrl(lightboxItem.media_url)"
              :poster="resolveMediaUrl(lightboxItem.thumbnail)"
              class="lightbox-video"
              controls
              autoplay
              playsinline
              @error="e => e.target.poster = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900'"
            ></video>
            <!-- Image -->
            <img
              v-else
              :src="resolveMediaUrl(lightboxItem.media_url)"
              :alt="lightboxItem.title"
              @error="e => e.target.src='https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900'"
            />
          </div>
          <div class="lightbox-info">
            <div class="lightbox-meta">
              <span class="glass-tag glass-tag-purple">{{ lightboxItem.category }}</span>
              <span v-if="lightboxItem.is_featured" class="glass-tag" style="background:rgba(234,179,8,0.15);border-color:rgba(234,179,8,0.3);color:#fbbf24;">
                ★ Featured
              </span>
            </div>
            <h3 class="lightbox-title">{{ lightboxItem.title }}</h3>
            <p v-if="lightboxItem.client" class="lightbox-client">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {{ lightboxItem.client }}
            </p>
            <p v-if="lightboxItem.description" class="lightbox-desc">{{ lightboxItem.description }}</p>
            <router-link to="/request" class="btn btn-primary lightbox-cta" @click="closeLightbox">
              Request Similar Project
            </router-link>
          </div>
        </div>
      </div>
    </transition>

    <!-- CTA -->
    <section class="section">
      <div class="container text-center">
        <h2 class="section-title reveal">Like What You See?</h2>
        <p class="section-subtitle reveal reveal-delay-1" style="margin-bottom:32px;">
          Let's create the next masterpiece together.
        </p>
        <router-link to="/request" class="btn btn-primary btn-animated reveal reveal-delay-2">
          Start Your Project
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import PortfolioCard from '@/components/PortfolioCard.vue'
import { portfolioApi } from '@/services/api.js'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { resolveMediaUrl } from '@/utils/resolveMediaUrl'


const { initReveal, refresh } = useScrollReveal()

const items          = ref([])
const loading        = ref(true)
const activeCategory = ref('All')
const categories     = ref(['All'])
const lightboxItem   = ref(null)
const lightboxIndex  = ref(0)

const filteredItems = computed(() => {
  if (activeCategory.value === 'All') return items.value
  return items.value.filter(i => i.category === activeCategory.value)
})

async function loadPortfolio() {
  try {
    const [itemsRes, catsRes] = await Promise.all([
      portfolioApi.getAll(),
      portfolioApi.getCategories()
    ])
    items.value      = itemsRes.data      || []
    categories.value = catsRes.data || ['All']
  } catch {
    // Fallback static data
    items.value = [
      { id:1, title:'Sunrise Brand Campaign',      category:'Commercial',    media_url:'https://images.unsplash.com/photo-1536240478700-b869ad10e2c0?w=800', client:'Sunrise Beverages',         is_featured:1, description:'Full commercial ad production for Sunrise Beverages.' },
      { id:2, title:'Mountain Heritage Documentary', category:'Documentary', media_url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', client:'Cultural Heritage Foundation', is_featured:1, description:'Cinematic documentary exploring cultural heritage.' },
      { id:3, title:'Tech Summit 2024',             category:'Event Coverage', media_url:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', client:'AfriTech Summit',           is_featured:1, description:'Complete event coverage for Africa\'s largest tech summit.' },
      { id:4, title:'Fashion Week Motion Graphics', category:'Motion Graphics', media_url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', client:'Style Magazine',             is_featured:0, description:'Dynamic motion graphics package for Fashion Week broadcast.' },
      { id:5, title:'Wedding Cinematic Film',        category:'Photography',  media_url:'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', client:'Private Client',             is_featured:0, description:'Luxury wedding videography and photography package.' },
      { id:6, title:'Corporate Brand Identity Video', category:'Commercial', media_url:'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=800', client:'FuturePay Financial',           is_featured:1, description:'Brand story video production for a leading financial company.' }
    ]
    categories.value = ['All', 'Commercial', 'Documentary', 'Event Coverage', 'Motion Graphics', 'Photography']
  } finally {
    loading.value = false
    await nextTick()
    initReveal()
    refresh()
  }
}


async function setCategory(cat) {
  activeCategory.value = cat
  await nextTick()
  refresh()
}

function openLightbox(item) {
  lightboxItem.value  = item
  lightboxIndex.value = filteredItems.value.findIndex(i => i.id === item.id)
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxItem.value = null
  document.body.style.overflow = ''
}

function prevItem() {
  const len = filteredItems.value.length
  lightboxIndex.value = (lightboxIndex.value - 1 + len) % len
  lightboxItem.value  = filteredItems.value[lightboxIndex.value]
}

function nextItem() {
  const len = filteredItems.value.length
  lightboxIndex.value = (lightboxIndex.value + 1) % len
  lightboxItem.value  = filteredItems.value[lightboxIndex.value]
}

// Keyboard navigation
function onKeydown(e) {
  if (!lightboxItem.value) return
  if (e.key === 'ArrowLeft')  prevItem()
  if (e.key === 'ArrowRight') nextItem()
  if (e.key === 'Escape')     closeLightbox()
}

onMounted(() => {
  initReveal()
  loadPortfolio()
  window.addEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* Page hero */
.page-hero {
  position:     relative;
  min-height:   360px;
  display:      flex;
  align-items:  flex-end;
  padding-bottom: clamp(40px, 6vw, 70px);
  padding-top:    calc(var(--header-height) + 16px);
  overflow:       hidden;
  text-align:     center;
}

.page-hero-orbs {
  position: absolute;
  inset:    0;
  z-index:  0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter:   blur(100px);
  opacity:  0.12;
}

.orb-1 {
  width:  500px; height: 500px;
  background: var(--clr-purple);
  top: -150px; right: -100px;
}

.orb-2 {
  width:  400px; height: 400px;
  background: var(--clr-aqua);
  bottom: -150px; left: -100px;
}

.page-hero-content {
  position: relative;
  z-index:  1;
}

.page-title {
  font-size:     clamp(2rem, 5vw, 3.5rem);
  font-weight:   800;
  margin:        12px 0 16px;
}

.page-subtitle {
  font-size:  clamp(1rem, 2vw, 1.1rem);
  color:      var(--text-secondary);
  max-width:  560px;
  margin:     0 auto;
  line-height: 1.7;
}

/* Filters */
.filters-section {
  padding: 32px 0 0;
  position: relative;
  z-index: 1;
}

.filter-bar {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             8px;
  flex-wrap:       wrap;
  padding:         4px;
  background:      var(--glass-bg);
  border:          var(--glass-border);
  border-radius:   var(--radius-full);
  backdrop-filter: var(--glass-blur);
  margin:          0 auto;
}

@media (max-width: 600px) {
  .filters-section .container {
    padding: 0;
  }
  .filter-bar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 8px 16px;
    border-radius: 0;
    width: 100%;
    scrollbar-width: none;
  }
  .filter-bar::-webkit-scrollbar {
    display: none;
  }
}

.filter-btn {
  padding:        8px 20px;
  border-radius:  var(--radius-full);
  font-size:      0.875rem;
  font-weight:    500;
  color:          var(--text-secondary);
  background:     transparent;
  border:         none;
  cursor:         pointer;
  transition:     var(--transition-fast);
  white-space:    nowrap;
}

.filter-btn:hover {
  color:      var(--text-primary);
  background: var(--bg-card);
}

.filter-btn.active {
  color:      #fff;
  background: var(--grad-primary);
  box-shadow: 0 2px 12px rgba(139,92,246,0.4);
}

/* Portfolio grid */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2.5vw, 28px);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding:    80px 20px;
  color:      var(--text-muted);
  display:    flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Portfolio item transition */
.portfolio-item-enter-active,
.portfolio-item-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.portfolio-item-enter-from,
.portfolio-item-leave-to {
  opacity:   0;
  transform: scale(0.95);
}

/* Lightbox */
.lightbox {
  position:   fixed;
  inset:      0;
  z-index:    9999;
  background: rgba(0,0,0,0.92);
  display:    flex;
  align-items:     center;
  justify-content: center;
  padding:    clamp(12px, 3vw, 20px);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.lightbox-close {
  position:   fixed;
  top:        16px;
  right:      16px;
  z-index:    10000;
  width:      44px;
  height:     44px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.1);
  border:     1px solid rgba(255,255,255,0.15);
  color:      #fff;
  display:    flex;
  align-items:     center;
  justify-content: center;
  cursor:     pointer;
  transition: var(--transition-fast);
}

.lightbox-close:hover { background: rgba(239,68,68,0.3); }

.lightbox-nav {
  position:   fixed;
  top:        50%;
  transform:  translateY(-50%);
  z-index:    10000;
  width:      48px;
  height:     48px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.08);
  border:     1px solid rgba(255,255,255,0.15);
  color:      #fff;
  display:    flex;
  align-items:     center;
  justify-content: center;
  cursor:     pointer;
  transition: var(--transition-fast);
}

.lightbox-nav:hover { background: rgba(139,92,246,0.3); }
.lightbox-prev { left:  16px; }
.lightbox-next { right: 16px; }

.lightbox-content {
  display:        grid;
  grid-template-columns: 1fr 320px;
  max-width:      960px;
  max-height:     calc(100vh - 48px);
  width:          100%;
  border-radius:  var(--radius-xl);
  overflow:       hidden;
  background:     var(--bg-secondary);
  border:         var(--glass-border);
  box-shadow:     var(--shadow-glow);
  margin:         auto;
}

.lightbox-media {
  position:   relative;
  overflow:   hidden;
  min-height: 260px;
  background: #000;
}

.lightbox-media img,
.lightbox-video {
  width:      100%;
  height:     100%;
  max-height: calc(100vh - 100px);
  object-fit: cover;
  display:    block;
}

.lightbox-video {
  object-fit: contain;
  background: #000;
}

.lightbox-info {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.lightbox-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.lightbox-title {
  font-size:   1.4rem;
  font-weight: 800;
  line-height: 1.2;
}

.lightbox-client {
  display:     flex;
  align-items: center;
  gap:         6px;
  font-size:   0.85rem;
  color:       var(--clr-aqua-light);
  font-weight: 500;
}

.lightbox-desc {
  font-size:   0.9rem;
  color:       var(--text-secondary);
  line-height: 1.7;
  flex:        1;
}

.lightbox-cta {
  margin-top:      auto;
  justify-content: center;
}

/* Lightbox transition */
.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.3s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 900px) {
  .portfolio-grid         { grid-template-columns: repeat(2, 1fr); }
  .lightbox-content       { grid-template-columns: 1fr; }
  .lightbox-media img,
  .lightbox-video         { max-height: 55vw; }
}

@media (max-width: 600px) {
  .portfolio-grid { grid-template-columns: 1fr; }
  .filter-btn     { font-size: 0.8rem; padding: 7px 14px; }
}
</style>
