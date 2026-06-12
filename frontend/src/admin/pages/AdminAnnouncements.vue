<template>
  <div class="admin-page">
    <div class="adm-page-header">
      <div>
        <h1 class="adm-page-title">Announcements <span class="gradient-text">Manager</span></h1>
        <p class="adm-page-sub">{{ items.length }} total announcements</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        New Announcement
      </button>
    </div>

    <!-- Filters -->
    <div class="adm-filter-bar">
      <div class="adm-search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search announcements..." class="adm-search-input"/>
      </div>
      <div class="adm-filter-tabs">
        <button v-for="f in filters" :key="f.key" class="adm-filter-tab" :class="{ active: activeFilter === f.key }" @click="activeFilter = f.key">
          {{ f.label }} <span class="adm-tab-count">{{ f.count }}</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="adm-table-card">
      <div v-if="loading" class="adm-table-loading">
        <div class="adm-spinner-sm"></div>
        <span>Loading announcements…</span>
      </div>
      <div v-else-if="filtered.length === 0" class="adm-empty-state">
        <div class="adm-empty-icon">📢</div>
        <h3>No announcements found</h3>
        <p>{{ search ? 'Try a different search term' : 'Create your first announcement' }}</p>
        <button class="btn btn-primary" @click="openCreate">Create Announcement</button>
      </div>
      <div v-else class="adm-responsive-table">
        <table class="adm-data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th class="adm-hide-sm">Category</th>
              <th class="adm-hide-sm">Featured</th>
              <th>Status</th>
              <th class="adm-hide-md">Date</th>
              <th class="adm-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id" class="adm-table-row">
              <td>
                <div class="adm-cell-primary">
                  <span class="adm-truncate adm-truncate-lg" :title="item.title">{{ item.title }}</span>
                </div>
                <div class="adm-cell-secondary adm-hide-md">
                  <span class="adm-truncate adm-truncate-lg" :title="item.content">{{ item.content }}</span>
                </div>
              </td>
              <td class="adm-hide-sm">
                <span class="adm-category-tag" :title="item.category">{{ item.category }}</span>
              </td>
              <td class="adm-hide-sm">
                <span :class="item.is_featured ? 'adm-featured-yes' : 'adm-featured-no'">
                  {{ item.is_featured ? '★ Featured' : 'Regular' }}
                </span>
              </td>
              <td><StatusBadge :status="item.status || 'published'" /></td>
              <td class="adm-hide-md"><span class="adm-date-text">{{ formatDate(item.created_at) }}</span></td>
              <td class="adm-actions-col">
                <div class="adm-action-btns">
                  <button class="adm-action-btn adm-btn-view"    @click="openView(item)"         title="View">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </button>
                  <button class="adm-action-btn adm-btn-edit"    @click="openEdit(item)"         title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  </button>
                  <button v-if="(item.status||'published') !== 'published'" class="adm-action-btn adm-btn-approve" @click="handlePublish(item)" title="Publish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </button>
                  <button v-else class="adm-action-btn adm-btn-schedule" @click="handleUnpublish(item)" title="Unpublish">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  </button>
                  <button class="adm-action-btn adm-btn-delete" @click="confirmDelete(item)"     title="Delete">
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
          <div class="adm-modal-panel">
            <div class="adm-modal-header">
              <h3 class="adm-modal-title">{{ editingItem ? 'Edit Announcement' : 'New Announcement' }}</h3>
              <button class="adm-modal-close" @click="showForm = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="adm-modal-body">
              <div class="adm-form-row">
                <div class="adm-form-group">
                  <label class="adm-form-label">Title <span class="adm-req">*</span></label>
                  <input v-model="form.title" type="text" class="adm-form-input" placeholder="Announcement title"/>
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Category</label>
                  <select v-model="form.category" class="adm-form-select">
                    <option>General</option><option>Company News</option><option>New Service</option>
                    <option>Achievement</option><option>Milestone</option><option>Event</option>
                  </select>
                </div>
              </div>
              <div class="adm-form-group">
                <label class="adm-form-label">Content <span class="adm-req">*</span></label>
                <textarea v-model="form.content" class="adm-form-textarea" rows="5" placeholder="Announcement content…"></textarea>
              </div>
              <div class="adm-form-group">
                <label class="adm-form-label">Image (Drag & Drop or Click to Upload)</label>
                <div 
                  class="drop-zone" 
                  :class="{ 'drop-zone-active': isDragging }"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="$refs.fileInput.click()"
                >
                  <input type="file" ref="fileInput" accept="image/*" class="hidden-input" @change="handleFileSelect" />
                  <div v-if="!form.image_url" class="drop-zone-content">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p>Click or drag image here to upload</p>
                  </div>
                  <div v-else class="media-preview">
                    <img :src="form.image_url" alt="Preview" />
                    <div class="media-preview-overlay">
                      <span>{{ uploading ? 'Uploading...' : 'Click to change image' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="adm-form-group">
                <label class="adm-form-label">Status</label>
                <select v-model="form.status" class="adm-form-select">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div class="adm-form-row">
                <div class="adm-form-group">
                  <label class="adm-form-label">Publish Date</label>
                  <input v-model="form.publish_date" type="datetime-local" class="adm-form-input"/>
                </div>
                <div class="adm-form-group adm-check-group">
                  <label class="adm-check-label">
                    <input v-model="form.is_featured" type="checkbox" class="adm-check-input"/>
                    <span class="adm-check-custom"></span>
                    Mark as Featured
                  </label>
                </div>
              </div>
              <div v-if="formError" class="adm-alert-error">{{ formError }}</div>
            </div>
            <div class="adm-modal-footer">
              <button class="adm-btn-cancel" @click="showForm = false">Cancel</button>
              <button class="btn btn-primary" @click="handleSubmit" :disabled="submitting || uploading">
                <span v-if="submitting || uploading" class="adm-btn-spinner"></span>
                {{ submitting ? 'Saving…' : uploading ? 'Uploading…' : (editingItem ? 'Save Changes' : 'Create') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- View Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showView && viewItem" class="adm-modal-overlay" @click.self="showView = false">
          <div class="adm-modal-panel">
            <div class="adm-modal-header">
              <h3 class="adm-modal-title">View Announcement</h3>
              <button class="adm-modal-close" @click="showView = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="adm-modal-body adm-view-body">
              <img v-if="viewItem.image_url" :src="viewItem.image_url" class="adm-view-image" alt=""/>
              <div class="adm-view-meta">
                <span class="adm-category-tag">{{ viewItem.category }}</span>
                <StatusBadge :status="viewItem.status || 'published'" />
                <span v-if="viewItem.is_featured" class="adm-featured-yes">★ Featured</span>
              </div>
              <h2 class="adm-view-title">{{ viewItem.title }}</h2>
              <p class="adm-view-content">{{ viewItem.content }}</p>
              <div class="adm-view-dates">
                <span>Created: {{ formatDate(viewItem.created_at) }}</span>
                <span v-if="viewItem.publish_date">Scheduled: {{ formatDate(viewItem.publish_date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ConfirmModal v-model="showConfirm" title="Delete Announcement"
      :message="`Delete &quot;${deleteTarget?.title}&quot;? This cannot be undone.`"
      confirm-text="Delete" @confirm="handleDelete"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import StatusBadge  from '../components/StatusBadge.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { adminAnnouncementsApi, uploadApi } from '../services/adminApi.js'

const items = ref([]); const loading = ref(true); const search = ref('')
const activeFilter = ref('all'); const showForm = ref(false); const showView = ref(false)
const showConfirm = ref(false); const editingItem = ref(null); const viewItem = ref(null)
const deleteTarget = ref(null); const submitting = ref(false); const formError = ref('')
const isDragging = ref(false); const uploading = ref(false)
const refreshCounts = inject('refreshCounts', () => {})

const emptyForm = () => ({ title:'', content:'', category:'General', image_url:'', status:'published', is_featured:false, publish_date:'' })
const form = ref(emptyForm())

const filters = computed(() => [
  { key:'all',       label:'All',       count: items.value.length },
  { key:'published', label:'Published', count: items.value.filter(i=>(i.status||'published')==='published').length },
  { key:'draft',     label:'Draft',     count: items.value.filter(i=>i.status==='draft').length },
  { key:'scheduled', label:'Scheduled', count: items.value.filter(i=>i.status==='scheduled').length },
])
const filtered = computed(() => {
  let list = items.value
  if (activeFilter.value !== 'all') list = list.filter(i => (i.status||'published') === activeFilter.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(i => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q))
  }
  return list
})

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : '—' }
function openCreate() { editingItem.value = null; form.value = emptyForm(); formError.value = ''; showForm.value = true }
function openEdit(item) {
  editingItem.value = item
  form.value = { title:item.title, content:item.content, category:item.category, image_url:item.image_url||'', status:item.status||'published', is_featured:!!item.is_featured, publish_date:item.publish_date?item.publish_date.slice(0,16):'' }
  formError.value = ''; showForm.value = true
}
function openView(item)     { viewItem.value = item; showView.value = true }
function confirmDelete(item){ deleteTarget.value = item; showConfirm.value = true }

async function loadItems() {
  loading.value = true
  try { const res = await adminAnnouncementsApi.getAll(); items.value = res.data }
  finally { loading.value = false }
}
async function handleSubmit() {
  if (!form.value.title || !form.value.content) { formError.value = 'Title and content are required'; return }
  submitting.value = true; formError.value = ''
  try {
    if (editingItem.value) await adminAnnouncementsApi.update(editingItem.value.id, form.value)
    else await adminAnnouncementsApi.create(form.value)
    showForm.value = false; await loadItems(); refreshCounts()
  } catch(e) { formError.value = e.message }
  finally { submitting.value = false }
}
async function handleDelete() {
  if (!deleteTarget.value) return
  await adminAnnouncementsApi.delete(deleteTarget.value.id); await loadItems(); refreshCounts()
}
async function handlePublish(item)   { await adminAnnouncementsApi.publish(item.id);   await loadItems() }
async function handleUnpublish(item) { await adminAnnouncementsApi.unpublish(item.id); await loadItems() }

// File Handling
function handleFileSelect(e) { processFile(e.target.files[0]) }
function handleDrop(e) { isDragging.value = false; processFile(e.dataTransfer.files[0]) }

async function processFile(file) {
  if (!file || !file.type.startsWith('image/')) return
  uploading.value = true
  formError.value = ''
  try {
    const result = await uploadApi.uploadFile(file, 'announcements')
    form.value.image_url = result.file_url
  } catch(e) {
    formError.value = `Upload failed: ${e.message}`
  } finally {
    uploading.value = false
  }
}

onMounted(loadItems)
</script>

<style scoped>
.drop-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-input);
  position: relative;
  overflow: hidden;
}

.drop-zone:hover, .drop-zone-active {
  border-color: var(--clr-purple);
  background: rgba(139,92,246,0.05);
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
}

.drop-zone-content p { color: var(--text-primary); font-weight: 600; margin: 0; font-size: 0.9rem; }

.hidden-input { display: none; }

.media-preview {
  width: 100%;
  height: 150px;
  position: relative;
}

.media-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.media-preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.media-preview:hover .media-preview-overlay { opacity: 1; }
</style>
