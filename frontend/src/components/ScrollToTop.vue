<template>
  <transition name="scroll-top">
    <button
      v-show="visible"
      class="scroll-top-btn"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      <!-- Progress ring -->
      <svg class="progress-ring" viewBox="0 0 44 44" fill="none">
        <circle
          class="progress-ring-track"
          cx="22" cy="22" r="19"
          stroke-width="2.5"
        />
        <circle
          class="progress-ring-fill"
          cx="22" cy="22" r="19"
          stroke-width="2.5"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </svg>

      <!-- Arrow icon -->
      <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const visible      = ref(false)
const scrollPercent = ref(0)

const circumference = 2 * Math.PI * 19   // r = 19
const dashOffset = computed(() =>
  circumference - (scrollPercent.value / 100) * circumference
)

function onScroll() {
  const scrollTop    = window.scrollY
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight
  scrollPercent.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  visible.value      = scrollTop > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* ─── Button ──────────────────────────────────── */
.scroll-top-btn {
  position:        fixed;
  bottom:          28px;
  right:           24px;
  z-index:         900;
  width:           48px;
  height:          48px;
  border-radius:   50%;
  background:      var(--bg-secondary);
  border:          1px solid rgba(139, 92, 246, 0.3);
  color:           var(--text-primary);
  cursor:          pointer;
  display:         flex;
  align-items:     center;
  justify-content: center;
  transition:      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                   box-shadow 0.25s ease,
                   border-color 0.25s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:      0 4px 20px rgba(0,0,0,0.35);
}

.scroll-top-btn:hover {
  transform:    translateY(-4px) scale(1.08);
  border-color: var(--clr-purple);
  box-shadow:   0 8px 28px rgba(139, 92, 246, 0.45);
}

/* ─── Progress ring ───────────────────────────── */
.progress-ring {
  position: absolute;
  inset:    -1px;           /* sits just outside button edge */
  width:    calc(100% + 2px);
  height:   calc(100% + 2px);
  pointer-events: none;
  transform: rotate(-90deg); /* start from top */
}

.progress-ring-track {
  stroke:       rgba(139, 92, 246, 0.15);
}

.progress-ring-fill {
  stroke:           url(#ringGrad);
  stroke-linecap:   round;
  transition:       stroke-dashoffset 0.2s ease;
}

/* We need to define the gradient inline via defs */
.progress-ring defs { /* handled via SVG linearGradient below */ }

/* ─── Arrow icon ──────────────────────────────── */
.arrow-icon {
  width:    18px;
  height:   18px;
  position: relative;
  z-index:  1;
  color:    var(--clr-purple-light);
  transition: transform 0.2s ease;
}

.scroll-top-btn:hover .arrow-icon {
  transform: translateY(-2px);
}

/* ─── Enter / Leave transition ────────────────── */
.scroll-top-enter-active {
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scroll-top-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity:   0;
  transform: scale(0.5) translateY(20px);
}
</style>
