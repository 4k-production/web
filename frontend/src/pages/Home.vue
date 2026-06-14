<template>
  <div class="page home-page">

    <!-- ① Hero -->
    <HeroSection />

    <!-- ② Project Slider — between Hero and Services -->
    <ProjectSlider @open-lightbox="openLightbox" />

    <!-- ③ Services Preview -->
    <section class="section services-preview">
      <div class="container">
        <div class="section-header">
          <span class="section-label">What We Do</span>
          <h2 class="section-title">World-Class <span class="gradient-text">Multimedia Services</span></h2>
          <p class="section-subtitle">From concept to final cut — we handle every aspect of your multimedia production with precision and artistry.</p>
        </div>

        <div class="grid-3 services-grid">
          <ServiceCard
            v-for="(svc, i) in previewServices"
            :key="svc.title"
            :service="svc"
            :delay="(i % 3) + 1"
          />
        </div>

        <div class="text-center" style="margin-top: 48px;">
          <router-link to="/services" class="btn btn-outline">
            View All Services
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ④ Media Showcase — between Services and Stats -->
    <MediaShowcase />

    <!-- ⑤ Stats Band -->
    <section class="section stats-section">
      <div class="stats-band">
        <div class="container">
          <div class="stats-row">
            <div
              v-for="(stat, i) in companyStats"
              :key="stat.label"
              class="stat-card reveal"
              :class="`reveal-delay-${i + 1}`"
            >
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑥ Portfolio Preview -->
    <section class="section portfolio-preview">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Our Work</span>
          <h2 class="section-title">Featured <span class="gradient-text">Portfolio</span></h2>
          <p class="section-subtitle">A glimpse of the stories we've crafted for brands, organizations, and creators.</p>
        </div>

        <div v-if="loadingPortfolio" class="portfolio-grid grid-3">
          <div v-for="n in 3" :key="n" class="skeleton" style="aspect-ratio:16/10;border-radius:var(--radius-lg)"></div>
        </div>

        <div v-else class="portfolio-grid grid-3">
          <PortfolioCard
            v-for="(item, i) in portfolioItems"
            :key="item.id"
            :item="item"
            :delay="(i % 3) + 1"
            @open="openLightbox"
          />
        </div>

        <div class="text-center" style="margin-top:48px;">
          <router-link to="/portfolio" class="btn btn-outline">
            View Full Portfolio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ⑦ Testimonials -->
    <section class="section testimonials-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Client Love</span>
          <h2 class="section-title">What Our <span class="gradient-text">Clients Say</span></h2>
        </div>

        <div class="testimonials-grid">
          <div
            v-for="(t, i) in testimonials"
            :key="t.name"
            class="testimonial-card glass-card reveal"
            :class="`reveal-delay-${(i % 3) + 1}`"
          >
            <div class="stars">
              <svg v-for="n in 5" :key="n" width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <blockquote class="testimonial-quote">"{{ t.quote }}"</blockquote>
            <div class="testimonial-author">
              <div class="author-avatar">{{ t.name.charAt(0) }}</div>
              <div>
                <div class="author-name">{{ t.name }}</div>
                <div class="author-role">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑧ CTA Banner -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-card glass-panel">
          <div class="cta-orb cta-orb-l"></div>
          <div class="cta-orb cta-orb-r"></div>
          <div class="cta-content">
            <span class="section-label">Ready to Create?</span>
            <h2 class="cta-title">Let's Bring Your <span class="gradient-text">Vision to Life</span></h2>
            <p class="cta-subtitle">Join 200+ satisfied clients who trusted 4K Production to tell their stories.</p>
            <div class="cta-actions">
              <router-link to="/request" class="btn btn-primary btn-animated">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Start Your Project
              </router-link>
              <router-link to="/contact" class="btn btn-glass">
                Talk to Our Team
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑨ Latest Announcements -->
    <section class="section announcements-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Latest News</span>
          <h2 class="section-title">Announcements & <span class="gradient-text">Updates</span></h2>
        </div>

        <div v-if="loadingNews" class="grid-3">
          <div v-for="n in 3" :key="n" class="skeleton" style="height:200px;border-radius:var(--radius-lg)"></div>
        </div>

        <div v-else class="grid-3">
          <AnnouncementCard
            v-for="(ann, i) in announcements"
            :key="ann.id"
            :announcement="ann"
            :delay="(i % 3) + 1"
          />
        </div>

        <div class="text-center" style="margin-top:40px;">
          <router-link to="/announcements" class="btn btn-outline">
            All Announcements
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ⑩ Contact Banner -->
    <section class="section contact-banner">
      <div class="container">
        <div class="contact-band glass-panel">
          <div class="contact-band-inner">
            <div class="contact-info">
              <div class="contact-item">
                <div class="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14 19.79 19.79 0 0 1 1.61 5.46 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l.46-.76a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div class="contact-item-label">Call Us</div>
                  <div class="contact-item-value">+250 782 000 001</div>
                </div>
              </div>
              <div class="contact-item">
                <div class="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <div class="contact-item-label">Email Us</div>
                  <div class="contact-item-value">4kproduction@gmail.com</div>
                </div>
              </div>
              <div class="contact-item">
                <div class="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <div class="contact-item-label">Visit Us</div>
                  <div class="contact-item-value">Kigali, Rwanda</div>
                </div>
              </div>
            </div>
            <router-link to="/contact" class="btn btn-primary btn-animated">
              Get In Touch Today
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox (shared between slider + portfolio) -->
    <transition name="lightbox">
      <div v-if="lightboxItem" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
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
              :src="resolveMediaUrl(lightboxItem.media_url || lightboxItem.src)"
              :alt="lightboxItem.title"
              @error="e => e.target.src='https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900'"
            />
          </div>
          <div class="lightbox-info">
            <span class="glass-tag glass-tag-purple">{{ lightboxItem.category }}</span>
            <h3>{{ lightboxItem.title }}</h3>
            <p v-if="lightboxItem.client">Client: {{ lightboxItem.client }}</p>
            <p v-if="lightboxItem.description">{{ lightboxItem.description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import HeroSection      from '@/components/HeroSection.vue'
import ProjectSlider    from '@/components/ProjectSlider.vue'
import MediaShowcase    from '@/components/MediaShowcase.vue'
import ServiceCard      from '@/components/ServiceCard.vue'
import PortfolioCard    from '@/components/PortfolioCard.vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import { portfolioApi, announcementsApi } from '@/services/api.js'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { resolveMediaUrl } from '@/utils/resolveMediaUrl'


const { initReveal, refresh } = useScrollReveal()

// ─── Services Preview Data ────────────────────
const previewServices = [
  {
    title: 'Video Production',
    description: 'Cinematic 4K video production from concept to final cut, tailored to your brand and message.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
    features: ['4K RAW Shooting', 'Color Grading', 'Professional Sound', 'Fast Delivery']
  },
  {
    title: 'Photography',
    description: 'Stunning professional photography for brands, events, products, and personal projects.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    features: ['Studio & Location', 'Commercial Shoots', 'Retouching', 'Same-day Edits']
  },
  {
    title: 'Event Coverage',
    description: 'Comprehensive event documentation capturing every key moment of your special occasion.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    features: ['Multi-camera Setup', 'Live Highlight Reels', 'Same-day Delivery', 'Drone Coverage']
  },
  {
    title: 'Motion Graphics',
    description: 'Eye-catching motion graphics, animations, and visual effects for any platform.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    features: ['2D & 3D Animation', 'Logo Reveals', 'Social Media Graphics', 'Lower Thirds']
  },
  {
    title: 'Commercial Ads',
    description: 'High-impact commercial productions for TV, digital, and social media campaigns.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
    features: ['TV & Web Ads', 'Brand Storytelling', 'Product Launches', 'Campaign Strategy']
  },
  {
    title: 'Live Streaming',
    description: 'Professional live broadcast solutions for corporate events, concerts, and virtual conferences.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6l11 12 11-12"/><path d="M1 6h22"/><circle cx="12" cy="12" r="2"/></svg>`,
    features: ['Multi-platform', 'Real-time Graphics', 'Encoding & CDN', 'Technical Support']
  }
]

const companyStats = [
  { number: '500+', label: 'Projects Completed' },
  { number: '200+', label: 'Happy Clients'       },
  { number: '8+',   label: 'Years Experience'    },
  { number: '15+',  label: 'Industry Awards'     }
]

const testimonials = [
  { quote: 'The team at 4K Production completely transformed how we present our brand. The commercial they produced exceeded every expectation we had.', name: 'Amelia Okonkwo',       role: 'Marketing Director, Sunrise Beverages'   },
  { quote: 'Incredible attention to detail, fast delivery, and a truly cinematic result. Our documentary received national recognition thanks to their work.', name: 'Dr. Jean-Paul Habimana', role: 'Director, Cultural Heritage Foundation'  },
  { quote: 'The live streaming setup for our summit was flawless. 5,000+ remote attendees and zero technical issues. Absolutely professional.',              name: 'Miriam Wanjiku',       role: 'Events Manager, AfriTech Summit'         }
]

// ─── API data ─────────────────────────────────
const portfolioItems   = ref([])
const loadingPortfolio = ref(true)
const announcements    = ref([])
const loadingNews      = ref(true)
const lightboxItem     = ref(null)

async function loadPortfolio() {
  try {
    const res = await portfolioApi.getAll()
    portfolioItems.value = (res.data || []).slice(0, 3)
  } catch {
    portfolioItems.value = [
      { id:1, title:'Sunrise Brand Campaign',       category:'Commercial',    media_url:'https://images.unsplash.com/photo-1536240478700-b869ad10e2c0?w=800', client:'Sunrise Beverages',          is_featured:1 },
      { id:2, title:'Mountain Heritage Documentary', category:'Documentary',  media_url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', client:'Cultural Heritage Foundation', is_featured:1 },
      { id:3, title:'Tech Summit 2024',              category:'Event Coverage',media_url:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', client:'AfriTech Summit',             is_featured:1 }
    ]
  } finally {
    loadingPortfolio.value = false
    await nextTick()
    refresh()
  }
}

async function loadAnnouncements() {
  try {
    const res = await announcementsApi.getFeatured()
    announcements.value = (res.data || []).slice(0, 3)
  } catch {
    announcements.value = [
      { id:1, title:'Grand Opening of Our New Studio!', content:'We are thrilled to announce the opening of our state-of-the-art 4K production studio.', category:'Company News', is_featured:1, created_at: new Date().toISOString() },
      { id:2, title:'New Service: Live Streaming',      content:'4K Production is now offering full-scale live streaming services for corporate events.',  category:'New Service',  is_featured:1, created_at: new Date().toISOString() },
      { id:3, title:'Award: Best Documentary 2024',     content:'Our documentary won Best Documentary at the National Film Festival 2024.',               category:'Achievement',  is_featured:0, created_at: new Date().toISOString() }
    ]
  } finally {
    loadingNews.value = false
    await nextTick()
    refresh()
  }
}

function openLightbox(item) {
  lightboxItem.value = item
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxItem.value = null
  document.body.style.overflow = ''
}

onMounted(async () => {
  initReveal()
  await Promise.all([loadPortfolio(), loadAnnouncements()])
})
</script>

<style scoped>
/* Stats band */
.stats-band {
  background:    linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.06));
  border-top:    1px solid rgba(139,92,246,0.15);
  border-bottom: 1px solid rgba(6,182,212,0.1);
  padding:       clamp(40px, 6vw, 64px) 0;
}

.stats-row {
  display:         flex;
  justify-content: center;
  gap:             clamp(20px, 4vw, 60px);
  flex-wrap:       wrap;
}

.stats-row .stat-card {
  flex:      1;
  min-width: 160px;
  max-width: 220px;
}

/* Testimonials */
.testimonials-grid {
  display:               grid;
  grid-template-columns: repeat(3, 1fr);
  gap:                   clamp(16px, 3vw, 28px);
}

.testimonial-card {
  padding:        28px;
  display:        flex;
  flex-direction: column;
  gap:            16px;
}

.stars { display: flex; gap: 3px; }

.testimonial-quote {
  font-size:   0.95rem;
  color:       var(--text-secondary);
  line-height: 1.75;
  font-style:  italic;
  flex:        1;
}

.testimonial-author {
  display:     flex;
  align-items: center;
  gap:         12px;
  padding-top: 16px;
  border-top:  1px solid var(--border-color);
}

.author-avatar {
  width:           40px;
  height:          40px;
  border-radius:   50%;
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  font-weight:     700;
  font-size:       1rem;
  color:           #fff;
  flex-shrink:     0;
}

.author-name { font-size: 0.9rem;  font-weight: 700; color: var(--text-primary); }
.author-role { font-size: 0.78rem; color: var(--text-muted); }

/* CTA */
.cta-card {
  padding:    clamp(48px, 8vw, 80px) clamp(24px, 6vw, 80px);
  text-align: center;
  position:   relative;
  overflow:   hidden;
}

.cta-orb {
  position:       absolute;
  border-radius:  50%;
  filter:         blur(80px);
  opacity:        0.15;
  pointer-events: none;
}

.cta-orb-l { width:400px; height:400px; background:var(--clr-purple); top:-150px; left:-150px; }
.cta-orb-r { width:350px; height:350px; background:var(--clr-aqua);   bottom:-100px; right:-100px; }

.cta-content  { position: relative; z-index: 1; }
.cta-title    { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; margin: 12px 0 16px; }
.cta-subtitle { font-size: 1rem; color: var(--text-secondary); margin-bottom: 36px; }

.cta-actions {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             16px;
  flex-wrap:       wrap;
}

/* Contact band */
.contact-band        { padding: clamp(28px, 5vw, 48px) clamp(24px, 5vw, 56px); }

.contact-band-inner {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  gap:             32px;
  flex-wrap:       wrap;
}

.contact-info {
  display:   flex;
  gap:       clamp(20px, 4vw, 48px);
  flex-wrap: wrap;
}

.contact-item {
  display:     flex;
  align-items: center;
  gap:         12px;
}

.contact-icon {
  width:           40px;
  height:          40px;
  border-radius:   var(--radius-md);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  flex-shrink:     0;
}

.contact-item-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-bottom: 2px; }
.contact-item-value { font-size: 0.9rem;  font-weight: 600; color: var(--text-primary); }

/* Lightbox */
.lightbox {
  position:   fixed;
  inset:      0;
  z-index:    9999;
  background: rgba(0,0,0,0.9);
  display:    flex;
  align-items:     center;
  justify-content: center;
  padding:    clamp(12px, 3vw, 24px);
  backdrop-filter: blur(8px);
  overflow-y: auto;
}

.lightbox-close {
  position:        fixed;
  top:             16px;
  right:           16px;
  z-index:         10000;
  width:           44px;
  height:          44px;
  border-radius:   var(--radius-full);
  background:      rgba(255,255,255,0.1);
  border:          1px solid rgba(255,255,255,0.2);
  color:           #fff;
  display:         flex;
  align-items:     center;
  justify-content: center;
  cursor:          pointer;
  transition:      var(--transition-fast);
}

.lightbox-close:hover { background: rgba(139,92,246,0.3); }

.lightbox-content {
  display:        grid;
  grid-template-columns: 1fr 300px;
  max-width:      960px;
  max-height:     calc(100vh - 48px);
  width:          100%;
  border-radius:  var(--radius-xl);
  overflow:       hidden;
  background:     var(--bg-secondary);
  border:         var(--glass-border);
  margin:         auto;
}

.lightbox-media {
  position:  relative;
  overflow:  hidden;
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
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.lightbox-info h3 { font-size: 1.3rem; }
.lightbox-info p  { font-size: 0.9rem; color: var(--text-secondary); }

.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.3s; }
.lightbox-enter-from,   .lightbox-leave-to     { opacity: 0; }

@media (max-width: 768px) {
  .lightbox-content {
    grid-template-columns: 1fr;
    max-height: calc(100vh - 32px);
  }
  .lightbox-media img,
  .lightbox-video {
    max-height: 55vw;
  }
}

/* Responsive */
@media (max-width: 900px) {
  .testimonials-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .contact-band-inner { flex-direction: column; text-align: center; }
  .contact-info       { justify-content: center; }
}
</style>
