<template>
  <div class="page services-page">
    <!-- Page Header -->
    <div class="page-hero">
      <div class="page-hero-bg">
        <div class="orb orb-purple"></div>
        <div class="orb orb-aqua orb-2"></div>
      </div>
      <div class="container page-hero-content">
        <span class="section-label reveal">Our Services</span>
        <h1 class="page-title reveal reveal-delay-1">
          Multimedia Excellence, <span class="gradient-text">Every Frame</span>
        </h1>
        <p class="page-subtitle reveal reveal-delay-2">
          Eight specialized services designed to capture, craft, and communicate
          your story with world-class quality and creativity.
        </p>
      </div>
    </div>

    <!-- All Services -->
    <section class="section">
      <div class="container">
        <div class="services-full-grid">
          <div
            v-for="(service, i) in allServices"
            :key="service.title"
            class="service-full-card glass-card reveal"
            :class="`reveal-delay-${(i % 3) + 1}`"
          >
            <!-- Icon & Title -->
            <div class="sfc-header">
              <div class="sfc-icon" v-html="service.icon"></div>
              <div>
                <h2 class="sfc-title">{{ service.title }}</h2>
                <span class="glass-tag glass-tag-aqua sfc-tag">{{ service.tag }}</span>
              </div>
            </div>

            <!-- Description -->
            <p class="sfc-desc">{{ service.description }}</p>

            <!-- Feature list -->
            <ul class="sfc-features">
              <li v-for="feat in service.features" :key="feat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ feat }}
              </li>
            </ul>

            <!-- Divider -->
            <div class="sfc-divider glow-line"></div>

            <!-- Process -->
            <div class="sfc-process">
              <h4 class="sfc-process-title">Our Process</h4>
              <div class="sfc-steps">
                <div
                  v-for="(step, si) in service.process"
                  :key="step"
                  class="sfc-step"
                >
                  <span class="step-num">{{ si + 1 }}</span>
                  <span class="step-label">{{ step }}</span>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <router-link to="/request" class="btn btn-primary sfc-cta btn-animated">
              Request {{ service.title }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section why-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Our Edge</span>
          <h2 class="section-title">Why <span class="gradient-text">4K Production</span>?</h2>
          <p class="section-subtitle">We combine technical mastery with creative vision to produce results that stand out.</p>
        </div>

        <div class="why-grid">
          <div
            v-for="(reason, i) in whyUs"
            :key="reason.title"
            class="why-card glass-card reveal"
            :class="`reveal-delay-${(i % 4) + 1}`"
          >
            <div class="why-icon" v-html="reason.icon"></div>
            <h3 class="why-title">{{ reason.title }}</h3>
            <p class="why-desc">{{ reason.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="section">
      <div class="container text-center">
        <h2 class="section-title reveal">Ready to Start Your <span class="gradient-text">Project?</span></h2>
        <p class="section-subtitle reveal reveal-delay-1" style="margin-bottom:36px;">
          Let's discuss your vision and create something extraordinary together.
        </p>
        <div class="flex justify-center gap-16 flex-wrap reveal reveal-delay-2">
          <router-link to="/request" class="btn btn-primary btn-animated">Request a Service</router-link>
          <router-link to="/contact"  class="btn btn-outline">Contact Our Team</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

const { initReveal } = useScrollReveal()
onMounted(() => initReveal())

const allServices = [
  {
    title:   'Video Production',
    tag:     'Cinema-Grade',
    icon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
    description: 'We craft cinematic video productions that captivate audiences from the first frame to the last. Our full-service production covers concept development, scripting, filming in stunning 4K, and comprehensive post-production with professional color grading and sound design.',
    features: ['4K UHD & 6K RAW Shooting', 'Professional Lighting Design', 'Drone Aerial Footage', 'Color Grading & DI', 'Sound Design & Mixing', 'Fast 7-Day Delivery'],
    process:  ['Brief & Script', 'Pre-Production', 'Filming Days', 'Post-Production', 'Final Delivery']
  },
  {
    title:   'Photography',
    tag:     'Commercial',
    icon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    description: 'Professional photography that tells your story with striking visual impact. We handle brand campaigns, product photography, portraits, architectural shots, and editorial work with meticulous attention to light, composition, and narrative.',
    features: ['Studio & On-Location Shoots', 'Product & Brand Photography', 'Retouching & Color Work', 'RAW File Delivery', 'Commercial Licensing', 'Same-Day Delivery Available'],
    process:  ['Creative Brief', 'Location Scouting', 'Photo Shoot', 'Selection & Editing', 'Final Delivery']
  },
  {
    title:   'Event Coverage',
    tag:     'Full Coverage',
    icon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    description: 'Comprehensive event documentation capturing every highlight, emotion, and milestone. Our multi-camera approach ensures nothing is missed, from grand entrances to intimate moments, conferences to weddings.',
    features: ['Multi-Camera Setup', 'Live Highlight Reels', 'Same-Day Edit Available', 'Drone Coverage', 'Photo + Video Bundle', 'Dedicated Event Team'],
    process:  ['Event Planning', 'Equipment Setup', 'Full Event Coverage', 'Same-Day Highlights', 'Full Edit Delivery']
  },
  {
    title:   'Documentary Production',
    tag:     'Award-Winning',
    icon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    description: 'Powerful documentary storytelling that moves audiences and creates lasting impact. Our documentary team combines journalistic rigor with cinematic craft to produce films that resonate deeply and tell authentic human stories.',
    features: ['Investigative Research', 'Interview Direction', 'Location Documentary', 'Archival Integration', 'Festival-Ready Formats', 'International Distribution'],
    process:  ['Research & Development', 'Pre-Production', 'Principal Photography', 'Assembly Edit', 'Fine Cut & Delivery']
  },
  {
    title:   'Video Editing',
    tag:     'Post-Production',
    icon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    description: 'Professional video editing and post-production services for existing footage. We transform raw clips into polished, compelling content with expert colour grading, sound design, graphics, and visual effects.',
    features: ['Multi-Track Timeline Editing', 'Color Correction & Grading', 'Audio Mastering', 'VFX & Compositing', 'Motion Titles', 'Any Format Export'],
    process:  ['Footage Review', 'Rough Cut', 'Picture Lock', 'Color & Audio', 'Final Export']
  },
  {
    title:   'Motion Graphics',
    tag:     'Animation',
    icon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    description: 'Dynamic motion graphics and animation that elevate any visual production. From broadcast package design to social media animations, our artists create eye-catching, brand-aligned motion design.',
    features: ['2D & 3D Animation', 'Broadcast Packages', 'Logo Animations', 'Infographic Videos', 'Social Media Graphics', 'Lower Thirds & Titles'],
    process:  ['Concept & Storyboard', 'Design Frames', 'Animation', 'Sound Design', 'Final Render']
  },
  {
    title:   'Commercial Ads',
    tag:     'Brand Impact',
    icon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
    description: 'High-impact commercial productions for TV, digital platforms, and social media. We combine strategic brand insight with cinematic execution to create ads that stop the scroll, engage emotions, and drive real business results.',
    features: ['TV & Digital Ad Production', 'Brand Strategy Consulting', 'Product Launch Videos', 'Social Media Campaigns', 'Celebrity & Talent Direction', 'A/B Version Delivery'],
    process:  ['Brand Brief', 'Creative Concept', 'Pre-Production', 'Production Days', 'Post & Delivery']
  },
  {
    title:   'Live Streaming',
    tag:     'Broadcast',
    icon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M1 6l11 12 11-12"/><path d="M1 6h22"/><circle cx="12" cy="12" r="2"/></svg>`,
    description: 'Professional live broadcast solutions for corporate events, conferences, concerts, and special occasions. We handle the complete technical pipeline from multi-camera capture to global broadcast distribution with real-time graphics.',
    features: ['Multi-Platform Streaming', 'Multi-Camera Direction', 'Real-Time Graphics & Lower Thirds', 'CDN Distribution', 'Recording & Archive', '24/7 Technical Support'],
    process:  ['Technical Survey', 'Equipment Setup', 'Pre-Show Test', 'Live Broadcast', 'Recording Archive']
  }
]

const whyUs = [
  {
    title: 'Cinema-Grade Equipment',
    desc:  'We invest in the latest RED cameras, prime lenses, professional lighting, and aerial drones to ensure every shot is extraordinary.',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`
  },
  {
    title: 'Expert Creative Team',
    desc:  'Our directors, cinematographers, and editors each bring 5–15 years of professional experience to every project.',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  {
    title: 'On-Time Delivery',
    desc:  'We understand deadlines are non-negotiable. Our production pipeline is optimised to deliver on time, every time.',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
  },
  {
    title: 'Results-Driven Approach',
    desc:  'Beyond great visuals, we focus on content that achieves your business objectives and moves your target audience.',
    icon:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  }
]
</script>

<style scoped>
/* Page hero */
.page-hero {
  position:        relative;
  min-height:      380px;
  display:         flex;
  align-items:     flex-end;
  padding-bottom:  clamp(48px, 7vw, 80px);
  padding-top:     calc(var(--header-height) + 16px);
  overflow:        hidden;
  text-align:      center;
}

.page-hero-bg {
  position: absolute;
  inset:    0;
  z-index:  0;
}

.orb {
  position:      absolute;
  border-radius: 50%;
  filter:        blur(100px);
  opacity:       0.12;
}

.orb-purple {
  width:  500px;
  height: 500px;
  background: var(--clr-purple);
  top:    -200px;
  left:   -100px;
}

.orb-aqua {
  width:  400px;
  height: 400px;
  background: var(--clr-aqua);
  top:    -150px;
  right:  -100px;
}

.page-hero-content {
  position:   relative;
  z-index:    1;
}

.page-title {
  font-size:     clamp(2rem, 5vw, 3.5rem);
  font-weight:   800;
  margin:        12px 0 16px;
}

.page-subtitle {
  font-size:  clamp(1rem, 2vw, 1.15rem);
  color:      var(--text-secondary);
  max-width:  600px;
  margin:     0 auto;
  line-height: 1.7;
}

/* Services grid */
.services-full-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(20px, 3vw, 32px);
}

.service-full-card {
  padding: clamp(24px, 4vw, 36px);
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Header row */
.sfc-header {
  display:     flex;
  align-items: center;
  gap:         16px;
  margin-bottom: 20px;
}

.sfc-icon {
  width:           56px;
  height:          56px;
  flex-shrink:     0;
  border-radius:   var(--radius-md);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  box-shadow:      0 4px 20px rgba(139,92,246,0.35);
}

.sfc-title {
  font-size:     1.25rem;
  font-weight:   700;
  color:         var(--text-primary);
  margin-bottom: 6px;
}

.sfc-tag { font-size: 0.72rem; }

/* Description */
.sfc-desc {
  font-size:     0.9rem;
  color:         var(--text-secondary);
  line-height:   1.75;
  margin-bottom: 20px;
}

/* Features */
.sfc-features {
  list-style:     none;
  display:        grid;
  grid-template-columns: 1fr 1fr;
  gap:            8px;
  margin-bottom:  24px;
}

.sfc-features li {
  display:     flex;
  align-items: center;
  gap:         7px;
  font-size:   0.82rem;
  color:       var(--text-secondary);
}

.sfc-features li svg { flex-shrink: 0; color: var(--clr-aqua-light); }

.sfc-divider {
  margin-bottom: 20px;
  width:         100%;
  height:        1px;
  background:    linear-gradient(90deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2), transparent);
}

/* Process */
.sfc-process-title {
  font-size:     0.78rem;
  font-weight:   700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color:         var(--clr-aqua-light);
  margin-bottom: 12px;
}

.sfc-steps {
  display:   flex;
  align-items: center;
  gap:       8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.sfc-step {
  display:     flex;
  align-items: center;
  gap:         6px;
  font-size:   0.78rem;
  color:       var(--text-secondary);
  position:    relative;
}

.sfc-step:not(:last-child)::after {
  content:    '→';
  color:      var(--clr-purple-light);
  margin-left: 6px;
  opacity:    0.5;
}

.step-num {
  width:         20px;
  height:        20px;
  border-radius: 50%;
  background:    rgba(139,92,246,0.15);
  border:        1px solid rgba(139,92,246,0.25);
  display:       flex;
  align-items:   center;
  justify-content: center;
  font-size:     0.7rem;
  font-weight:   700;
  color:         var(--clr-purple-light);
  flex-shrink:   0;
}

.sfc-cta {
  margin-top:  auto;
  width:       100%;
  justify-content: center;
  padding:     12px;
}

/* Why Us */
.why-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(16px, 2.5vw, 24px);
}

.why-card {
  padding:   24px;
  text-align: center;
}

.why-icon {
  width:           52px;
  height:          52px;
  margin:          0 auto 16px;
  border-radius:   var(--radius-md);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
}

.why-title {
  font-size:     1rem;
  font-weight:   700;
  margin-bottom: 10px;
}

.why-desc {
  font-size:   0.875rem;
  color:       var(--text-secondary);
  line-height: 1.65;
}

/* Responsive */
@media (max-width: 1024px) {
  .why-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .services-full-grid { grid-template-columns: 1fr; }
  .sfc-features        { grid-template-columns: 1fr; }
  .why-grid            { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 500px) {
  .why-grid { grid-template-columns: 1fr; }
}
</style>
