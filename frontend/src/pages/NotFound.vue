<template>
  <div class="page not-found-page">
    <div class="nf-orb nf-orb-l"></div>
    <div class="nf-orb nf-orb-r"></div>

    <div class="container nf-content">
      <!-- Big 404 -->
      <div class="nf-number">
        <span class="gradient-text">4</span>
        <span class="nf-zero">0</span>
        <span class="gradient-text">4</span>
      </div>

      <div class="nf-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>

      <h1 class="nf-title">Page Not Found</h1>
      <p class="nf-text">
        The page you're looking for seems to have wandered off set.
        Let's get you back to the production.
      </p>

      <div class="nf-actions">
        <router-link to="/" class="btn btn-primary btn-animated">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Back to Home
        </router-link>
        <router-link to="/contact" class="btn btn-outline">
          Contact Us
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display:         flex;
  align-items:     center;
  justify-content: center;
  min-height:      100vh;
  position:        relative;
  overflow:        hidden;
  text-align:      center;
}

.nf-orb {
  position:      absolute;
  border-radius: 50%;
  filter:        blur(100px);
  opacity:       0.1;
}

.nf-orb-l { width:400px;height:400px;background:var(--clr-purple);top:-100px;left:-100px; }
.nf-orb-r { width:350px;height:350px;background:var(--clr-aqua);bottom:-100px;right:-100px; }

.nf-content {
  position: relative;
  z-index:  1;
  animation: fadeInUp 0.7s ease both;
}

.nf-number {
  font-family:   var(--font-display);
  font-size:     clamp(6rem, 20vw, 14rem);
  font-weight:   800;
  line-height:   1;
  margin-bottom: 0;
  letter-spacing: -0.04em;
}

.nf-zero {
  -webkit-text-stroke: 3px rgba(139,92,246,0.4);
  color:               transparent;
}

.nf-icon {
  margin: 8px 0 24px;
  display: flex;
  justify-content: center;
}

.nf-title {
  font-size:     clamp(1.6rem, 4vw, 2.5rem);
  font-weight:   800;
  margin-bottom: 16px;
}

.nf-text {
  font-size:     clamp(1rem, 2vw, 1.1rem);
  color:         var(--text-secondary);
  max-width:     460px;
  margin:        0 auto 36px;
  line-height:   1.7;
}

.nf-actions {
  display:         flex;
  justify-content: center;
  gap:             16px;
  flex-wrap:       wrap;
}
</style>
