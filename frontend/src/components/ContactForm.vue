<template>
  <form class="contact-form" @submit.prevent="submitForm" novalidate>
    <!-- Alert messages -->
    <transition name="fade">
      <div v-if="successMsg" class="alert alert-success">
        {{ successMsg }}
      </div>
    </transition>
    <transition name="fade">
      <div v-if="errorMsg" class="alert alert-error">
        {{ errorMsg }}
      </div>
    </transition>

    <!-- Name + Email row -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="c-name">Full Name *</label>
        <input
          id="c-name"
          v-model.trim="form.name"
          type="text"
          class="form-input glass-input"
          placeholder="Your full name"
          :class="{ 'input-error': errors.name }"
          autocomplete="name"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="c-email">Email Address *</label>
        <input
          id="c-email"
          v-model.trim="form.email"
          type="email"
          class="form-input glass-input"
          placeholder="your@email.com"
          :class="{ 'input-error': errors.email }"
          autocomplete="email"
        />
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>
    </div>

    <!-- Phone -->
    <div class="form-group">
      <label class="form-label" for="c-phone">Phone Number</label>
      <input
        id="c-phone"
        v-model.trim="form.phone"
        type="tel"
        class="form-input glass-input"
        placeholder="+250 700 000 000"
        autocomplete="tel"
      />
    </div>

    <!-- Message -->
    <div class="form-group">
      <label class="form-label" for="c-message">Message *</label>
      <textarea
        id="c-message"
        v-model.trim="form.message"
        class="form-textarea glass-input"
        placeholder="Tell us how we can help you..."
        rows="5"
        :class="{ 'input-error': errors.message }"
      ></textarea>
      <span v-if="errors.message" class="field-error">{{ errors.message }}</span>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="btn btn-primary submit-btn"
      :disabled="loading"
    >
      <span v-if="loading" class="btn-spinner"></span>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      {{ loading ? 'Sending…' : 'Send Message' }}
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { contactApi } from '@/services/api.js'

const loading    = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

const form = reactive({
  name:    '',
  email:   '',
  phone:   '',
  message: ''
})

const errors = reactive({
  name:    '',
  email:   '',
  message: ''
})

function validate() {
  let valid = true
  errors.name    = ''
  errors.email   = ''
  errors.message = ''

  if (!form.name) {
    errors.name = 'Name is required.'
    valid = false
  }
  if (!form.email) {
    errors.email = 'Email is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email.'
    valid = false
  }
  if (!form.message) {
    errors.message = 'Message is required.'
    valid = false
  }

  return valid
}

async function submitForm() {
  successMsg.value = ''
  errorMsg.value   = ''

  if (!validate()) return

  loading.value = true
  try {
    const res = await contactApi.send({ ...form })
    successMsg.value = res.message || 'Message sent successfully!'
    // Reset form
    Object.assign(form, { name: '', email: '', phone: '', message: '' })
  } catch (err) {
    errorMsg.value = err.message || 'Failed to send message. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-form { width: 100%; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group { margin-bottom: 20px; }

.form-label {
  display:       block;
  margin-bottom: 8px;
  font-size:     0.875rem;
  font-weight:   500;
  color:         var(--text-secondary);
}

.form-input,
.form-textarea {
  width:  100%;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  padding: 12px 16px;
  transition: var(--transition-fast);
  font-family: var(--font-body);
}

.form-input::placeholder,
.form-textarea::placeholder { color: var(--text-muted); }

.form-input:focus,
.form-textarea:focus {
  border-color: var(--clr-purple);
  box-shadow:   0 0 0 3px rgba(139,92,246,0.15);
  background:   var(--bg-card-hover);
}

.form-textarea { resize: vertical; min-height: 130px; }

.input-error { border-color: #ef4444 !important; }

.field-error {
  display:    block;
  font-size:  0.78rem;
  color:      #f87171;
  margin-top: 5px;
}

.submit-btn {
  width:           100%;
  justify-content: center;
  padding:         14px;
  font-size:       1rem;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor:  not-allowed;
}

.btn-spinner {
  width:       16px;
  height:      16px;
  border:      2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation:   spin 0.7s linear infinite;
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
