<template>
  <span class="status-badge" :class="badgeClass">
    <span class="status-dot"></span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const map = {
  pending:   { cls: 'badge-pending',   label: 'Pending'   },
  reviewed:  { cls: 'badge-reviewed',  label: 'Reviewed'  },
  approved:  { cls: 'badge-approved',  label: 'Approved'  },
  confirmed: { cls: 'badge-confirmed', label: 'Confirmed' },
  dismissed: { cls: 'badge-dismissed', label: 'Dismissed' },
  completed: { cls: 'badge-completed', label: 'Completed' },
  published: { cls: 'badge-published', label: 'Published' },
  draft:     { cls: 'badge-draft',     label: 'Draft'     },
  scheduled: { cls: 'badge-scheduled', label: 'Scheduled' },
  read:      { cls: 'badge-read',      label: 'Read'      },
  unread:    { cls: 'badge-unread',    label: 'Unread'    },
}

const resolved = computed(() => map[props.status?.toLowerCase()] || { cls: 'badge-default', label: props.status })
const badgeClass = computed(() => resolved.value.cls)
const label      = computed(() => resolved.value.label)
</script>

<style scoped>
.status-badge {
  display:      inline-flex;
  align-items:  center;
  gap:          6px;
  padding:      4px 12px;
  border-radius: 9999px;
  font-size:    0.75rem;
  font-weight:  600;
  white-space:  nowrap;
  letter-spacing: 0.02em;
}

.status-dot {
  width:  6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Pending */
.badge-pending  { background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24; }
.badge-pending .status-dot { background: #fbbf24; box-shadow: 0 0 6px #fbbf24; }

/* Reviewed */
.badge-reviewed { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; }
.badge-reviewed .status-dot { background: #a5b4fc; }

/* Approved / Confirmed / Completed / Published */
.badge-approved, .badge-confirmed, .badge-completed, .badge-published {
  background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399;
}
.badge-approved .status-dot, .badge-confirmed .status-dot,
.badge-completed .status-dot, .badge-published .status-dot {
  background: #34d399; box-shadow: 0 0 6px #34d399;
}

/* Dismissed / Draft */
.badge-dismissed, .badge-draft {
  background: rgba(148,163,184,0.12); border: 1px solid rgba(148,163,184,0.2); color: #94a3b8;
}
.badge-dismissed .status-dot, .badge-draft .status-dot { background: #94a3b8; }

/* Scheduled */
.badge-scheduled { background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.3); color: #22d3ee; }
.badge-scheduled .status-dot { background: #22d3ee; box-shadow: 0 0 6px #22d3ee; }

/* Read */
.badge-read { background: rgba(148,163,184,0.1); border: 1px solid rgba(148,163,184,0.15); color: #64748b; }
.badge-read .status-dot { background: #64748b; }

/* Unread */
.badge-unread { background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); color: #a78bfa; }
.badge-unread .status-dot { background: #a78bfa; box-shadow: 0 0 6px #a78bfa; }

.badge-default { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; }
.badge-default .status-dot { background: #94a3b8; }
</style>
