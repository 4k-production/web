<template>
  <section class="hero">
    <!-- Animated background orbs -->
    <div class="hero-bg">
      <div class="orb orb-purple"></div>
      <div class="orb orb-aqua orb-2"></div>
      <div class="orb orb-mid orb-3"></div>
    </div>

    <!-- Grid overlay texture -->
    <div class="hero-grid-overlay"></div>

    <div class="container hero-container">
      <!-- Eyebrow label -->
      <div class="hero-badge floating-badge">
        <span class="badge-dot"></span>
        Professional Multimedia Services
      </div>

      <!-- Main headline -->
      <h1 class="hero-headline">
        <span class="line-1">Crafting Stories in</span>
        <span class="line-2">
          Stunning
          <span class="gradient-text hero-highlight">4K Reality</span>
        </span>
      </h1>

      <!-- Subtext -->
      <p class="hero-subtext">
        From cinematic documentaries to high-impact commercial campaigns —
        we deliver world-class multimedia production that moves audiences
        and drives results.
      </p>

      <!-- CTA Buttons -->
      <div class="hero-actions">
        <router-link to="/request" class="btn btn-primary btn-animated hero-btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Start Your Project
        </router-link>
        <router-link to="/portfolio" class="btn btn-outline hero-btn-outline">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          View Our Work
        </router-link>
      </div>

      <!-- Stats row -->
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-num gradient-text">{{ stats.projects }}+</span>
          <span class="hero-stat-label">Projects Done</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-num gradient-text">8+</span>
          <span class="hero-stat-label">Years Experience</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-num gradient-text">{{ stats.messages }}+</span>
          <span class="hero-stat-label">Happy Clients</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-num gradient-text">15+</span>
          <span class="hero-stat-label">Awards Won</span>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <div class="scroll-line"></div>
      <span>Scroll</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { statsApi } from '@/services/api.js'

const stats = ref({
  projects: 500,
  messages: 200,
  announcements: 10,
  requests: 50
})

async function loadStats() {
  try {
    const res = await statsApi.getPublicStats()
    if (res.success) {
      stats.value = {
        projects: res.data.portfolio_items || 500,
        messages: res.data.contact_messages || 200,
        announcements: res.data.announcements || 10,
        requests: res.data.service_requests || 50
      }
    }
  } catch (err) {
    console.error('Failed to load hero stats:', err)
  }
}

onMounted(loadStats)
</script>

<style scoped>
/* ─── Hero Section ───────────────────────────── */
.hero {
  position:        relative;
  min-height:      100vh;
  display:         flex;
  align-items:     center;
  overflow:        hidden;
  padding:         calc(var(--header-height) + 8px) 0 80px;
}

/* ─── Background ─────────────────────────────── */
.hero-bg {
  position:   absolute;
  inset:      0;
  z-index:    0;
  overflow:   hidden;
}

.orb {
  position:      absolute;
  border-radius: 50%;
  filter:        blur(100px);
  opacity:       0.35;
}

.orb-purple {
  width:      700px;
  height:     700px;
  background: var(--clr-purple);
  top:        -200px;
  left:       -200px;
  animation:  orbFloat 12s ease-in-out infinite;
}

.orb-aqua {
  width:      600px;
  height:     600px;
  background: var(--clr-aqua);
  bottom:     -200px;
  right:      -150px;
  animation:  orbFloat 10s ease-in-out 2s infinite;
}

.orb-mid {
  width:      400px;
  height:     400px;
  background: linear-gradient(135deg, var(--clr-purple), var(--clr-aqua));
  top:        40%;
  left:       50%;
  transform:  translate(-50%, -50%);
  animation:  orbFloat 14s ease-in-out 4s infinite;
}

[data-theme="light"] .orb {
  opacity: 0.30;
}

.hero-grid-overlay {
  position:           absolute;
  inset:              0;
  background-image:   linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
  background-size:    50px 50px;
  z-index:            0;
}

/* ─── Container ──────────────────────────────── */
.hero-container {
  position:   relative;
  z-index:    1;
  text-align: center;
}

/* ─── Badge ──────────────────────────────────── */
.hero-badge {
  display:        inline-flex;
  align-items:    center;
  gap:            8px;
  padding:        8px 20px;
  border-radius:  var(--radius-full);
  background:     rgba(139,92,246,0.1);
  border:         1px solid rgba(139,92,246,0.25);
  font-size:      0.85rem;
  font-weight:    600;
  color:          var(--clr-purple-light);
  margin-bottom:  32px;
  animation:      fadeInDown 0.8s ease both;
}

.badge-dot {
  width:         8px;
  height:        8px;
  border-radius: 50%;
  background:    var(--grad-primary);
  animation:     pulse 2s ease-in-out infinite;
}

/* ─── Headline ───────────────────────────────── */
.hero-headline {
  display:       flex;
  flex-direction: column;
  gap:           8px;
  font-size:     clamp(2.4rem, 7vw, 5rem);
  font-weight:   800;
  line-height:   1.08;
  margin-bottom: 28px;
}

.line-1 {
  animation: fadeInUp 0.9s ease both;
  color:     var(--text-primary);
}

.line-2 {
  animation: fadeInUp 0.9s ease 0.15s both;
}

.hero-highlight {
  display: inline-block;
}

/* ─── Subtext ────────────────────────────────── */
.hero-subtext {
  font-size:     clamp(1rem, 2.5vw, 1.2rem);
  color:         var(--text-secondary);
  max-width:     600px;
  margin:        0 auto 40px;
  line-height:   1.75;
  animation:     fadeInUp 0.9s ease 0.3s both;
}

/* ─── Actions ────────────────────────────────── */
.hero-actions {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             16px;
  margin-bottom:   64px;
  flex-wrap:       wrap;
  animation:       fadeInUp 0.9s ease 0.45s both;
}

.hero-btn-primary {
  padding:   14px 32px;
  font-size: 1rem;
}

.hero-btn-outline {
  padding:   14px 32px;
  font-size: 1rem;
}

/* ─── Stats ──────────────────────────────────── */
.hero-stats {
  display:         flex;
  justify-content: center;
  gap:             clamp(24px, 5vw, 64px);
  animation:       fadeInUp 0.9s ease 0.6s both;
  flex-wrap:       wrap;
}

.hero-stat {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            4px;
  position:       relative;
}

.hero-stat:not(:last-child)::after {
  content:   '';
  position:  absolute;
  right:     calc(-1 * clamp(12px, 2.5vw, 32px));
  top:       10%;
  height:    80%;
  width:     1px;
  background: var(--border-color);
}

.hero-stat-num {
  font-family: var(--font-display);
  font-size:   clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  line-height: 1;
}

.hero-stat-label {
  font-size:   0.8rem;
  color:       var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
}

/* ─── Scroll Indicator ───────────────────────── */
.scroll-indicator {
  position:        absolute;
  bottom:          32px;
  left:            50%;
  transform:       translateX(-50%);
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  gap:             8px;
  color:           var(--text-muted);
  font-size:       0.75rem;
  letter-spacing:  0.1em;
  text-transform:  uppercase;
  animation:       fadeIn 1s 1s both;
}

.scroll-line {
  width:         2px;
  height:        40px;
  background:    linear-gradient(var(--clr-purple), transparent);
  border-radius: 2px;
  animation:     pulse 2s ease-in-out infinite;
}

/* ─── Responsive ─────────────────────────────── */
@media (max-width: 600px) {
  .hero-btn-primary,
  .hero-btn-outline {
    width:      100%;
    justify-content: center;
  }

  .hero-actions { flex-direction: column; align-items: stretch; }
  .scroll-indicator { display: none; }
}
</style>
