<template>
  <div class="titlebar" :class="{ 'titlebar-light': theme === 'light' }">
    <!-- Drag region — covers most of the bar -->
    <div class="titlebar-drag">
      <!-- App icon + name -->
      <div class="titlebar-identity">
        <svg class="titlebar-icon" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="url(#tbg)"/>
          <text x="12" y="16.5" text-anchor="middle" font-family="Syne,sans-serif" font-weight="800" font-size="9.5" fill="white">4K</text>
          <defs>
            <linearGradient id="tbg" x1="0" y1="0" x2="24" y2="24">
              <stop stop-color="#8b5cf6"/>
              <stop offset="1" stop-color="#06b6d4"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="titlebar-appname">{{ appName }}</span>
      </div>
    </div>

    <!-- Window control buttons — NOT draggable -->
    <div class="titlebar-controls" @dblclick.stop>
      <!-- Minimize -->
      <button class="tb-btn tb-minimize" @click="minimize" title="Minimize">
        <svg viewBox="0 0 12 12" fill="none">
          <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Maximize / Restore -->
      <button class="tb-btn tb-maximize" @click="maximize" :title="maximized ? 'Restore' : 'Maximize'">
        <!-- Restore icon (two overlapping squares) when maximized -->
        <svg v-if="maximized" viewBox="0 0 12 12" fill="none">
          <rect x="3" y="1" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/>
          <path d="M1 4v6a1 1 0 001 1h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <!-- Maximize icon (single square) when normal -->
        <svg v-else viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/>
        </svg>
      </button>

      <!-- Close -->
      <button class="tb-btn tb-close" @click="close" title="Close">
        <svg viewBox="0 0 12 12" fill="none">
          <line x1="1.5" y1="1.5" x2="10.5" y2="10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="10.5" y1="1.5" x2="1.5" y2="10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'dark' }
})

const maximized = ref(false)
const appName   = computed(() => window.electronConfig?.appName || '4K Production Admin')

// Get initial state
onMounted(async () => {
  if (window.electronAPI?.isMaximized) {
    maximized.value = await window.electronAPI.isMaximized()
  }
  // Listen for state changes from main process
  if (window.electronAPI?.onWindowState) {
    window.electronAPI.onWindowState((state) => {
      maximized.value = state.maximized
    })
  }
})

function minimize() { window.electronAPI?.minimize?.() }
function maximize() { window.electronAPI?.maximize?.() }
function close()    { window.electronAPI?.close?.() }
</script>

<style scoped>
.titlebar {
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(6, 8, 18, 0.97);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 9999;
  user-select: none;
  /* Make the entire bar draggable by default */
  -webkit-app-region: drag;
}

.titlebar-light {
  background: rgba(235, 238, 252, 0.97);
  border-bottom-color: rgba(0,0,0,0.08);
}

/* Drag region fills the bar */
.titlebar-drag {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 14px;
  -webkit-app-region: drag;
}

/* App identity */
.titlebar-identity {
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
.titlebar-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 4px;
}
.titlebar-appname {
  font-family: 'Syne', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(240, 244, 255, 0.7);
  letter-spacing: 0.02em;
}
.titlebar-light .titlebar-appname {
  color: rgba(15, 23, 42, 0.6);
}

/* Window controls — must NOT be draggable */
.titlebar-controls {
  display: flex;
  align-items: center;
  height: 100%;
  -webkit-app-region: no-drag;
  padding-right: 2px;
}

/* Base button */
.tb-btn {
  width: 46px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(148, 163, 184, 0.7);
  transition: background 0.15s, color 0.15s;
  border-radius: 0;
}
.tb-btn svg {
  width: 12px;
  height: 12px;
  display: block;
}

/* Minimize */
.tb-minimize:hover {
  background: rgba(255,255,255,0.08);
  color: #f0f4ff;
}

/* Maximize */
.tb-maximize:hover {
  background: rgba(255,255,255,0.08);
  color: #f0f4ff;
}

/* Close — red on hover */
.tb-close:hover {
  background: #e81123;
  color: #fff;
}

/* Light theme button adjustments */
.titlebar-light .tb-btn {
  color: rgba(71, 85, 105, 0.7);
}
.titlebar-light .tb-minimize:hover,
.titlebar-light .tb-maximize:hover {
  background: rgba(0,0,0,0.06);
  color: #0f172a;
}
.titlebar-light .tb-close:hover {
  background: #e81123;
  color: #fff;
}

/* Active state */
.tb-btn:active {
  opacity: 0.75;
}
</style>
