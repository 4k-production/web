<template>
  <div class="page contact-page">
    <!-- Page Header -->
    <div class="page-hero">
      <div class="hero-orb hero-orb-l"></div>
      <div class="hero-orb hero-orb-r"></div>
      <div class="container page-hero-content reveal">
        <span class="section-label">Get In Touch</span>
        <h1 class="page-title">
          Let's Start a <span class="gradient-text">Conversation</span>
        </h1>
        <p class="page-subtitle">
          Have a project in mind? A question? Or just want to say hello?
          We'd love to hear from you.
        </p>
      </div>
    </div>

    <!-- Contact Section -->
    <section class="section contact-section">
      <div class="container">
        <div class="contact-grid">

          <!-- Contact Info -->
          <div class="contact-info-col reveal reveal-left">
            <h2 class="info-heading">
              We're <span class="gradient-text">Here for You</span>
            </h2>
            <p class="info-text">
              Our team is available Monday–Saturday, 8AM–6PM EAT. We typically
              respond to all messages within 24 hours.
            </p>

            <div class="contact-details">
              <div class="contact-detail-item" v-for="c in contactDetails" :key="c.label">
                <div class="detail-icon" v-html="c.icon"></div>
                <div>
                  <div class="detail-label">{{ c.label }}</div>
                  <div class="detail-value">{{ c.value }}</div>
                </div>
              </div>
            </div>

            <!-- Social links -->
            <div class="social-row">
              <span class="social-label">Follow Us</span>
              <div class="socials">
                <a href="#" class="social-pill" v-for="s in socials" :key="s.label" :aria-label="s.label">
                  <span v-html="s.icon"></span>
                  {{ s.label }}
                </a>
              </div>
            </div>

            <!-- Working hours -->
            <div class="hours-card glass-card">
              <h4 class="hours-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Studio Hours
              </h4>
              <div class="hours-list">
                <div class="hours-row" v-for="h in hours" :key="h.day">
                  <span class="hours-day">{{ h.day }}</span>
                  <span class="hours-time">{{ h.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-col reveal reveal-right">
            <div class="form-card glass-panel">
              <h3 class="form-heading">Send Us a Message</h3>
              <p class="form-subheading">Fill in the form and we'll get back to you promptly.</p>
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Map / Location -->
<section class="section location-section">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Find Us</span>
      <h2 class="section-title">Our <span class="gradient-text">Location</span></h2>
    </div>

    <div class="map-card glass-card reveal">
      <!-- Address bar above the map -->
      <div class="map-address-bar">
        <div class="map-address-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="map-address-text">
          <strong class="gradient-text">4K Production Studio</strong>
          <span>KG 1 Ave, Kigali, Rwanda — Near the Convention Centre</span>
        </div>
        <a
          href="https://maps.google.com/?q=-1.953282,30.095939"
          target="_blank"
          rel="noopener"
          class="map-directions-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          Get Directions
        </a>
      </div>

      <!-- Street View iframe -->
      <div class="map-embed-wrap">
        <iframe
          src="https://www.google.com/maps/embed?pb=!4v1773497909358!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJREd2TTY1Y0E.!2m2!1d-1.953282371277071!2d30.0959391717106!3f114.88434879419701!4f8.051919542239943!5f0.7820865974627469"
          width="100%"
          height="100%"
          style="border:0; display:block;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="4K Production Studio - Street View"
        ></iframe>
      </div>
    </div>
  </div>
</section>

    <!-- Bottom CTA -->
    <section class="section">
      <div class="container text-center">
        <h2 class="section-title reveal">Ready to Create Something?</h2>
        <p class="section-subtitle reveal reveal-delay-1" style="margin-bottom:32px;">
          Skip the form and jump straight to requesting your service.
        </p>
        <router-link to="/request" class="btn btn-primary btn-animated reveal reveal-delay-2">
          Request a Service
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ContactForm from '@/components/ContactForm.vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

const { initReveal } = useScrollReveal()
onMounted(() => initReveal())

const contactDetails = [
  {
    label: 'Phone',
    value: '+250 700 000 000',
    icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14 19.79 19.79 0 0 1 1.61 5.46 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l.46-.76a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  },
  {
    label: 'Email',
    value: 'info@4kproduction.rw',
    icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
  },
  {
    label: 'Address',
    value: 'KG 1 Ave, Kigali, Rwanda',
    icon:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
  }
]

const socials = [
  { label: 'Instagram', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>` },
  { label: 'YouTube',   icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="currentColor"/></svg>` },
  { label: 'Facebook',  icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>` }
]

const hours = [
  { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday',         time: '9:00 AM – 4:00 PM' },
  { day: 'Sunday',           time: 'By Appointment Only' }
]
</script>

<style scoped>
/* Page hero */
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

/* Contact grid */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap:     clamp(32px, 6vw, 72px);
  align-items: start;
}

/* Info column */
.info-heading {
  font-size:     clamp(1.6rem, 3vw, 2.2rem);
  font-weight:   800;
  margin-bottom: 16px;
  line-height:   1.2;
}

.info-text {
  font-size:     0.95rem;
  color:         var(--text-secondary);
  line-height:   1.75;
  margin-bottom: 32px;
}

.contact-details {
  display:        flex;
  flex-direction: column;
  gap:            20px;
  margin-bottom:  32px;
}

.contact-detail-item {
  display:     flex;
  align-items: center;
  gap:         16px;
}

.detail-icon {
  width:           44px;
  height:          44px;
  border-radius:   var(--radius-md);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  flex-shrink:     0;
}

.detail-icon :deep(svg) { width:20px;height:20px; }

.detail-label {
  font-size:  0.75rem;
  color:      var(--text-muted);
  font-weight: 500;
  margin-bottom: 2px;
}

.detail-value {
  font-size:  0.95rem;
  font-weight: 600;
  color:      var(--text-primary);
}

/* Social row */
.social-row {
  margin-bottom: 28px;
}

.social-label {
  display:       block;
  font-size:     0.75rem;
  font-weight:   700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color:         var(--text-muted);
  margin-bottom: 12px;
}

.socials {
  display:   flex;
  gap:       8px;
  flex-wrap: wrap;
}

.social-pill {
  display:         flex;
  align-items:     center;
  gap:             6px;
  padding:         7px 14px;
  border-radius:   var(--radius-full);
  background:      var(--glass-bg);
  border:          var(--glass-border);
  font-size:       0.82rem;
  color:           var(--text-secondary);
  transition:      var(--transition-fast);
}

.social-pill:hover {
  background:   rgba(139,92,246,0.12);
  border-color: rgba(139,92,246,0.3);
  color:        var(--text-primary);
}

.social-pill :deep(svg) { width:14px;height:14px; }

/* Hours card */
.hours-card {
  padding: 20px;
}

.hours-title {
  display:       flex;
  align-items:   center;
  gap:           8px;
  font-size:     0.875rem;
  font-weight:   700;
  color:         var(--text-primary);
  margin-bottom: 16px;
}

.hours-list {
  display:        flex;
  flex-direction: column;
  gap:            8px;
}

.hours-row {
  display:         flex;
  justify-content: space-between;
  align-items:     center;
  font-size:       0.85rem;
}

.hours-day  { color: var(--text-secondary); }

.hours-time {
  font-weight: 500;
  color:       var(--clr-aqua-light);
}

/* Form card */
.form-card {
  padding: clamp(28px, 4vw, 40px);
}

.form-heading {
  font-size:     1.4rem;
  font-weight:   800;
  margin-bottom: 8px;
}

.form-subheading {
  font-size:     0.9rem;
  color:         var(--text-secondary);
  margin-bottom: 28px;
}

/* Map */
.map-card {
  height:          300px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  position:        relative;
  overflow:        hidden;
}

.map-placeholder {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            16px;
  text-align:     center;
}

.map-address {
  display:        flex;
  flex-direction: column;
  gap:            4px;
  font-size:      0.9rem;
  color:          var(--text-secondary);
}

.map-address strong {
  font-size: 1.1rem;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; }
}










/* Map card */
.map-card {
  overflow:   hidden;
  padding:    0;             /* remove old padding */
  height: 430px;
}

/* Address bar */
.map-address-bar {
  display:     block;
  align-items: center;
  gap:         14px;
  padding:     124px 24px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap:   wrap;
}

.map-address-icon {
  width:           36px;
  height:          36px;
  border-radius:   var(--radius-md);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  flex-shrink:     0;
  margin: 20px;
}

.map-address-text {
  display:        flex;
  flex-direction: column;
  gap:            2px;
  flex:           1;
  margin: 20px;
}

.map-address-text strong {
  font-size:   0.95rem;
  font-weight: 700;
}

.map-address-text span {
  font-size: 0.82rem;
  color:     var(--text-muted);
}

.map-directions-btn {
  display:         inline-flex;
  align-items:     center;
  gap:             6px;
  padding:         7px 16px;
  border-radius:   var(--radius-full);
  font-size:       0.82rem;
  font-weight:     600;
  color:           var(--clr-purple-light);
  background:      rgba(139,92,246,0.1);
  border:          1px solid rgba(139,92,246,0.2);
  text-decoration: none;
  transition:      var(--transition-fast);
  white-space:     nowrap;
  flex-shrink:     0;
}

.map-directions-btn:hover {
  background:   rgba(139,92,246,0.2);
  border-color: rgba(139,92,246,0.4);
  gap:          9px;
}

/* Iframe wrapper */
.map-embed-wrap {
  width:  100%;
  height: 430px;
  position: relative;
}

@media (max-width: 600px) {
  .map-embed-wrap   { height: 300px; }
  .map-address-bar  { gap: 10px; }
  .map-directions-btn { width: 100%; justify-content: center; }
}
</style>
