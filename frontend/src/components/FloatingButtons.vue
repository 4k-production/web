<template>
  <div class="floating-buttons" :class="{ visible: show }">

    <!-- Instagram -->
    <transition name="float-pop">
      <a
        v-if="show"
        href="https://instagram.com"
        target="_blank"
        rel="noopener"
        class="float-btn instagram-btn"
        aria-label="Follow us on Instagram"
        @mouseenter="igHovered = true"
        @mouseleave="igHovered = false"
      >
        <!-- Tooltip -->
        <transition name="tooltip-fade">
          <span v-if="igHovered" class="float-tooltip">Instagram</span>
        </transition>

        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
    </transition>

    <!-- WhatsApp -->
    <transition name="float-pop">
      <a
        v-if="show"
        href="https://wa.me/250782000001"
        target="_blank"
        rel="noopener"
        class="float-btn whatsapp-btn"
        aria-label="Chat on WhatsApp"
        @mouseenter="waHovered = true"
        @mouseleave="waHovered = false"
      >
        <!-- Tooltip -->
        <transition name="tooltip-fade">
          <span v-if="waHovered" class="float-tooltip">WhatsApp</span>
        </transition>

        <!-- Pulse ring -->
        <span class="wa-pulse"></span>

        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const show      = ref(false)
const waHovered = ref(false)
const igHovered = ref(false)

onMounted(() => {
  // Small delay so buttons pop in after page load
  setTimeout(() => { show.value = true }, 800)
})
</script>

<style scoped>
/* ─── Container ───────────────────────────────── */
.floating-buttons {
  position:  fixed;
  bottom:    28px;
  left:      24px;
  z-index:   900;
  display:   flex;
  align-items: center;
  gap:       13px;
}

/* ─── Base button ─────────────────────────────── */
.float-btn {
  position:        relative;
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           52px;
  height:          52px;
  border-radius:   50%;
  text-decoration: none;
  transition:      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                   box-shadow 0.25s ease;
  cursor:          pointer;
  overflow:        visible;
}

.float-btn svg {
  width:  24px;
  height: 24px;
  position: relative;
  z-index: 1;
}

/* ─── WhatsApp ────────────────────────────────── */
.whatsapp-btn {
  background:  #25d366;
  color:       #fff;
  box-shadow:  0 4px 20px rgba(37, 211, 102, 0.45);
  /* Instagram pops in first, WhatsApp is the anchor */
  order: 2;
}

.whatsapp-btn:hover {
  transform:  translateY(-4px) scale(1.08);
  box-shadow: 0 8px 28px rgba(37, 211, 102, 0.6);
}

/* Pulse ring */
.wa-pulse {
  position:      absolute;
  inset:         0;
  border-radius: 50%;
  background:    rgba(37, 211, 102, 0.35);
  animation:     waPulse 2.2s ease-out infinite;
  z-index:       0;
}

@keyframes waPulse {
  0%   { transform: scale(1);   opacity: 0.7; }
  70%  { transform: scale(1.7); opacity: 0; }
  100% { transform: scale(1.7); opacity: 0; }
}

/* ─── Instagram ───────────────────────────────── */
.instagram-btn {
  background:  radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
  color:       #fff;
  box-shadow:  0 4px 20px rgba(214, 36, 159, 0.4);
  order: 1;
}

.instagram-btn:hover {
  transform:  translateY(-4px) scale(1.08);
  box-shadow: 0 8px 28px rgba(214, 36, 159, 0.55);
}

/* ─── Tooltip ─────────────────────────────────── */
.float-tooltip {
  position:        absolute;
  bottom:          calc(100% + 8px);
  left:            50%;
  transform:       translateX(-50%);
  background:      rgba(15, 20, 35, 0.92);
  color:           #fff;
  font-size:       0.72rem;
  font-weight:     600;
  padding:         4px 10px;
  border-radius:   6px;
  white-space:     nowrap;
  pointer-events:  none;
  border:          1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
}

.float-tooltip::after {
  content:     '';
  position:    absolute;
  top:         100%;
  left:        50%;
  transform:   translateX(-50%);
  border:      5px solid transparent;
  border-top-color: rgba(15, 20, 35, 0.92);
}

/* Tooltip transition */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.tooltip-fade-enter-from,
.tooltip-fade-leave-to     { opacity: 0; transform: translateX(-50%) translateY(4px); }

/* ─── Pop-in animation ────────────────────────── */
.float-pop-enter-active {
  transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.float-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.float-pop-enter-from {
  opacity:   0;
  transform: scale(0.4) translateY(20px);
}
.float-pop-leave-to {
  opacity:   0;
  transform: scale(0.4) translateY(20px);
}

/* Instagram pops in slightly after WhatsApp */
.instagram-btn {
  transition-delay: 0.12s;
}
</style>
