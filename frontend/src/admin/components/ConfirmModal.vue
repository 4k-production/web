<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="cm-overlay" @click.self="cancel">
        <div class="cm-panel">
          <div class="cm-icon" :class="type === 'danger' ? 'cm-icon-danger' : 'cm-icon-success'">
            <svg v-if="type === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="cm-title">{{ title }}</h3>
          <p class="cm-message">{{ message }}</p>
          <div class="cm-actions">
            <button class="cm-btn-cancel" @click="cancel" :disabled="busy">Cancel</button>
            <button class="cm-btn-confirm" :class="type === 'danger' ? 'cm-danger' : 'cm-success'" @click="doConfirm" :disabled="busy">
              <span v-if="busy" class="cm-spinner"></span>
              {{ busy ? 'Processing…' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue:  { type: Boolean, default: false },
  title:       { type: String,  default: 'Confirm Action' },
  message:     { type: String,  default: 'Are you sure?' },
  confirmText: { type: String,  default: 'Confirm' },
  type:        { type: String,  default: 'danger' }
})

const emit = defineEmits(['update:modelValue', 'confirm'])
const busy = ref(false)

function cancel() {
  if (!busy.value) emit('update:modelValue', false)
}

async function doConfirm() {
  busy.value = true
  try {
    emit('confirm')
    await new Promise(r => setTimeout(r, 100))
  } finally {
    busy.value = false
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
/* Uses global CSS vars set on :root via data-theme on <html> */
.cm-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}

/* Light mode overlay tweak */
:global([data-theme="light"]) .cm-overlay {
  background: rgba(80,80,120,0.35);
}

.cm-panel {
  width: 100%; max-width: 440px; padding: 40px 32px; text-align: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(24px);
}

.cm-icon {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.cm-icon svg      { width: 30px; height: 30px; }
.cm-icon-danger   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.3);  color: #f87171; }
.cm-icon-success  { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; }

.cm-title   { font-family: 'Syne',sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
.cm-message { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin-bottom: 28px; }

.cm-actions { display: flex; gap: 12px; justify-content: center; }

.cm-btn-cancel, .cm-btn-confirm {
  padding: 10px 24px; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; border: none;
  display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-body);
}
.cm-btn-cancel {
  background: var(--glass-bg); border: var(--glass-border); color: var(--text-secondary);
}
.cm-btn-cancel:hover:not(:disabled) { background: var(--bg-card-hover); color: var(--text-primary); }

.cm-danger  { background: linear-gradient(135deg,#ef4444,#dc2626); color: #fff; box-shadow: 0 4px 20px rgba(239,68,68,0.3); }
.cm-danger:hover:not(:disabled)  { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(239,68,68,0.5); }
.cm-success { background: linear-gradient(135deg,#10b981,#059669); color: #fff; box-shadow: 0 4px 20px rgba(16,185,129,0.3); }
.cm-success:hover:not(:disabled) { transform: translateY(-2px); }

.cm-btn-cancel:disabled, .cm-btn-confirm:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }

.cm-spinner {
  width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%; animation: cm-spin 0.6s linear infinite;
}
@keyframes cm-spin { to { transform: rotate(360deg); } }

.modal-enter-active, .modal-leave-active { transition: all 0.28s cubic-bezier(0.4,0,0.2,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .cm-panel, .modal-leave-to .cm-panel { transform: scale(0.9) translateY(16px); }
</style>
