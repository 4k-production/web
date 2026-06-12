<template>
  <div class="admin-page">
    <div class="adm-page-header">
      <div>
        <h1 class="adm-page-title">Events <span class="gradient-text">Room</span></h1>
        <p class="adm-page-sub">{{ events.length }} events uploaded</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Add Event
      </button>
    </div>

    <div class="adm-table-card">
      <div v-if="loading" class="adm-table-loading"><div class="adm-spinner-sm"></div><span>Loading…</span></div>
      <div v-else-if="events.length === 0" class="adm-empty-state">
        <div class="adm-empty-icon">📸</div>
        <h3>No events yet</h3>
        <p>Upload your first event for clients</p>
        <button class="btn btn-primary" @click="openCreate">Add Event</button>
      </div>
      <div v-else class="adm-responsive-table">
        <table class="adm-data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Client</th>
              <th>Date</th>
              <th>Photos</th>
              <th>Video</th>
              <th class="adm-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id" class="adm-table-row">
              <td>
                <div class="adm-event-cell">
                  <div class="adm-event-thumb" v-if="event.photos && event.photos.length">
                    <img :src="getMediaUrl(event.photos[0])" :alt="event.event_name" />
                  </div>
                  <div class="adm-event-thumb adm-event-thumb-empty" v-else>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"/>
                    </svg>
                  </div>
                  <div class="adm-cell-primary">{{ event.event_name }}</div>
                </div>
              </td>
              <td>{{ event.client_name || '—' }}</td>
              <td>{{ formatDate(event.event_date) }}</td>
              <td>{{ event.photos?.length || 0 }} photos</td>
              <td>
                <span v-if="event.video_url" class="adm-type-badge adm-type-video">Video</span>
                <span v-else>—</span>
              </td>
              <td class="adm-actions-col">
                <div class="adm-action-btns">
                  <button class="adm-action-btn adm-btn-edit" @click="openEdit(event)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  </button>
                  <button class="adm-action-btn adm-btn-delete" @click="confirmDelete(event)" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showForm" class="adm-modal-overlay" @click.self="showForm = false">
          <div class="adm-modal-panel adm-modal-wide">
            <div class="adm-modal-header">
              <h3 class="adm-modal-title">{{ editingEvent ? 'Edit Event' : 'Add New Event' }}</h3>
              <button class="adm-modal-close" @click="showForm = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="adm-modal-body">
              <div class="adm-form-row">
                <div class="adm-form-group">
                  <label class="adm-form-label">Event Name <span class="adm-req">*</span></label>
                  <input v-model="form.event_name" type="text" class="adm-form-input" placeholder="e.g. John & Jane Wedding"/>
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Client Name</label>
                  <input v-model="form.client_name" type="text" class="adm-form-input" placeholder="e.g. John Doe"/>
                </div>
              </div>
              <div class="adm-form-row">
                <div class="adm-form-group">
                  <label class="adm-form-label">Event Date</label>
                  <input v-model="form.event_date" type="date" class="adm-form-input"/>
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Video Highlight URL</label>
                  <input v-model="form.video_url" type="text" class="adm-form-input" placeholder="YouTube, Vimeo or direct link"/>
                </div>
              </div>

              <!-- Drag & Drop Photos -->
              <div class="adm-form-group">
                <label class="adm-form-label">Event Photos (Drag & Drop)</label>
                <div 
                  class="drop-zone" 
                  :class="{ 'drop-zone-active': isDragging }"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="$refs.fileInput.click()"
                >
                  <input type="file" ref="fileInput" multiple accept="image/*" class="hidden-input" @change="handleFileSelect" />
                  <div class="drop-zone-content">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p>Click or drag photos here to upload</p>
                    <span>Supports JPG, PNG, WEBP</span>
                  </div>
                </div>

                <!-- Photo Preview Grid -->
                <div v-if="form.photos.length" class="photo-preview-grid">
                  <div v-for="(photo, i) in form.photos" :key="i" class="photo-preview-item">
                    <img :src="getMediaUrl(photo)" alt="Preview" />
                    <button class="remove-photo" @click.stop="removePhoto(i)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="formError" class="adm-alert-error">{{ formError }}</div>
            </div>
            <div class="adm-modal-footer">
              <button class="adm-btn-cancel" @click="showForm = false">Cancel</button>
              <button class="btn btn-primary" @click="handleSubmit" :disabled="submitting || uploading">
                <span v-if="submitting || uploading" class="adm-btn-spinner"></span>
                {{ submitting ? 'Saving…' : uploading ? 'Uploading…' : (editingEvent ? 'Save Changes' : 'Create Event') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ConfirmModal v-model="showConfirm" title="Delete Event"
      :message="`Delete &quot;${deleteTarget?.event_name}&quot;? This will remove all associated photos and video links.`"
      confirm-text="Delete" @confirm="handleDelete"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { adminEventsApi, uploadApi } from '../services/adminApi.js'

const events = ref([]); const loading = ref(true)
const showForm = ref(false); const showConfirm = ref(false)
const editingEvent = ref(null); const deleteTarget = ref(null)
const submitting = ref(false); const formError = ref('')
const isDragging = ref(false)
const uploading = ref(false)

const emptyForm = () => ({ event_name:'', client_name:'', event_date:'', video_url:'', photos:[] })
const form = ref(emptyForm())

const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${url}`;
};

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : '—' }

function openCreate() { editingEvent.value = null; form.value = emptyForm(); formError.value = ''; showForm.value = true }
function openEdit(event) {
  editingEvent.value = event
  form.value = { 
    event_name: event.event_name, 
    client_name: event.client_name || '', 
    event_date: event.event_date ? event.event_date.split('T')[0] : '', 
    video_url: event.video_url || '', 
    photos: [...(event.photos || [])] 
  }
  formError.value = ''; showForm.value = true
}

function confirmDelete(event) { deleteTarget.value = event; showConfirm.value = true }

async function loadEvents() {
  loading.value = true
  try { const res = await adminEventsApi.getAll(); events.value = res.data }
  finally { loading.value = false }
}

async function handleSubmit() {
  if (!form.value.event_name) { formError.value='Event name is required'; return }
  submitting.value = true; formError.value = ''
  try {
    if (editingEvent.value) await adminEventsApi.update(editingEvent.value.id, form.value)
    else await adminEventsApi.create(form.value)
    showForm.value = false; await loadEvents()
  } catch(e) { formError.value = e.message }
  finally { submitting.value = false }
}

async function handleDelete() {
  if (!deleteTarget.value) return
  await adminEventsApi.delete(deleteTarget.value.id); await loadEvents()
}

// File Handling
function handleFileSelect(e) {
  const files = Array.from(e.target.files)
  processFiles(files)
}

function handleDrop(e) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  processFiles(files)
}

async function processFiles(files) {
  uploading.value = true
  formError.value = ''
  try {
    const result = await uploadApi.uploadMultiple(files, 'events')
    form.value.photos.push(...result.file_urls)
  } catch(e) {
    formError.value = `Upload failed: ${e.message}`
  } finally {
    uploading.value = false
  }
}

function removePhoto(index) {
  form.value.photos.splice(index, 1)
}

onMounted(loadEvents)
</script>

<style scoped>
.adm-type-video { background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.2); color:#a78bfa; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }

/* Thumbnail + name cell */
.adm-event-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.adm-event-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--adm-surface);
  border: 1px solid var(--adm-border);
}

.adm-event-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.adm-table-row:hover .adm-event-thumb img { transform: scale(1.08); }

.adm-event-thumb-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--adm-text4);
}

.drop-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-input);
}

.drop-zone:hover, .drop-zone-active {
  border-color: var(--clr-purple);
  background: rgba(139,92,246,0.05);
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
}

.drop-zone-content p { color: var(--text-primary); font-weight: 600; margin: 0; }
.drop-zone-content span { font-size: 0.8rem; }

.hidden-input { display: none; }

.photo-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.photo-preview-item {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.photo-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(239,68,68,0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.remove-photo:hover { transform: scale(1.1); }
</style>
