<template>
  <div class="error-page">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>

    <div class="error-card glass-panel">
      <!-- Icon -->
      <div class="error-icon" :class="retrying ? 'icon-loading' : 'icon-error'">
        <!-- Spinner while retrying -->
        <svg v-if="retrying" class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>
        <!-- Error icon -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
      </div>

      <!-- Title -->
      <h1 class="gradient-text">{{ retrying ? 'Connecting…' : 'Cannot Connect.' }}</h1>

      <!-- Message -->
      <p class="error-msg" v-if="!retrying">
        The desktop app could not connect to the web server at:<br/>
        <code>{{ apiUrl }}</code>
      </p>
      <p class="error-msg" v-else>
        Trying to connect to <code>{{ apiUrl }}</code>…
      </p>

      <!-- Steps (only when not retrying) -->
      <div class="error-steps" v-if="!retrying">
        <div class="step">
          <span class="step-num">!</span>
          <span>Make sure that you are connected to the internet!
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="error-actions" v-if="!retrying">
        <button class="btn btn-primary" @click="retry">
          Retry Connection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter }     from 'vue-router'
import { desktopAuth }   from '../services/adminApi.js'
import { desktopAuthState } from '../../router/index.js'

const router   = useRouter()
const retrying = ref(false)
const lastError = ref('')

const apiUrl = computed(() => window.electronConfig?.apiUrl || 'https://4k-production.onrender.com')

async function retry() {
  retrying.value  = true
  lastError.value = ''

  try {
    // ── KEY FIX ────────────────────────────────
    // Reset the cached auth state in the router so
    // the guard runs a fresh desktopAuth() call
    desktopAuthState.done = false
    desktopAuthState.ok   = false

    // Try to authenticate again
    const ok = await desktopAuth()

    if (ok) {
      // Update state so the router guard passes through
      desktopAuthState.done = true
      desktopAuthState.ok   = true

      console.log('[DesktopAuthError] Retry succeeded — navigating to dashboard')

      // Navigate to admin — the guard will now see ok=true and allow it
      await router.replace({ name: 'AdminDashboard' })
    } else {
      lastError.value       = 'Authentication failed — check token matches in .env and config.json'
      desktopAuthState.done = true
      desktopAuthState.ok   = false
    }
  } catch(e) {
    lastError.value       = e.message || 'Network error'
    desktopAuthState.done = true
    desktopAuthState.ok   = false
    console.error('[DesktopAuthError] Retry failed:', e.message)
  } finally {
    retrying.value = false
  }
}

function openConfig() {
  window.electronAPI?.openConfig?.()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: var(--bg-primary, #080b14);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; position: relative; overflow: hidden;
}

.orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(120px); opacity: 0.12; }
.orb-1 { width: 500px; height: 500px; background: #8b5cf6; top: -150px; left: -150px; }
.orb-2 { width: 400px; height: 400px; background: #06b6d4; bottom: -100px; right: -100px; }

.error-card {
  width: 100%; max-width: 560px; padding: 48px 40px;
  text-align: center; position: relative; z-index: 1;
  background: rgba(13,18,32,0.95) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: 24px !important;
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }

.error-icon {
  width: 72px; height: 72px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px; transition: all 0.3s;
}
.icon-error   { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
.icon-loading { background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); color: #a78bfa; }

.error-icon svg { width: 36px; height: 36px; }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

h1 { font-family: 'Syne',sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; }

.error-msg {
  color: #94a3b8; font-size: 0.9rem; line-height: 1.7; margin-bottom: 24px;
}
code {
  background: rgba(255,255,255,0.08); padding: 2px 7px;
  border-radius: 5px; font-size: 0.82rem; color: #a78bfa;
}

.error-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; text-align: left; }
.step {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 14px; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
}
.step-num {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg,#8b5cf6,#06b6d4);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 800; color: #fff;
}
.step span:last-child { font-size: 0.82rem; color: #94a3b8; line-height: 1.5; }

.error-detail {
  padding: 10px 14px; margin-bottom: 18px;
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
  border-radius: 10px; font-size: 0.82rem; color: #f87171; text-align: left;
}
.error-detail-label { font-weight: 700; margin-right: 6px; }

.error-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

.btn-outline-sm {
  padding: 10px 20px; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12); color: #94a3b8;
  transition: all 0.2s; font-family: inherit;
}
.btn-outline-sm:hover { background: rgba(255,255,255,0.09); color: #f0f4ff; }
</style>