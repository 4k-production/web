<template>
  <article
    class="announcement-card glass-card reveal"
    :class="[`reveal-delay-${delay}`, { featured: announcement.is_featured }]"
  >
    <!-- Featured banner -->
    <div v-if="announcement.is_featured" class="featured-strip">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Featured
    </div>

    <!-- Card header -->
    <div class="card-header">
      <span class="glass-tag glass-tag-aqua category-tag">{{ announcement.category || 'General' }}</span>
      <time class="card-date">{{ formatDate(announcement.created_at) }}</time>
    </div>

    <!-- Title -->
    <h3 class="card-title">{{ announcement.title }}</h3>

    <!-- Content preview -->
    <p class="card-content">{{ truncate(announcement.content, 150) }}</p>

    <!-- Read more -->
    <button class="card-more" @click="expanded = !expanded">
      {{ expanded ? 'Show Less ↑' : 'Read More ↓' }}
    </button>

    <!-- Full content (expanded) -->
    <transition name="expand">
      <div v-if="expanded" class="card-full-content">
        <p>{{ announcement.content }}</p>
      </div>
    </transition>
  </article>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  announcement: { type: Object, required: true },
  delay:        { type: Number, default: 1 }
})

const expanded = ref(false)

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}
</script>

<style scoped>
.announcement-card {
  padding:  28px;
  display:  flex;
  flex-direction: column;
  gap:      0;
  position: relative;
  overflow: hidden;
}

.announcement-card.featured {
  border-color: rgba(139,92,246,0.3);
  box-shadow:   0 8px 40px rgba(139,92,246,0.15);
}

/* Featured strip */
.featured-strip {
  position:    absolute;
  top:         16px;
  right:       -28px;
  display:     flex;
  align-items: center;
  gap:         5px;
  padding:     4px 40px;
  background:  var(--grad-primary);
  color:       #fff;
  font-size:   0.72rem;
  font-weight: 700;
  transform:   rotate(30deg);
}

/* Header */
.card-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  margin-bottom:   16px;
  flex-wrap:       wrap;
  gap:             8px;
}

.category-tag {
  font-size: 0.75rem;
}

.card-date {
  font-size:  0.8rem;
  color:      var(--text-muted);
  font-style: normal;
}

/* Title */
.card-title {
  font-size:     1.1rem;
  font-weight:   700;
  color:         var(--text-primary);
  margin-bottom: 12px;
  line-height:   1.35;
}

/* Content */
.card-content {
  font-size:     0.9rem;
  color:         var(--text-secondary);
  line-height:   1.7;
  flex:          1;
  margin-bottom: 16px;
}

/* Full content */
.card-full-content {
  margin-bottom: 12px;
  padding-top:   12px;
  border-top:    1px solid var(--border-color);
}

.card-full-content p {
  font-size:   0.9rem;
  color:       var(--text-secondary);
  line-height: 1.75;
}

/* Read more */
.card-more {
  display:     inline-flex;
  align-items: center;
  gap:         4px;
  font-size:   0.825rem;
  font-weight: 600;
  color:       var(--clr-purple-light);
  background:  none;
  border:      none;
  cursor:      pointer;
  padding:     0;
  transition:  var(--transition-fast);
  margin-top:  auto;
}

.card-more:hover {
  color: var(--clr-aqua-light);
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition:    max-height 0.35s ease, opacity 0.3s ease;
  overflow:      hidden;
  max-height:    400px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity:    0;
}
</style>
