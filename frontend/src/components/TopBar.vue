<template>
  <transition name="topbar-slide">
    <div v-show="visible" class="topbar">
      <div class="topbar-inner">

        <!-- LEFT: Phone + Email -->
        <div class="topbar-left">
          <!-- Phone numbers -->
          <a href="tel:+250781234567" class="topbar-item">
            <svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14 19.79 19.79 0 0 1 1.61 5.46 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l.46-.76a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>+250 782 000 001</span>
          </a>

          <span class="topbar-divider">|</span>

          <a href="tel:+250783000002" class="topbar-item">
            <span>+250 783 000 002</span>
          </a>

          <span class="topbar-divider">|</span>

          <!-- Email -->
          <a href="mailto:4kproduction@gmail.com" class="topbar-item">
            <svg class="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>4kproduction@gmail.com</span>
          </a>
        </div>

        <!-- RIGHT: Social Icons -->
        <div class="topbar-right">
          <!-- Instagram -->
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            class="topbar-social instagram"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <!-- YouTube -->
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener"
            class="topbar-social youtube"
            aria-label="YouTube"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
            </svg>
          </a>

          <!-- X (Twitter) -->
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener"
            class="topbar-social x-twitter"
            aria-label="X (Twitter)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          <!-- WhatsApp -->
          <a
            href="https://wa.me/250782000001"
            target="_blank"
            rel="noopener"
            class="topbar-social whatsapp"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </a>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(true)
let lastScrollY = 0

function onScroll() {
  const currentY = window.scrollY
  // Hide after scrolling down 60px
  visible.value = currentY < 60
  lastScrollY = currentY
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* ─── TopBar ──────────────────────────────────── */
.topbar {
  position:        fixed;
  top:             0;
  left:            0;
  right:           0;
  z-index:         1001;          /* above navbar */
  height:          38px;
  background:      rgba(8, 11, 20, 0.92);
  border-bottom:   1px solid rgba(139, 92, 246, 0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow:        hidden;
}

[data-theme="light"] .topbar {
  background:    rgba(240, 244, 255, 0.94);
  border-color:  rgba(139, 92, 246, 0.12);
}

.topbar-inner {
  max-width:       1200px;
  margin:          0 auto;
  padding:         0 clamp(16px, 4vw, 40px);
  height:          100%;
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  gap:             16px;
}

/* ─── Left side ───────────────────────────────── */
.topbar-left {
  display:     flex;
  align-items: center;
  gap:         10px;
  flex-shrink: 1;
  min-width:   0;
  overflow:    hidden;
}

.topbar-item {
  display:     flex;
  align-items: center;
  gap:         5px;
  font-size:   0.75rem;
  font-weight: 500;
  color:       rgba(148, 163, 184, 0.9);
  text-decoration: none;
  white-space: nowrap;
  transition:  color 0.2s ease;
}

.topbar-item:hover {
  color: var(--clr-aqua-light);
}

.topbar-icon {
  width:      13px;
  height:     13px;
  flex-shrink: 0;
  opacity:    0.7;
}

.topbar-divider {
  color:      rgba(255, 255, 255, 0.12);
  font-size:  0.75rem;
  user-select: none;
}

[data-theme="light"] .topbar-item       { color: rgba(51, 65, 85, 0.85); }
[data-theme="light"] .topbar-divider    { color: rgba(0, 0, 0, 0.15); }

/* ─── Right side: socials ─────────────────────── */
.topbar-right {
  display:     flex;
  align-items: center;
  gap:         4px;
  flex-shrink: 0;
}

.topbar-social {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           26px;
  height:          26px;
  border-radius:   6px;
  transition:      all 0.22s ease;
  text-decoration: none;
}

.topbar-social svg {
  width:  14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.topbar-social:hover svg {
  transform: scale(1.15);
}

/* Individual brand colors on hover */
.topbar-social.instagram {
  color:      #fff;
  background: radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
}

.topbar-social.youtube {
  color:      #fff;
  background: #ff0000;
}

.topbar-social.x-twitter {
  color:      #fff;
  background: #000;
}

.topbar-social.whatsapp {
  color:      #fff;
  background: #25d366;
}

/* ─── Slide transition ────────────────────────── */
.topbar-slide-enter-active,
.topbar-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity   0.35s ease;
}

.topbar-slide-enter-from,
.topbar-slide-leave-to {
  transform: translateY(-100%);
  opacity:   0;
}

/* ─── Responsive ──────────────────────────────── */
@media (max-width: 700px) {
  /* Hide email on small screens, keep phones + socials */
  .topbar-item:last-child,
  .topbar-divider:last-of-type {
    display: none;
  }
}

@media (max-width: 480px) {
  /* Keep only first phone + socials */
  .topbar-left .topbar-item:not(:first-child),
  .topbar-left .topbar-divider {
    display: none;
  }
}
</style>
