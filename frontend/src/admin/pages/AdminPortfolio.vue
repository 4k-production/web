<template>
  <div class="admin-page">
    <div class="adm-page-header">
      <div>
        <h1 class="adm-page-title">Portfolio <span class="gradient-text">Manager</span></h1>
        <p class="adm-page-sub">{{ items.length }} items in portfolio</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Add Item
      </button>
    </div>

    <div class="adm-filter-bar">
      <div class="adm-search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
        <input v-model="search" type="text" placeholder="Search portfolio…" class="adm-search-input"/>
      </div>
    </div>

    <div class="adm-table-card">
      <div v-if="loading" class="adm-table-loading"><div class="adm-spinner-sm"></div><span>Loading…</span></div>
      <div v-else-if="filtered.length === 0" class="adm-empty-state">
        <div class="adm-empty-icon">🎬</div>
        <h3>No portfolio items</h3>
        <p>Add your first portfolio item</p>
        <button class="btn btn-primary" @click="openCreate">Add Item</button>
      </div>
      <div v-else class="adm-responsive-table">
        <table class="adm-data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th class="adm-hide-sm">Category</th>
              <th class="adm-hide-md">Client</th>
              <th class="adm-hide-sm">Type</th>
              <th class="adm-hide-sm">Featured</th>
              <th class="adm-hide-md">Date</th>
              <th class="adm-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id" class="adm-table-row">
              <td>
                <div class="adm-portfolio-cell">
                  <img v-if="item.thumbnail || item.media_url" :src="getMediaUrl(item.thumbnail || item.media_url)" class="adm-thumb" alt="" @error="e => e.target.style.display='none'"/>
                  <div>
                    <div class="adm-cell-primary">
                      <span class="adm-truncate adm-truncate-lg" :title="item.title">{{ item.title }}</span>
                    </div>
                    <div class="adm-cell-secondary">
                      <span class="adm-truncate adm-truncate-lg" :title="item.description">{{ item.description }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="adm-hide-sm">
                <span class="adm-category-tag" :title="item.category">{{ item.category }}</span>
              </td>
              <td class="adm-hide-md">
                <span class="adm-date-text adm-truncate adm-truncate-sm" :title="item.client">{{ item.client || '—' }}</span>
              </td>
              <td class="adm-hide-sm">
                <span class="adm-type-badge" :class="item.media_type==='video' ? 'adm-type-video' : 'adm-type-image'">
                  {{ item.media_type }}
                </span>
              </td>
              <td class="adm-hide-sm">
                <span :class="item.is_featured ? 'adm-featured-yes' : 'adm-featured-no'">
                  {{ item.is_featured ? '★ Yes' : 'No' }}
                </span>
              </td>
              <td class="adm-hide-md"><span class="adm-date-text">{{ formatDate(item.created_at) }}</span></td>
              <td class="adm-actions-col">
                <div class="adm-action-btns">
                  <button class="adm-action-btn adm-btn-edit" @click="openEdit(item)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  </button>
                  <button class="adm-action-btn adm-btn-delete" @click="confirmDelete(item)" title="Delete">
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
              <h3 class="adm-modal-title">{{ editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item' }}</h3>
              <button class="adm-modal-close" @click="showForm = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="adm-modal-body">
              <div class="adm-form-row">
                <div class="adm-form-group">
                  <label class="adm-form-label">Title <span class="adm-req">*</span></label>
                  <input v-model="form.title" type="text" class="adm-form-input" placeholder="Project title"/>
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Category <span class="adm-req">*</span></label>
                  <input v-model="form.category" type="text" class="adm-form-input" placeholder="Commercial, Documentary…"/>
                </div>
              </div>
              <div class="adm-form-group">
                <label class="adm-form-label">Description</label>
                <textarea v-model="form.description" class="adm-form-textarea" rows="3" placeholder="Brief description…"></textarea>
              </div>
              <div class="adm-form-group">
                <label class="adm-form-label">Media (Drag & Drop or Click to Upload) <span class="adm-req">*</span></label>
                <div 
                  class="drop-zone" 
                  :class="{ 'drop-zone-active': isDraggingMedia }"
                  @dragover.prevent="isDraggingMedia = true"
                  @dragleave.prevent="isDraggingMedia = false"
                  @drop.prevent="handleMediaDrop"
                  @click="$refs.mediaInput.click()"
                >
                  <input type="file" ref="mediaInput" accept="image/*,video/*" class="hidden-input" @change="handleMediaSelect" />
                  <div v-if="!form.media_url" class="drop-zone-content">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p>Click or drag media here to upload</p>
                    <span>Supports JPG, PNG, WEBP, MP4</span>
                  </div>
                  <div v-else class="media-preview">
                    <img v-if="form.media_type === 'image'" :src="getMediaUrl(form.media_url)" alt="Preview" />
                    <video v-else :src="getMediaUrl(form.media_url)" muted></video>
                    <div class="media-preview-overlay">
                      <span>{{ uploading ? 'Uploading...' : 'Click to change media' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="form.media_type === 'video'" class="adm-form-group">
                <label class="adm-form-label">Thumbnail (Optional)</label>
                <div 
                  class="drop-zone drop-zone-sm" 
                  :class="{ 'drop-zone-active': isDraggingThumb }"
                  @dragover.prevent="isDraggingThumb = true"
                  @dragleave.prevent="isDraggingThumb = false"
                  @drop.prevent="handleThumbDrop"
                  @click="$refs.thumbInput.click()"
                >
                  <input type="file" ref="thumbInput" accept="image/*" class="hidden-input" @change="handleThumbSelect" />
                  <div v-if="!form.thumbnail" class="drop-zone-content">
                    <p>Click or drag thumbnail here</p>
                  </div>
                  <div v-else class="media-preview">
                    <img :src="getMediaUrl(form.thumbnail)" alt="Thumbnail Preview" />
                  </div>
                </div>
              </div>
              <div class="adm-form-row">
                <div class="adm-form-group">
                  <label class="adm-form-label">Media Type</label>
                  <select v-model="form.media_type" class="adm-form-select">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div class="adm-form-group">
                  <label class="adm-form-label">Client</label>
                  <input v-model="form.client" type="text" class="adm-form-input" placeholder="Client name"/>
                </div>
              </div>
              <div class="adm-check-group">
                <label class="adm-check-label">
                  <input v-model="form.is_featured" type="checkbox" class="adm-check-input"/>
                  <span class="adm-check-custom"></span>
                  Mark as Featured
                </label>
              </div>
              <div v-if="formError" class="adm-alert-error">{{ formError }}</div>
            </div>
            <div class="adm-modal-footer">
              <button class="adm-btn-cancel" @click="showForm = false">Cancel</button>
              <button class="btn btn-primary" @click="handleSubmit" :disabled="submitting || uploading">
                <span v-if="submitting || uploading" class="adm-btn-spinner"></span>
                {{ submitting ? 'Saving…' : uploading ? 'Uploading…' : (editingItem ? 'Save Changes' : 'Add Item') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ConfirmModal v-model="showConfirm" title="Delete Portfolio Item"
      :message="`Delete &quot;${deleteTarget?.title}&quot;? This cannot be undone.`"
      confirm-text="Delete" @confirm="handleDelete"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { adminPortfolioApi, uploadApi } from '../services/adminApi.js'

const items = ref([]); const loading = ref(true); const search = ref('')
const showForm = ref(false); const showConfirm = ref(false)
const editingItem = ref(null); const deleteTarget = ref(null)
const submitting = ref(false); const formError = ref('')
const isDraggingMedia = ref(false); const isDraggingThumb = ref(false)
const uploading = ref(false)

const emptyForm = () => ({ title:'', category:'', description:'', media_url:'', thumbnail:'', media_type:'image', client:'', is_featured:false })
const form = ref(emptyForm())

const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${url}`;
};

const filtered = computed(() => {
  if (!search.value.trim()) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
})

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : '—' }
function openCreate() { editingItem.value = null; form.value = emptyForm(); formError.value = ''; showForm.value = true }
function openEdit(item) {
  editingItem.value = item
  form.value = { title:item.title, category:item.category, description:item.description||'', media_url:item.media_url, thumbnail:item.thumbnail||'', media_type:item.media_type, client:item.client||'', is_featured:!!item.is_featured }
  formError.value = ''; showForm.value = true
}
function confirmDelete(item) { deleteTarget.value = item; showConfirm.value = true }

async function loadItems() {
  loading.value = true
  try { const res = await adminPortfolioApi.getAll(); items.value = res.data }
  finally { loading.value = false }
}

async function handleSubmit() {
  if (!form.value.title||!form.value.category||!form.value.media_url) { formError.value='Title, category and media URL are required'; return }
  submitting.value = true; formError.value = ''
  try {
    if (editingItem.value) await adminPortfolioApi.update(editingItem.value.id, form.value)
    else await adminPortfolioApi.create(form.value)
    showForm.value = false; await loadItems()
  } catch(e) { formError.value = e.message }
  finally { submitting.value = false }
}

async function handleDelete() {
  if (!deleteTarget.value) return
  await adminPortfolioApi.delete(deleteTarget.value.id); await loadItems()
}

// File Handling
function handleMediaSelect(e) { processFile(e.target.files[0], 'media') }
function handleMediaDrop(e) { isDraggingMedia.value = false; processFile(e.dataTransfer.files[0], 'media') }
function handleThumbSelect(e) { processFile(e.target.files[0], 'thumb') }
function handleThumbDrop(e) { isDraggingThumb.value = false; processFile(e.dataTransfer.files[0], 'thumb') }

async function processFile(file, target) {
  if (!file) return
  uploading.value = true
  formError.value = ''
  try {
    const result = await uploadApi.uploadFile(file, 'portfolio')
    if (target === 'media') {
      form.value.media_url = result.file_url
      form.value.media_type = file.type.startsWith('video/') ? 'video' : 'image'
    } else {
      form.value.thumbnail = result.file_url
    }
  } catch(e) {
    formError.value = `Upload failed: ${e.message}`
  } finally {
    uploading.value = false
  }
}

onMounted(loadItems)
</script>

<style scoped>
.adm-portfolio-cell { display:flex; align-items:center; gap:11px; }
.adm-thumb          { width:42px; height:42px; object-fit:cover; border-radius:8px; border:1px solid var(--adm-border); flex-shrink:0; }
.adm-type-badge     { padding:3px 10px; border-radius:6px; font-size:0.72rem; font-weight:600; }
.adm-type-image     { background:rgba(6,182,212,0.1);  border:1px solid rgba(6,182,212,0.2);  color:#22d3ee; }
.adm-type-video     { background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.2); color:#a78bfa; }

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

.drop-zone-sm { padding: 15px 10px; }

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
.drop-zone-content span { font-size: 0.75rem; }

.hidden-input { display: none; }

.media-preview {
  width: 100%;
  height: 150px;
  position: relative;
}

.media-preview img, .media-preview video {
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
