<template>
  <div class="page announcements-page">
    <!-- Page Header -->
    <div class="page-hero">
      <div class="hero-orb hero-orb-l"></div>
      <div class="hero-orb hero-orb-r"></div>
      <div class="container page-hero-content reveal">
        <span class="section-label">Stay Updated</span>
        <h1 class="page-title">
          News & <span class="gradient-text">Updates</span>
        </h1>
        <p class="page-subtitle">
          Stay up to date with the latest news, service launches, milestones,
          and announcements from 4K Production.
        </p>
      </div>
    </div>

    <!-- Category Filter -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-row">
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-btn"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <!-- Announcements -->
    <section class="section">
      <div class="container">
        <!-- Loading -->
        <div v-if="loading" class="ann-grid">
          <div
            v-for="n in 6"
            :key="n"
            class="skeleton"
            style="height:260px;border-radius:var(--radius-lg)"
          ></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-state glass-card">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{{ error }}</p>
          <button class="btn btn-outline" @click="loadAnnouncements">Try Again</button>
        </div>

        <!-- Empty -->
        <div v-else-if="!filteredItems.length" class="empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>No announcements in this category yet.</p>
        </div>

        <!-- List -->
        <div v-else>
          <!-- Featured (first) -->
          <div
            v-if="featuredItem"
            class="featured-announce glass-panel reveal"
          >
            <div class="fa-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Featured Announcement
            </div>
            <div class="fa-meta">
              <span class="glass-tag glass-tag-aqua">{{ featuredItem.category }}</span>
              <time class="fa-date">{{ formatDate(featuredItem.created_at) }}</time>
            </div>
            <h2 class="fa-title">{{ featuredItem.title }}</h2>
            <p class="fa-content">{{ featuredItem.content }}</p>
          </div>

          <!-- Regular grid -->
          <div class="ann-grid">
            <AnnouncementCard
              v-for="(ann, i) in regularItems"
              :key="ann.id"
              :announcement="ann"
              :delay="(i % 3) + 1"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter subscribe -->
    <section class="section">
      <div class="container">
        <div class="newsletter-card glass-panel">
          <div class="newsletter-orb"></div>
          <div class="newsletter-content">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="nl-icon">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div>
              <h3 class="nl-title">Stay in the Loop</h3>
              <p class="nl-subtitle">Get the latest news from 4K Production delivered directly to your inbox.</p>
            </div>
          </div>
          <router-link to="/contact" class="btn btn-primary btn-animated">
            Get In Touch
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import { announcementsApi } from '@/services/api.js'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

const { initReveal, refresh } = useScrollReveal()

const items          = ref([])
const loading        = ref(true)
const error          = ref(null)
const activeCategory = ref('All')

const categories = computed(() => {
  const cats = ['All', ...new Set(items.value.map(i => i.category).filter(Boolean))]
  return cats
})

const filteredItems = computed(() => {
  if (activeCategory.value === 'All') return items.value
  return items.value.filter(i => i.category === activeCategory.value)
})

const featuredItem = computed(() =>
  filteredItems.value.find(i => i.is_featured) || null
)

const regularItems = computed(() =>
  filteredItems.value.filter(i => !i.is_featured || i !== featuredItem.value)
)

async function loadAnnouncements() {
  loading.value = true
  error.value   = null
  try {
    const res = await announcementsApi.getAll()
    items.value = res.data || []
  } catch (err) {
    error.value = 'Failed to load announcements. Please try again.'
    // fallback static data
    items.value = [
      { id:1, title:'Grand Opening of Our New Studio!', content:'We are thrilled to announce the opening of our state-of-the-art 4K production studio in the heart of Kigali. Equipped with the latest RED cinema cameras, professional lighting rigs, and a fully soundproofed recording space, our new facility sets a new standard for multimedia production in the region. Book a studio tour today!', category:'Company News', is_featured:1, created_at:new Date().toISOString() },
      { id:2, title:'New Service: Live Streaming for Corporate Events', content:'4K Production is now offering full-scale live streaming services for corporate events, product launches, and conferences. Our team handles everything from multi-camera setups to real-time graphics and global broadcast distribution. Contact us to learn more about our live streaming packages.', category:'New Service', is_featured:1, created_at:new Date().toISOString() },
      { id:3, title:'Award: Best Documentary Production 2024', content:'We are incredibly honored to announce that our documentary "Voices of the Valley" has won the Best Documentary award at the National Film Festival 2024. This achievement reflects our team\'s dedication to authentic storytelling and cinematic excellence.', category:'Achievement', is_featured:0, created_at:new Date().toISOString() },
      { id:4, title:'Collaboration with Top Brands', content:'This quarter, 4K Production has successfully delivered commercial ad campaigns for 12 major brands across East Africa. Our creative team produced over 40 minutes of high-impact commercial content that drove measurable results for our clients.', category:'Milestone', is_featured:0, created_at:new Date().toISOString() }
    ]
    error.value = null
  } finally {
    loading.value = false
    await nextTick()
    initReveal()
    refresh()
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

watch(activeCategory, async () => {
  await nextTick()
  refresh()
})

onMounted(() => {
  initReveal()
  loadAnnouncements()
})
</script>

<style scoped>
/* Page hero */
.page-hero {
  position:    relative;
  min-height:  360px;
  display:     flex;
  align-items: flex-end;
  padding-bottom: clamp(48px, 7vw, 72px);
  padding-top:    calc(var(--nav-height) + 40px);
  text-align:  center;
  overflow:    hidden;
}

.hero-orb {
  position:      absolute;
  border-radius: 50%;
  filter:        blur(100px);
  opacity:       0.40;
}

.hero-orb-l { width:500px;height:500px;background:var(--clr-purple);top:-150px;left:-150px; }
.hero-orb-r { width:400px;height:400px;background:var(--clr-aqua);bottom:-100px;right:-100px; }

.page-hero-content { position:relative;z-index:1; }

.page-title {
  font-size:     clamp(2rem, 5vw, 3.5rem);
  font-weight:   800;
  margin:        12px 0 16px;
}

.page-subtitle {
  font-size:   clamp(1rem, 2vw, 1.1rem);
  color:       var(--text-secondary);
  max-width:   560px;
  margin:      0 auto;
  line-height: 1.7;
}

/* Filters */
.filter-section {
  padding: 28px 0 0;
  position: relative; z-index:1;
}

.filter-row {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             8px;
  flex-wrap:       wrap;
}

.filter-btn {
  padding:        8px 20px;
  border-radius:  var(--radius-full);
  font-size:      0.875rem;
  font-weight:    500;
  color:          var(--text-secondary);
  background:     var(--glass-bg);
  border:         var(--glass-border);
  cursor:         pointer;
  transition:     var(--transition-fast);
  backdrop-filter: blur(10px);
}

.filter-btn:hover { color:var(--text-primary); background:var(--bg-card-hover); }

.filter-btn.active {
  background:  var(--grad-primary);
  color:       #fff;
  border-color: transparent;
  box-shadow:  0 2px 12px rgba(139,92,246,0.4);
}

/* Featured announce */
.featured-announce {
  padding:       clamp(28px, 4vw, 48px);
  margin-bottom: 40px;
  position:      relative;
  overflow:      hidden;
}

.fa-badge {
  display:     inline-flex;
  align-items: center;
  gap:         6px;
  padding:     5px 14px;
  border-radius: var(--radius-full);
  background:  rgba(234,179,8,0.1);
  border:      1px solid rgba(234,179,8,0.2);
  color:       #fbbf24;
  font-size:   0.78rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.fa-meta {
  display:     flex;
  align-items: center;
  gap:         12px;
  margin-bottom: 16px;
}

.fa-date {
  font-size:  0.8rem;
  color:      var(--text-muted);
  font-style: normal;
}

.fa-title {
  font-size:     clamp(1.4rem, 3vw, 2rem);
  font-weight:   800;
  margin-bottom: 16px;
  line-height:   1.25;
}

.fa-content {
  font-size:   0.95rem;
  color:       var(--text-secondary);
  line-height: 1.8;
  max-width:   760px;
}

/* Announcements grid */
.ann-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2.5vw, 28px);
}

/* Error / empty states */
.error-state,
.empty-state {
  text-align:     center;
  padding:        60px 20px;
  color:          var(--text-muted);
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            16px;
}

/* Newsletter */
.newsletter-card {
  padding:     clamp(28px, 5vw, 48px);
  position:    relative;
  overflow:    hidden;
  display:     flex;
  align-items: center;
  justify-content: space-between;
  gap:         24px;
  flex-wrap:   wrap;
}

.newsletter-orb {
  position:      absolute;
  width:         300px;
  height:        300px;
  border-radius: 50%;
  background:    var(--clr-purple);
  filter:        blur(80px);
  opacity:       0.08;
  right:         -100px;
  top:           -100px;
  pointer-events: none;
}

.newsletter-content {
  display:     flex;
  align-items: center;
  gap:         20px;
}

.nl-icon { color:var(--clr-purple-light);flex-shrink:0; }

.nl-title {
  font-size:     1.2rem;
  font-weight:   700;
  margin-bottom: 4px;
}

.nl-subtitle {
  font-size: 0.9rem;
  color:     var(--text-secondary);
}

/* Responsive */
@media (max-width: 900px) {
  .ann-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .ann-grid { grid-template-columns: 1fr; }
  .newsletter-card { flex-direction: column; text-align: center; }
  .newsletter-content { flex-direction: column; text-align: center; }
}
</style>
