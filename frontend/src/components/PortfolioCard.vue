<template>
  <div
    class="portfolio-card reveal"
    :class="`reveal-delay-${delay}`"
    @click="$emit('open', item)"
  >
    <!-- Image / thumbnail -->
    <div class="portfolio-media">
      <img
        :src="getPreviewUrl(item)"
        :alt="item.title"
        loading="lazy"
        @error="onImgError"
      />

      <!-- Video play indicator overlay (always visible for videos) -->
      <div v-if="item.media_type === 'video'" class="video-indicator">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      </div>

      <!-- Overlay on hover -->
      <div class="portfolio-overlay">
        <div class="portfolio-overlay-content">
          <div class="overlay-icon">
            <svg v-if="item.media_type === 'video'" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <span>View Project</span>
        </div>
      </div>

      <!-- Category badge -->
      <div class="portfolio-badge glass-tag-purple glass-tag">
        {{ item.category }}
      </div>

      <!-- Featured star -->
      <div v-if="item.is_featured" class="featured-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        Featured
      </div>
    </div>

    <!-- Info -->
    <div class="portfolio-info">
      <h3 class="portfolio-title">{{ item.title }}</h3>
      <p v-if="item.client" class="portfolio-client">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        {{ item.client }}
      </p>
      <p v-if="item.description" class="portfolio-desc">
        {{ truncate(item.description, 80) }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item:  { type: Object,  required: true },
  delay: { type: Number,  default: 1 }
})

defineEmits(['open'])

const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${url}`;
};

// For display: videos use thumbnail image if available, else fall back to media_url
const getPreviewUrl = (item) => {
  if (!item) return ''
  if (item.media_type === 'video' && item.thumbnail) {
    return getMediaUrl(item.thumbnail)
  }
  return getMediaUrl(item.media_url || item.thumbnail || '')
};

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

function onImgError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600'
}
</script>

<style scoped>
.portfolio-card {
  border-radius: var(--radius-lg);
  overflow:      hidden;
  cursor:        pointer;
  background:    var(--glass-bg);
  border:        var(--glass-border);
  backdrop-filter: var(--glass-blur);
  transition:    var(--transition-med);
  box-shadow:    var(--glass-shadow);
}

.portfolio-card:hover {
  transform:    translateY(-6px);
  box-shadow:   var(--shadow-glow);
  border-color: var(--border-glow);
}

/* Media area */
.portfolio-media {
  position:     relative;
  aspect-ratio: 16 / 10;
  overflow:     hidden;
}

.portfolio-media img {
  width:      100%;
  height:     100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.portfolio-card:hover .portfolio-media img {
  transform: scale(1.06);
}

/* Video indicator */
.video-indicator {
  position:        absolute;
  bottom:          10px;
  right:           10px;
  width:           36px;
  height:          36px;
  border-radius:   50%;
  background:      rgba(0,0,0,0.55);
  border:          1.5px solid rgba(255,255,255,0.4);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  backdrop-filter: blur(6px);
  padding-left:    2px; /* optical center for play icon */
  z-index:         2;
  pointer-events:  none;
}

/* Overlay */
.portfolio-overlay {
  position:   absolute;
  inset:      0;
  background: linear-gradient(135deg, rgba(139,92,246,0.75), rgba(6,182,212,0.65));
  display:    flex;
  align-items:     center;
  justify-content: center;
  opacity:    0;
  transition: opacity 0.35s ease;
}

.portfolio-card:hover .portfolio-overlay {
  opacity: 1;
}

.portfolio-overlay-content {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            10px;
  color:          #fff;
  transform:      translateY(8px);
  transition:     transform 0.35s ease;
}

.portfolio-card:hover .portfolio-overlay-content {
  transform: translateY(0);
}

.overlay-icon {
  width:           48px;
  height:          48px;
  border-radius:   var(--radius-full);
  background:      rgba(255,255,255,0.2);
  border:          2px solid rgba(255,255,255,0.5);
  display:         flex;
  align-items:     center;
  justify-content: center;
}

.overlay-icon svg {
  width:  20px;
  height: 20px;
  color:  #fff;
}

.portfolio-overlay-content span {
  font-size:   0.85rem;
  font-weight: 600;
  color:       #fff;
}

/* Badges */
.portfolio-badge {
  position:    absolute;
  top:         12px;
  left:        12px;
  font-size:   0.72rem;
}

.featured-badge {
  position:    absolute;
  top:         12px;
  right:       12px;
  display:     flex;
  align-items: center;
  gap:         4px;
  padding:     4px 10px;
  border-radius: var(--radius-full);
  background:  rgba(234,179,8,0.15);
  border:      1px solid rgba(234,179,8,0.3);
  color:       #fbbf24;
  font-size:   0.7rem;
  font-weight: 600;
}

/* Info */
.portfolio-info {
  padding: 16px 20px 20px;
}

.portfolio-title {
  font-size:     1rem;
  font-weight:   700;
  color:         var(--text-primary);
  margin-bottom: 6px;
}

.portfolio-client {
  display:       flex;
  align-items:   center;
  gap:           5px;
  font-size:     0.8rem;
  color:         var(--clr-aqua-light);
  font-weight:   500;
  margin-bottom: 8px;
}

.portfolio-client svg {
  flex-shrink: 0;
}

.portfolio-desc {
  font-size:   0.83rem;
  color:       var(--text-muted);
  line-height: 1.5;
}
</style>
