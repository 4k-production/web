<template>
  <nav class="navbar glass-nav" :class="{ scrolled: isScrolled, 'topbar-hidden': topbarHidden }">
    <div class="nav-container">

      <!-- Logo -->
      <router-link to="/" class="nav-logo" @click="closeMobile">
        <span class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
            <path d="M8 22L14 10L20 22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="23" cy="13" r="3" fill="white" opacity="0.9"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stop-color="#8b5cf6"/>
                <stop offset="1" stop-color="#06b6d4"/>
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span class="logo-text">
          <span class="gradient-text">4K</span>
          <span> Production</span>
        </span>
      </router-link>

      <!-- Desktop Navigation Links -->
      <ul class="nav-links">
        <li v-for="link in navLinks" :key="link.to">
          <router-link :to="link.to" class="nav-link">{{ link.label }}</router-link>
        </li>
      </ul>

      <!-- Right Side Actions -->
      <div class="nav-actions">
        <ThemeToggle :theme="theme" @toggle="$emit('toggle-theme')" />
        <router-link to="/request" class="btn btn-primary nav-cta" @click="closeMobile">
          Request Service
        </router-link>
        <button
          class="hamburger"
          :class="{ active: mobileOpen }"
          @click="toggleMobile"
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="mobile-menu">
      <div v-if="mobileOpen" class="mobile-menu glass-dropdown">
        <ul class="mobile-links">
          <li v-for="link in navLinks" :key="link.to">
            <router-link :to="link.to" class="mobile-link" @click="closeMobile">
              {{ link.label }}
            </router-link>
          </li>
        </ul>
        <router-link to="/request" class="btn btn-primary mobile-cta" @click="closeMobile">
          🎬 Request a Service
        </router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

defineProps({ theme: { type: String, default: 'dark' } })
defineEmits(['toggle-theme'])

const navLinks = [
  { to: '/',              label: 'Home'      },
  { to: '/services',      label: 'Services'  },
  { to: '/portfolio',     label: 'Portfolio' },
  { to: '/events',        label: 'Events Room' },
  { to: '/about',         label: 'About'     },
  { to: '/announcements', label: 'News'      },
  { to: '/contact',       label: 'Contact'   }
]

const isScrolled   = ref(false)
const topbarHidden = ref(false)
const mobileOpen   = ref(false)

function onScroll() {
  const y = window.scrollY
  isScrolled.value   = y > 20
  topbarHidden.value = y >= 60
}

function toggleMobile() { mobileOpen.value = !mobileOpen.value }
function closeMobile()   { mobileOpen.value = false }

onMounted(()   => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position:   fixed;
  top:        38px;
  left:       0;
  right:      0;
  z-index:    1000;
  height:     var(--nav-height);
  transition: top 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
  animation:  fadeInDown 0.5s ease forwards;
}

.navbar.topbar-hidden { top: 0; }
.navbar.scrolled      { box-shadow: 0 4px 30px rgba(0,0,0,0.4); }

.nav-container {
  max-width:   1200px;
  margin:      0 auto;
  padding:     0 clamp(16px, 4vw, 40px);
  height:      100%;
  display:     flex;
  align-items: center;
  gap:         32px;
}

/* Logo */
.nav-logo {
  display:         flex;
  align-items:     center;
  gap:             10px;
  font-family:     var(--font-display);
  font-size:       1.2rem;
  font-weight:     700;
  color:           var(--text-primary);
  text-decoration: none;
  flex-shrink:     0;
  transition:      var(--transition-fast);
}
.nav-logo:hover  { opacity: 0.85; }
.logo-icon       { display: flex; align-items: center; }

/* Nav links */
.nav-links {
  display:         flex;
  align-items:     center;
  gap:             4px;
  list-style:      none;
  flex:            1;
  justify-content: center;
}

/* KEY FIX: no background on hover — gradient underline only */
.nav-link {
  padding:       8px 14px;
  border-radius: var(--radius-full);
  font-size:     0.9rem;
  font-weight:   500;
  color:         var(--text-secondary);
  transition:    color 0.22s ease;
  white-space:   nowrap;
  position:      relative;
  background:    transparent !important;
  text-decoration: none;
  display:       inline-block;
}

.nav-link::after {
  content:       '';
  position:      absolute;
  bottom:        2px;
  left:          50%;
  transform:     translateX(-50%) scaleX(0);
  width:         65%;
  height:        2px;
  background:    linear-gradient(90deg, var(--clr-purple), var(--clr-aqua));
  border-radius: var(--radius-full);
  transition:    transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:    0 0 6px rgba(139,92,246,0.5);
}

.nav-link:hover                     { color: var(--text-primary); }
.nav-link:hover::after              { transform: translateX(-50%) scaleX(1); }
.nav-link.router-link-active        { color: var(--text-primary); }
.nav-link.router-link-active::after { transform: translateX(-50%) scaleX(1); }

/* Actions */
.nav-actions {
  display:     flex;
  align-items: center;
  gap:         12px;
  flex-shrink: 0;
}

.nav-cta { font-size: 0.875rem; padding: 9px 20px; }

/* Hamburger */
.hamburger {
  display:         none;
  flex-direction:  column;
  justify-content: space-between;
  width:           28px;
  height:          20px;
  background:      none;
  border:          none;
  cursor:          pointer;
  padding:         0;
}

.hamburger span {
  display:          block;
  width:            100%;
  height:           2px;
  background:       var(--text-primary);
  border-radius:    2px;
  transition:       var(--transition-fast);
  transform-origin: center;
}

.hamburger.active span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.active span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  position: absolute;
  top:      calc(var(--nav-height) + 8px);
  left:     16px;
  right:    16px;
  padding:  20px;
  z-index:  999;
}

.mobile-links {
  list-style:     none;
  display:        flex;
  flex-direction: column;
  gap:            4px;
  margin-bottom:  16px;
}

.mobile-link {
  display:       block;
  padding:       12px 16px;
  border-radius: var(--radius-md);
  font-size:     1rem;
  font-weight:   500;
  color:         var(--text-secondary);
  transition:    var(--transition-fast);
  position:      relative;
  text-decoration: none;
}

.mobile-link:hover,
.mobile-link.router-link-active {
  color: var(--text-primary);
}

.mobile-link.router-link-active::before {
  content:       '';
  position:      absolute;
  left:          0;
  top:           25%;
  height:        50%;
  width:         3px;
  border-radius: 2px;
  background:    linear-gradient(180deg, var(--clr-purple), var(--clr-aqua));
}

.mobile-cta { width: 100%; justify-content: center; }

.mobile-menu-enter-active, .mobile-menu-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to       { opacity: 0; transform: translateY(-10px); }

/* RESPONSIVE */
@media (max-width: 900px) {
  .nav-links { display: none; }
  .nav-cta   { display: none; }
  .hamburger { display: flex; }

  .nav-actions   { margin-left: auto; }
  .nav-container { padding-right: 2rem; }
}

@media (max-width: 480px) {
  .logo-text { font-size: 1rem; }
}
</style>
