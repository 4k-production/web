<template>
  <transition name="popup-slide">
    <div
      v-if="visible && currentAnnouncement"
      class="ann-popup"
      role="alert"
      aria-live="polite"
    >
      <!-- Close button -->
      <button class="popup-close" @click="dismiss" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6"  x2="6"  y2="18"/>
          <line x1="6"  y1="6"  x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Progress bar (shows how long until auto-dismiss) -->
      <div class="popup-progress">
        <div
          class="popup-progress-fill"
          :style="{ width: progressWidth + '%' }"
        ></div>
      </div>

      <!-- Content -->
      <div class="popup-body">
        <!-- Header row -->
        <div class="popup-header">
          <!-- Animated icon -->
          <div class="popup-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>

          <div class="popup-meta">
            <span class="popup-tag">{{ currentAnnouncement.category || 'Announcement' }}</span>
            <span class="popup-counter">{{ currentIndex + 1 }} / {{ announcements.length }}</span>
          </div>
        </div>

        <!-- Title -->
        <h4 class="popup-title">{{ currentAnnouncement.title }}</h4>

        <!-- Excerpt -->
        <p class="popup-excerpt">{{ truncate(currentAnnouncement.content, 100) }}</p>

        <!-- Actions -->
        <div class="popup-actions">
          <router-link
            to="/announcements"
            class="popup-read-more"
            @click="dismiss"
          >
            Read More
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </router-link>

          <!-- Dot indicators -->
          <div class="popup-dots" v-if="announcements.length > 1">
            <button
              v-for="(_, i) in announcements"
              :key="i"
              class="popup-dot"
              :class="{ active: i === currentIndex }"
              @click="goTo(i)"
              :aria-label="`Announcement ${i + 1}`"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { announcementsApi } from '@/services/api.js'

// ─── Static fallback data ─────────────────────
const FALLBACK = [
  {
    title:    'Grand Opening of Our New Studio!',
    content:  'State-of-the-art 4K production studio now open in Kigali. Equipped with RED cinema cameras and professional lighting rigs. Book a tour today!',
    category: 'Company News'
  },
  {
    title:    'New Service: Live Streaming',
    content:  'We now offer full-scale live streaming for corporate events, product launches, and conferences. Ask us about our packages!',
    category: 'New Service'
  },
  {
    title:    'Award: Best Documentary 2024',
    content:  '"Voices of the Valley" wins Best Documentary at the National Film Festival 2024. A proud moment for our entire team!',
    category: 'Achievement'
  }
]

// ─── State ────────────────────────────────────
const announcements   = ref([])
const currentIndex    = ref(0)
const visible         = ref(false)
const progressWidth   = ref(100)

// Timers
let showTimer     = null
let hideTimer     = null
let progressTimer = null
let intervalTimer = null

const SHOW_DURATION   = 7000    // ms to show popup
const PAUSE_DURATION  = 22000   // ms between appearances
const PROGRESS_STEP   = 100     // ms per progress update

const currentAnnouncement = computed(() =>
  announcements.value[currentIndex.value] ?? null
)

// ─── Helpers ──────────────────────────────────
function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

function goTo(index) {
  currentIndex.value = index
}

function dismiss() {
  visible.value = false
  clearTimers()
  // Schedule next popup
  scheduleNext()
}

function clearTimers() {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  clearInterval(progressTimer)
  clearInterval(intervalTimer)
}

// ─── Progress bar ─────────────────────────────
function startProgress() {
  progressWidth.value = 100
  const steps    = SHOW_DURATION / PROGRESS_STEP
  const decrement = 100 / steps

  progressTimer = setInterval(() => {
    progressWidth.value = Math.max(0, progressWidth.value - decrement)
  }, PROGRESS_STEP)
}

// ─── Show one popup, then schedule next ────────
function showPopup() {
  // Advance to next announcement
  currentIndex.value = (currentIndex.value + 1) % announcements.value.length
  visible.value      = true

  startProgress()

  // Auto-hide after SHOW_DURATION
  hideTimer = setTimeout(() => {
    visible.value = false
    clearInterval(progressTimer)
    scheduleNext()
  }, SHOW_DURATION)
}

function scheduleNext() {
  showTimer = setTimeout(() => {
    showPopup()
  }, PAUSE_DURATION)
}

// ─── Load announcements ────────────────────────
async function load() {
  try {
    const res = await announcementsApi.getAll()
    announcements.value = (res.data || []).slice(0, 6)
  } catch {
    announcements.value = FALLBACK
  }

  if (!announcements.value.length) return

  // First popup appears after 5s on page load
  showTimer = setTimeout(() => {
    showPopup()
  }, 5000)
}

onMounted(() => { load() })
onUnmounted(() => { clearTimers() })
</script>

<style scoped>
/* ─── Popup container ─────────────────────────── */
.ann-popup {
  position:        fixed;
  top:             calc(var(--nav-height) + 50px); /* just below navbar */
  right:           20px;
  z-index:         980;
  width:           min(340px, calc(100vw - 40px));
  border-radius:   var(--radius-lg);
  background:      rgba(13, 18, 32, 0.95);
  border:          1px solid rgba(139, 92, 246, 0.25);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(139, 92, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow:        hidden;
  cursor:          default;
}

[data-theme="light"] .ann-popup {
  background:   rgba(255, 255, 255, 0.94);
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow:   0 20px 60px rgba(100, 100, 150, 0.2), inset 0 1px 0 rgba(255,255,255,0.8);
}

/* ─── Progress bar ────────────────────────────── */
.popup-progress {
  height:     3px;
  background: rgba(255, 255, 255, 0.06);
  position:   relative;
  overflow:   hidden;
}

.popup-progress-fill {
  height:     100%;
  background: linear-gradient(90deg, var(--clr-purple), var(--clr-aqua));
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}

/* ─── Close button ────────────────────────────── */
.popup-close {
  position:        absolute;
  top:             4px;
  right:           14px;
  width:           22px;
  height:          22px;
  border-radius:   50%;
  background:      rgba(255, 255, 255, 0.07);
  border:          1px solid rgba(255, 255, 255, 0.1);
  color:           var(--text-muted);
  display:         flex;
  align-items:     center;
  justify-content: center;
  cursor:          pointer;
  transition:      all 0.18s ease;
  z-index:         2;
}

.popup-close:hover {
  background:   rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  color:        #f87171;
  transform:    scale(1.1);
}

/* ─── Body ────────────────────────────────────── */
.popup-body {
  padding: 16px 18px 18px;
}

/* Header */
.popup-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  margin-bottom:   12px;
}

.popup-icon {
  width:           34px;
  height:          34px;
  border-radius:   var(--radius-sm);
  background:      linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.15));
  border:          1px solid rgba(139,92,246,0.2);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           var(--clr-purple-light);
  animation:       bellRing 3s ease-in-out infinite;
}

@keyframes bellRing {
  0%, 85%, 100% { transform: rotate(0deg); }
  90%           { transform: rotate(12deg); }
  95%           { transform: rotate(-10deg); }
}

.popup-meta {
  display:     flex;
  align-items: center;
  gap:         8px;
}

.popup-tag {
  display:        inline-block;
  padding:        3px 10px;
  border-radius:  var(--radius-full);
  font-size:      0.68rem;
  font-weight:    700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background:     rgba(6, 182, 212, 0.12);
  border:         1px solid rgba(6, 182, 212, 0.2);
  color:          var(--clr-aqua-light);
}

.popup-counter {
  font-size:   0.7rem;
  color:       var(--text-muted);
  font-weight: 500;
}

/* Title */
.popup-title {
  font-family:   var(--font-display);
  font-size:     0.95rem;
  font-weight:   700;
  color:         var(--text-primary);
  line-height:   1.35;
  margin-bottom: 8px;
  padding-right: 20px; /* avoid overlap with close btn */
}

/* Excerpt */
.popup-excerpt {
  font-size:     0.82rem;
  color:         var(--text-secondary);
  line-height:   1.65;
  margin-bottom: 14px;
}

/* Actions */
.popup-actions {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
}

.popup-read-more {
  display:     inline-flex;
  align-items: center;
  gap:         5px;
  font-size:   0.8rem;
  font-weight: 700;
  color:       var(--clr-purple-light);
  text-decoration: none;
  padding:     6px 14px;
  border-radius: var(--radius-full);
  background:  rgba(139, 92, 246, 0.1);
  border:      1px solid rgba(139, 92, 246, 0.2);
  transition:  all 0.2s ease;
}

.popup-read-more:hover {
  background:   rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.4);
  gap:          8px;
}

/* Dot indicators */
.popup-dots {
  display:     flex;
  align-items: center;
  gap:         5px;
}

.popup-dot {
  width:         7px;
  height:        7px;
  border-radius: 50%;
  background:    rgba(255, 255, 255, 0.2);
  border:        none;
  cursor:        pointer;
  transition:    all 0.2s ease;
  padding:       0;
}

.popup-dot.active {
  background:  var(--grad-primary);
  width:       18px;
  border-radius: 4px;
}

.popup-dot:hover {
  background: rgba(139, 92, 246, 0.5);
}

/* ─── Slide-in animation ──────────────────────── */
.popup-slide-enter-active {
  transition: opacity 0.45s ease,
              transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.popup-slide-leave-active {
  transition: opacity 0.3s ease,
              transform 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.popup-slide-enter-from {
  opacity:   0;
  transform: translateX(calc(100% + 28px));
}

.popup-slide-leave-to {
  opacity:   0;
  transform: translateX(calc(100% + 28px));
}

/* ─── Responsive ──────────────────────────────── */
@media (max-width: 480px) {
  .ann-popup {
    right:  12px;
    top:    calc(var(--nav-height) + 50px);
  }
}
</style>
