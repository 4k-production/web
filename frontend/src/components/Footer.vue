<template>
  <footer class="footer">
    <!-- Glow line at top -->
    <div class="glow-line footer-line"></div>

    <div class="footer-content">
      <div class="container">
        <div class="footer-grid">

          <!-- Brand Column -->
          <div class="footer-brand">
            <router-link to="/" class="footer-logo">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#footerLogoGrad)"/>
                <path d="M8 22L14 10L20 22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="23" cy="13" r="3" fill="white" opacity="0.9"/>
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8b5cf6"/>
                    <stop offset="1" stop-color="#06b6d4"/>
                  </linearGradient>
                </defs>
              </svg>
              <span class="footer-logo-text">
                <span class="gradient-text">4K</span> Production
              </span>
            </router-link>
            <p class="footer-tagline">
              Transforming vision into stunning 4K reality. Professional multimedia services for brands, events, and beyond.
            </p>
            <div class="footer-social">
              <a href="#" class="social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="currentColor"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Twitter/X">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
            </div>
          </div>

          <!-- Services Column -->
          <div class="footer-col">
            <h4 class="footer-heading">Services</h4>
            <ul class="footer-links">
              <li><router-link to="/services">Video Production</router-link></li>
              <li><router-link to="/services">Photography</router-link></li>
              <li><router-link to="/services">Event Coverage</router-link></li>
              <li><router-link to="/services">Documentary</router-link></li>
              <li><router-link to="/services">Motion Graphics</router-link></li>
              <li><router-link to="/services">Live Streaming</router-link></li>
            </ul>
          </div>

          <!-- Company Column -->
          <div class="footer-col">
            <h4 class="footer-heading">Company</h4>
            <ul class="footer-links">
              <li><router-link to="/about">About Us</router-link></li>
              <li><router-link to="/portfolio">Portfolio</router-link></li>
              <li><router-link to="/announcements">News</router-link></li>
              <li><router-link to="/contact">Contact</router-link></li>
              <li><router-link to="/request">Request Service</router-link></li>
            </ul>
          </div>

          <!-- Contact Column -->
          <div class="footer-col">
            <h4 class="footer-heading">Get In Touch</h4>
            <ul class="footer-contact">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Kigali, Rwanda
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14 19.79 19.79 0 0 1 1.61 5.46 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l.46-.76a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +250 700 000 000
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                info@4kproduction.rw
              </li>
            </ul>
            <router-link to="/request" class="btn btn-primary footer-cta">
              Request Service
            </router-link>
          </div>

        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>© {{ currentYear }} 4K Production. All rights reserved.</p>
        <p class="footer-love">
          Crafted with <span class="gradient-text">passion</span> for storytelling
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background:    var(--bg-secondary);
  position:      relative;
  z-index:       1;
  margin-top:    auto;
}

.footer-line {
  width: 100%;
  margin: 0;
  border-radius: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--clr-purple), var(--clr-aqua), transparent);
  opacity: 0.4;
}

.footer-content {
  padding: clamp(48px, 8vw, 80px) 0 clamp(32px, 5vw, 48px);
}

.footer-grid {
  display:               grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  gap:                   clamp(24px, 4vw, 48px);
}

/* Brand */
.footer-logo {
  display:     flex;
  align-items: center;
  gap:         10px;
  font-family: var(--font-display);
  font-size:   1.2rem;
  font-weight: 700;
  color:       var(--text-primary);
  margin-bottom: 16px;
}

.footer-tagline {
  font-size:     0.9rem;
  color:         var(--text-muted);
  line-height:   1.7;
  margin-bottom: 24px;
}

.footer-social {
  display: flex;
  gap:     10px;
}

.social-link {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           36px;
  height:          36px;
  border-radius:   var(--radius-full);
  background:      var(--glass-bg);
  border:          var(--glass-border);
  color:           var(--text-muted);
  transition:      var(--transition-fast);
}

.social-link svg {
  width:  16px;
  height: 16px;
}

.social-link:hover {
  background:  rgba(139,92,246,0.15);
  border-color: rgba(139,92,246,0.3);
  color:       var(--clr-purple-light);
  transform:   translateY(-2px);
}

/* Columns */
.footer-heading {
  font-size:     0.8rem;
  font-weight:   700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color:         var(--clr-aqua-light);
  margin-bottom: 20px;
}

.footer-links {
  list-style: none;
  display:    flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  font-size:   0.9rem;
  color:       var(--text-muted);
  transition:  var(--transition-fast);
}

.footer-links a:hover {
  color:           var(--text-primary);
  padding-left:    4px;
}

/* Contact */
.footer-contact {
  list-style:     none;
  display:        flex;
  flex-direction: column;
  gap:            12px;
  margin-bottom:  24px;
}

.footer-contact li {
  display:     flex;
  align-items: center;
  gap:         10px;
  font-size:   0.875rem;
  color:       var(--text-secondary);
}

.footer-contact li svg {
  width:      16px;
  height:     16px;
  flex-shrink: 0;
  color:      var(--clr-purple-light);
}

.footer-cta {
  font-size: 0.875rem;
  padding:   9px 20px;
}

/* Bottom */
.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding:    20px 0;
}

.footer-bottom-inner {
  display:         flex;
  justify-content: space-between;
  align-items:     center;
  flex-wrap:       wrap;
  gap:             8px;
}

.footer-bottom p {
  font-size: 0.825rem;
  color:     var(--text-muted);
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer-bottom-inner {
    flex-direction: column;
    text-align:     center;
  }
}
</style>
