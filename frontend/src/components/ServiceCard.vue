<template>
  <div class="service-card glass-card reveal" :class="`reveal-delay-${delay}`">
    <!-- Icon -->
    <div class="service-icon-wrap">
      <div class="service-icon" v-html="service.icon"></div>
    </div>

    <!-- Content -->
    <div class="service-body">
      <h3 class="service-title">{{ service.title }}</h3>
      <p class="service-desc">{{ service.description }}</p>
    </div>

    <!-- Features list -->
    <ul class="service-features" v-if="service.features">
      <li v-for="feat in service.features" :key="feat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ feat }}
      </li>
    </ul>

    <!-- CTA -->
    <router-link to="/request" class="service-cta">
      Request This Service
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </router-link>

    <!-- Hover gradient glow -->
    <div class="service-glow"></div>
  </div>
</template>

<script setup>
defineProps({
  service: { type: Object, required: true },
  delay:   { type: Number, default: 1 }
})
</script>

<style scoped>
.service-card {
  padding:        28px;
  display:        flex;
  flex-direction: column;
  gap:            0;
  position:       relative;
  overflow:       hidden;
  cursor:         default;
}

/* Glow overlay on hover */
.service-glow {
  position:   absolute;
  inset:      0;
  background: var(--grad-glow);
  opacity:    0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.service-card:hover .service-glow {
  opacity: 0.08;
}

/* Icon */
.service-icon-wrap {
  width:           52px;
  height:          52px;
  border-radius:   var(--radius-md);
  background:      var(--grad-primary);
  display:         flex;
  align-items:     center;
  justify-content: center;
  margin-bottom:   20px;
  flex-shrink:     0;
  box-shadow:      0 4px 16px rgba(139,92,246,0.35);
  transition:      transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover .service-icon-wrap {
  transform:  scale(1.1) rotate(-3deg);
  box-shadow: 0 8px 24px rgba(139,92,246,0.5);
}

.service-icon {
  color:  #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon :deep(svg) {
  width:  24px;
  height: 24px;
}

/* Body */
.service-body {
  flex: 1;
  margin-bottom: 20px;
}

.service-title {
  font-size:     1.15rem;
  font-weight:   700;
  margin-bottom: 10px;
  color:         var(--text-primary);
}

.service-desc {
  font-size:   0.9rem;
  color:       var(--text-secondary);
  line-height: 1.65;
}

/* Features */
.service-features {
  list-style:    none;
  display:       flex;
  flex-direction: column;
  gap:           8px;
  margin-bottom: 24px;
}

.service-features li {
  display:     flex;
  align-items: center;
  gap:         8px;
  font-size:   0.85rem;
  color:       var(--text-secondary);
}

.service-features li svg {
  flex-shrink:  0;
  color:        var(--clr-aqua-light);
}

/* CTA */
.service-cta {
  display:     flex;
  align-items: center;
  gap:         6px;
  font-size:   0.875rem;
  font-weight: 600;
  color:       var(--clr-purple-light);
  transition:  var(--transition-fast);
  margin-top:  auto;
}

.service-cta:hover {
  color: var(--clr-aqua-light);
  gap:   10px;
}

.service-cta svg {
  transition: transform 0.2s ease;
}

.service-cta:hover svg {
  transform: translateX(4px);
}
</style>
