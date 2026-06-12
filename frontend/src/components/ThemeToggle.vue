<template>
  <button
    class="theme-toggle"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="$emit('toggle')"
    aria-label="Toggle theme"
  >
    <!-- Sun icon (shown in dark mode) -->
    <transition name="icon-swap" mode="out-in">
      <svg
        v-if="isDark"
        key="sun"
        class="theme-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1"  x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1"  y1="12" x2="3"  y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
        <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
      </svg>

      <!-- Moon icon (shown in light mode) -->
      <svg
        v-else
        key="moon"
        class="theme-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </transition>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'dark' }
})

defineEmits(['toggle'])

const isDark = computed(() => props.theme === 'dark')
</script>

<style scoped>
.theme-toggle {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           38px;
  height:          38px;
  border-radius:   var(--radius-full);
  background:      var(--glass-bg);
  border:          var(--glass-border);
  color:           var(--text-secondary);
  backdrop-filter: blur(10px);
  transition:      var(--transition-fast);
  cursor:          pointer;
  flex-shrink:     0;
}

.theme-toggle:hover {
  color:      var(--text-primary);
  background: rgba(139,92,246,0.12);
  border-color: rgba(139,92,246,0.3);
  box-shadow: 0 0 12px rgba(139,92,246,0.2);
}

.theme-icon {
  width:  18px;
  height: 18px;
}

/* Icon swap transition */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.icon-swap-enter-from {
  opacity:   0;
  transform: rotate(-90deg) scale(0.7);
}

.icon-swap-leave-to {
  opacity:   0;
  transform: rotate(90deg) scale(0.7);
}
</style>
