<template>
  <div class="login-page">
    <!-- Background orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>

    <div class="login-container">
      <!-- Logo -->
      <div class="login-logo">
        <div class="logo-circle">
          <svg viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="url(#lg)"/>
            <text x="24" y="32" text-anchor="middle" font-family="Syne,sans-serif" font-weight="800" font-size="18" fill="white">4K</text>
            <defs><linearGradient id="lg" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#8b5cf6"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs>
          </svg>
        </div>
        <h1 class="login-title gradient-text">Admin Panel</h1>
        <p class="login-sub">4K Production CMS Dashboard</p>
      </div>

      <!-- Form -->
      <div class="login-card glass-panel">
        <div class="login-card-header">
          <h2>Sign In</h2>
          <p>Enter your admin credentials to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">Username</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
              <input
                v-model="form.username"
                type="text" class="form-input login-input"
                placeholder="Enter username"
                autocomplete="username"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              <input
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                class="form-input login-input"
                placeholder="Enter password"
                autocomplete="current-password"
                required
              />
              <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                <svg v-if="!showPwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
            <span v-if="loading" class="btn-spinner"></span>
            <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </form>
      </div>

      <p class="login-footer">
        <router-link to="/" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>
          Back to website
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../services/adminApi.js'

const router  = useRouter()
const loading = ref(false)
const error   = ref('')
const showPwd = ref(false)
const form    = reactive({ username: '', password: '' })

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authApi.login(form)
    router.push('/admin')
  } catch(e) {
    error.value = e.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(120px); opacity: 0.15;
}
.orb-1 { width: 500px; height: 500px; background: #8b5cf6; top: -150px; left: -150px; }
.orb-2 { width: 400px; height: 400px; background: #06b6d4; bottom: -100px; right: -100px; }

.login-container {
  width: 100%; max-width: 420px;
  display: flex; flex-direction: column; align-items: center; gap: 28px;
  position: relative; z-index: 1;
}

.login-logo { text-align: center; }
.logo-circle { margin-bottom: 16px; }
.logo-circle svg { width: 56px; height: 56px; }
.login-title { font-family: 'Syne',sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 6px; }
.login-sub { color: var(--text-muted); font-size: 0.875rem; }

.login-card {
  width: 100%;
  padding: 36px 32px;
  background: var(--bg-secondary) !important; backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.1) !important;
}

.login-card-header { margin-bottom: 28px; }
.login-card-header h2 { font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.login-card-header p { color: var(--text-muted); font-size: 0.875rem; }

.login-form { display: flex; flex-direction: column; gap: 0; }

.input-wrapper { position: relative; }
.input-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; color: var(--text-muted); pointer-events: none;
}
.login-input { padding-left: 44px !important; padding-right: 44px !important; }

.pwd-toggle {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 2px;
  transition: color 0.2s;
}
.pwd-toggle:hover { color: var(--text-secondary); }
.pwd-toggle svg { width: 16px; height: 16px; display: block; }

.alert { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }

.login-btn { width: 100%; justify-content: center; margin-top: 8px; padding: 13px; font-size: 0.95rem; }
.btn-spinner {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;
}

.login-footer { margin-top: 0; }
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--text-muted); font-size: 0.85rem; text-decoration: none; transition: color 0.2s;
}
.back-link:hover { color: var(--text-secondary); }

@keyframes spin { to { transform: rotate(360deg); } }
</style>
