<template>
  <form class="request-form" @submit.prevent="submitForm" novalidate>
    <!-- Alerts -->
    <transition name="fade">
      <div v-if="successMsg" class="alert alert-success">
        🎉 {{ successMsg }}
      </div>
    </transition>
    <transition name="fade">
      <div v-if="errorMsg" class="alert alert-error">
        ⚠️ {{ errorMsg }}
      </div>
    </transition>

    <!-- Name + Email -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="r-name">Full Name *</label>
        <input
          id="r-name"
          v-model.trim="form.name"
          type="text"
          class="form-input"
          placeholder="Your full name"
          :class="{ 'input-error': errors.name }"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>
      <div class="form-group">
        <label class="form-label" for="r-email">Email Address *</label>
        <input
          id="r-email"
          v-model.trim="form.email"
          type="email"
          class="form-input"
          placeholder="your@email.com"
          :class="{ 'input-error': errors.email }"
        />
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>
    </div>

    <!-- Phone + Service type -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="r-phone">Phone Number</label>
        <input
          id="r-phone"
          v-model.trim="form.phone"
          type="tel"
          class="form-input"
          placeholder="+250 700 000 000"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="r-service">Service Type *</label>
        <select
          id="r-service"
          v-model="form.service_type"
          class="form-select"
          :class="{ 'input-error': errors.service_type }"
        >
          <option value="" disabled>Select a service</option>
          <option v-for="s in services" :key="s" :value="s">{{ s }}</option>
        </select>
        <span v-if="errors.service_type" class="field-error">{{ errors.service_type }}</span>
      </div>
    </div>

    <!-- Event Date + Budget -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="r-date">Event / Project Date</label>
        <input
          id="r-date"
          v-model="form.event_date"
          type="date"
          class="form-input"
          :min="today"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="r-budget">Budget Range</label>
        <select
          id="r-budget"
          v-model="form.budget"
          class="form-select"
        >
          <option value="">Select budget (optional)</option>
          <option value="Under $500">Under $500</option>
          <option value="$500 - $1,000">$500 – $1,000</option>
          <option value="$1,000 - $2,500">$1,000 – $2,500</option>
          <option value="$2,500 - $5,000">$2,500 – $5,000</option>
          <option value="$5,000 - $10,000">$5,000 – $10,000</option>
          <option value="$10,000+">$10,000+</option>
          <option value="To be discussed">To be discussed</option>
        </select>
      </div>
    </div>

    <!-- Message -->
    <div class="form-group">
      <label class="form-label" for="r-message">Project Details</label>
      <textarea
        id="r-message"
        v-model.trim="form.message"
        class="form-textarea"
        placeholder="Describe your project, goals, requirements, or any special requests..."
        rows="5"
      ></textarea>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="btn btn-primary submit-btn btn-animated"
      :disabled="loading"
    >
      <span v-if="loading" class="btn-spinner"></span>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      {{ loading ? 'Submitting Request…' : 'Submit Service Request' }}
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { requestsApi } from '@/services/api.js'

const loading    = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

const today = new Date().toISOString().split('T')[0]

const services = [
  'Video Production',
  'Photography',
  'Event Coverage',
  'Documentary Production',
  'Video Editing',
  'Motion Graphics',
  'Commercial Ads Production',
  'Live Streaming Services',
  'Full Package'
]

const form = reactive({
  name:         '',
  email:        '',
  phone:        '',
  service_type: '',
  event_date:   '',
  budget:       '',
  message:      ''
})

const errors = reactive({
  name:         '',
  email:        '',
  service_type: ''
})

function validate() {
  let valid = true
  errors.name         = ''
  errors.email        = ''
  errors.service_type = ''

  if (!form.name) { errors.name = 'Name is required.'; valid = false }
  if (!form.email) {
    errors.email = 'Email is required.'; valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'; valid = false
  }
  if (!form.service_type) { errors.service_type = 'Please select a service.'; valid = false }

  return valid
}

async function submitForm() {
  successMsg.value = ''
  errorMsg.value   = ''

  if (!validate()) return

  loading.value = true
  try {
    const payload = { ...form }
    if (!payload.event_date) delete payload.event_date

    const res = await requestsApi.create(payload)
    successMsg.value = res.message || 'Request submitted successfully!'
    Object.assign(form, {
      name: '', email: '', phone: '', service_type: '',
      event_date: '', budget: '', message: ''
    })
  } catch (err) {
    errorMsg.value = err.message || 'Submission failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.request-form { width: 100%; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group { margin-bottom: 20px; }

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
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
.form-textarea:focus,
.form-select:focus {
  border-color: var(--clr-purple);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
  background: var(--bg-card-hover);
  outline: none;
}

.form-select option {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Date input calendar icon color */
.form-input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

.form-textarea { resize: vertical; min-height: 130px; }

.input-error { border-color: #ef4444 !important; }

.field-error {
  display: block;
  font-size: 0.78rem;
  color: #f87171;
  margin-top: 5px;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  padding: 15px;
  font-size: 1rem;
}

.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
