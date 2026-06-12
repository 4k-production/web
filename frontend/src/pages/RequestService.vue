<template>
  <div class="page request-page">
    <!-- Page Hero -->
    <div class="page-hero">
      <div class="hero-orb hero-orb-l"></div>
      <div class="hero-orb hero-orb-r"></div>
      <div class="container page-hero-content reveal">
        <span class="section-label">Work With Us</span>
        <h1 class="page-title">
          Request a <span class="gradient-text">Service</span>
        </h1>
        <p class="page-subtitle">
          Tell us about your project and we'll craft the perfect production plan for you.
          We respond within 24 hours.
        </p>
      </div>
    </div>

    <!-- Main Section -->
    <section class="section main-section">
      <div class="container">
        <div class="request-grid">

          <!-- Left: services overview -->
          <div class="services-overview reveal reveal-left">
            <h2 class="overview-title">
              What <span class="gradient-text">We Offer</span>
            </h2>
            <p class="overview-text">
              Choose from our full range of professional multimedia services.
              Each production is custom-tailored to your goals, audience, and budget.
            </p>

            <div class="service-list">
              <div
                v-for="s in serviceList"
                :key="s.name"
                class="service-list-item"
              >
                <div class="sl-icon" v-html="s.icon"></div>
                <div>
                  <div class="sl-name">{{ s.name }}</div>
                  <div class="sl-desc">{{ s.desc }}</div>
                </div>
              </div>
            </div>

            <!-- Process steps -->
            <div class="process-box glass-card">
              <h4 class="process-title">How It Works</h4>
              <div class="process-steps">
                <div v-for="(step, i) in process" :key="step.label" class="process-step">
                  <div class="ps-num">{{ i + 1 }}</div>
                  <div>
                    <div class="ps-label">{{ step.label }}</div>
                    <div class="ps-desc">{{ step.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: form -->
          <div class="form-col reveal reveal-right">
            <div class="form-card glass-panel">
              <div class="form-card-header">
                <div class="form-header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="form-heading">Project Brief</h3>
                  <p class="form-subheading">Fill in your details and we'll be in touch.</p>
                </div>
              </div>

              <RequestForm />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Trust badges -->
    <section class="section trust-section">
      <div class="container">
        <div class="trust-grid">
          <div
            v-for="(trust, i) in trustItems"
            :key="trust.label"
            class="trust-item glass-card reveal"
            :class="`reveal-delay-${(i % 4) + 1}`"
          >
            <div class="trust-icon" v-html="trust.icon"></div>
            <div class="trust-label">{{ trust.label }}</div>
            <div class="trust-desc">{{ trust.desc }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import RequestForm from '@/components/RequestForm.vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

const { initReveal } = useScrollReveal()
onMounted(() => initReveal())

const serviceList = [
  { name: 'Video Production',      desc: 'Cinema-grade 4K productions',       icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>` },
  { name: 'Photography',           desc: 'Stunning professional photography',  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>` },
  { name: 'Event Coverage',         desc: 'Full event documentation',           icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  { name: 'Documentary Production', desc: 'Award-winning storytelling',         icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>` },
  { name: 'Video Editing',           desc: 'Professional post-production',       icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>` },
  { name: 'Motion Graphics',         desc: 'Dynamic animations & designs',      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>` },
  { name: 'Commercial Ads',          desc: 'High-impact brand campaigns',       icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>` },
  { name: 'Live Streaming',          desc: 'Professional broadcast solutions', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6l11 12 11-12"/><path d="M1 6h22"/><circle cx="12" cy="12" r="2"/></svg>` }
]

const process = [
  { label: 'Submit Your Request',   desc: 'Fill out the form with your project details.' },
  { label: 'We Review & Contact',   desc: 'Our team reviews within 24 hours and reaches out.' },
  { label: 'Proposal & Planning',   desc: 'We send a custom proposal and production plan.' },
  { label: 'Production Begins',     desc: 'We execute your project with precision and creativity.' }
]

const trustItems = [
  { label: '24-Hour Response', desc: 'We guarantee a response to every inquiry within one business day.', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { label: 'Custom Proposals', desc: 'Every project gets a tailored proposal built specifically for your needs.', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
  { label: 'Transparent Pricing', desc: 'No hidden fees. We discuss budget openly and work within yours.', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
  { label: '100% Satisfaction', desc: 'We revise until you\'re completely satisfied with the deliverable.', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` }
]
</script>

<style scoped>
/* Hero */
.page-hero {
  position:    relative;
  min-height:  360px;
  display:     flex;
  align-items: flex-end;
  padding-bottom: clamp(48px, 7vw, 72px);
  padding-top:    calc(var(--header-height) + 16px);
  text-align:  center;
  overflow:    hidden;
}

.hero-orb {
  position:      absolute;
  border-radius: 50%;
  filter:        blur(100px);
  opacity:       0.12;
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

/* Main grid */
.request-grid {
  display:     grid;
  grid-template-columns: 1fr 1.4fr;
  gap:         clamp(32px, 6vw, 64px);
  align-items: start;
}

/* Services overview */
.overview-title {
  font-size:     clamp(1.6rem, 3vw, 2.2rem);
  font-weight:   800;
  margin-bottom: 12px;
}

.overview-text {
  font-size:     0.95rem;
  color:         var(--text-secondary);
  line-height:   1.75;
  margin-bottom: 28px;
}

.service-list {
  display:        flex;
  flex-direction: column;
  gap:            12px;
  margin-bottom:  28px;
}

.service-list-item {
  display:     flex;
  align-items: center;
  gap:         12px;
  padding:     12px 16px;
  border-radius: var(--radius-md);
  background:  var(--glass-bg);
  border:      var(--glass-border);
  transition:  var(--transition-fast);
}

.service-list-item:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-glow);
}

.sl-icon {
  width:           36px;
  height:          36px;
  border-radius:   var(--radius-sm);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  flex-shrink:     0;
}

.sl-icon :deep(svg) { width:18px;height:18px; }

.sl-name {
  font-size:  0.9rem;
  font-weight: 600;
  color:      var(--text-primary);
}

.sl-desc {
  font-size: 0.78rem;
  color:     var(--text-muted);
  margin-top: 2px;
}

/* Process box */
.process-box {
  padding: 24px;
}

.process-title {
  font-size:     0.78rem;
  font-weight:   700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color:         var(--clr-aqua-light);
  margin-bottom: 16px;
}

.process-steps {
  display:        flex;
  flex-direction: column;
  gap:            16px;
}

.process-step {
  display:     flex;
  align-items: flex-start;
  gap:         12px;
}

.ps-num {
  width:           24px;
  height:          24px;
  border-radius:   50%;
  background:      var(--grad-primary);
  color:           #fff;
  font-size:       0.78rem;
  font-weight:     700;
  display:         flex;
  align-items:     center;
  justify-content: center;
  flex-shrink:     0;
  margin-top:      2px;
}

.ps-label {
  font-size:  0.875rem;
  font-weight: 600;
  color:      var(--text-primary);
  margin-bottom: 2px;
}

.ps-desc {
  font-size: 0.8rem;
  color:     var(--text-muted);
}

/* Form card */
.form-card {
  padding: clamp(28px, 4vw, 44px);
}

.form-card-header {
  display:     flex;
  align-items: center;
  gap:         16px;
  margin-bottom: 28px;
}

.form-header-icon {
  width:           48px;
  height:          48px;
  border-radius:   var(--radius-md);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  flex-shrink:     0;
}

.form-heading {
  font-size:   1.3rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.form-subheading {
  font-size: 0.85rem;
  color:     var(--text-muted);
}

/* Trust grid */
.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(16px, 2.5vw, 24px);
}

.trust-item {
  padding:    24px;
  text-align: center;
  display:    flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.trust-icon {
  width:           52px;
  height:          52px;
  border-radius:   var(--radius-md);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
}

.trust-icon :deep(svg) { width:24px;height:24px; }

.trust-label {
  font-size:  0.95rem;
  font-weight: 700;
  color:      var(--text-primary);
}

.trust-desc {
  font-size:   0.825rem;
  color:       var(--text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 1024px) {
  .trust-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .request-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .trust-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 440px) {
  .trust-grid { grid-template-columns: 1fr; }
}
</style>
