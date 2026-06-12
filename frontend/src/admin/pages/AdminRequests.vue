<template>
  <div class="admin-page">
    <div class="adm-page-header">
      <div>
        <h1 class="adm-page-title">Service <span class="gradient-text">Requests</span></h1>
        <p class="adm-page-sub">{{ items.length }} total · <span class="adm-pending-text">{{ pendingCount }} pending</span></p>
      </div>
    </div>

    <div class="adm-filter-bar">
      <div class="adm-search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
        <input v-model="search" type="text" placeholder="Search requests…" class="adm-search-input"/>
      </div>
      <div class="adm-filter-tabs">
        <button v-for="f in filters" :key="f.key" class="adm-filter-tab" :class="{ active: activeFilter === f.key }" @click="activeFilter = f.key">
          {{ f.label }} <span class="adm-tab-count">{{ f.count }}</span>
        </button>
      </div>
    </div>

    <div class="adm-table-card">
      <div v-if="loading" class="adm-table-loading"><div class="adm-spinner-sm"></div><span>Loading…</span></div>
      <div v-else-if="filtered.length === 0" class="adm-empty-state">
        <div class="adm-empty-icon">📋</div>
        <h3>No requests found</h3>
        <p>{{ search ? 'Try different terms' : 'No service requests yet' }}</p>
      </div>
      <div v-else class="adm-responsive-table">
        <table class="adm-data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th class="adm-hide-sm">Service</th>
              <th class="adm-hide-md">Event Date</th>
              <th class="adm-hide-md">Budget</th>
              <th>Status</th>
              <th class="adm-hide-md">Date</th>
              <th class="adm-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id" class="adm-table-row">
              <td>
                <div class="adm-cell-primary">
                  <span class="adm-truncate" :title="item.name">{{ item.name }}</span>
                </div>
                <div class="adm-cell-secondary">
                  <span class="adm-truncate adm-truncate-lg" :title="item.email">{{ item.email }}</span>
                </div>
              </td>
              <td class="adm-hide-sm">
                <span class="adm-service-tag adm-truncate adm-truncate-sm" :title="item.service_type">{{ item.service_type }}</span>
              </td>
              <td class="adm-hide-md"><span class="adm-date-text">{{ item.event_date ? formatDate(item.event_date) : '—' }}</span></td>
              <td class="adm-hide-md"><span class="adm-budget-text">{{ item.budget || '—' }}</span></td>
              <td><StatusBadge :status="item.status" /></td>
              <td class="adm-hide-md"><span class="adm-date-text">{{ formatDate(item.created_at) }}</span></td>
              <td class="adm-actions-col">
                <div class="adm-action-btns">
                  <button class="adm-action-btn adm-btn-view"     @click="openView(item)"                   title="View">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </button>
                  <button v-if="item.status==='pending'||item.status==='reviewed'" class="adm-action-btn adm-btn-approve" @click="updateStatus(item,'approved')" title="Approve">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </button>
                  <button v-if="item.status!=='dismissed'&&item.status!=='completed'" class="adm-action-btn adm-btn-dismiss" @click="updateStatus(item,'dismissed')" title="Dismiss">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
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

    <!-- View Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showView && viewItem" class="adm-modal-overlay" @click.self="showView = false">
          <div class="adm-modal-panel adm-modal-wide">
            <div class="adm-modal-header">
              <h3 class="adm-modal-title">Request from {{ viewItem.name }}</h3>
              <button class="adm-modal-close" @click="showView = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="adm-modal-body">
              <div class="adm-req-grid">
                <div v-for="field in viewFields" :key="field.label" class="adm-req-field">
                  <span class="adm-req-field-label">{{ field.label }}</span>
                  <span class="adm-req-field-value">{{ field.value || '—' }}</span>
                </div>
              </div>
              <div v-if="viewItem.message" class="adm-msg-box" style="margin-bottom:18px">
                <div class="adm-req-field-label" style="margin-bottom:8px">Message</div>
                <p class="adm-msg-text">{{ viewItem.message }}</p>
              </div>
              <div class="adm-status-row">
                <span class="adm-req-field-label">Update Status:</span>
                <div class="adm-status-options">
                  <button v-for="s in statusOptions" :key="s.value"
                    class="adm-status-opt" :class="[`adm-opt-${s.color}`, { 'adm-opt-active': viewItem.status === s.value }]"
                    @click="updateStatus(viewItem, s.value); showView=false">
                    {{ s.label }}
                  </button>
                </div>
              </div>
              <div class="adm-modal-footer-actions" style="margin-top:20px">
                <a :href="`mailto:${viewItem.email}`" class="btn btn-primary adm-reply-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
                  Reply via Email
                </a>
                <button class="adm-btn-cancel" @click="showView=false">Close</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ConfirmModal v-model="showConfirm" title="Delete Request"
      :message="`Delete request from ${deleteTarget?.name}? This cannot be undone.`"
      confirm-text="Delete" @confirm="handleDelete"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import StatusBadge  from '../components/StatusBadge.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { adminRequestsApi } from '../services/adminApi.js'

const items = ref([]); const loading = ref(true); const search = ref('')
const activeFilter = ref('all'); const showView = ref(false); const showConfirm = ref(false)
const viewItem = ref(null); const deleteTarget = ref(null)
const refreshCounts = inject('refreshCounts', () => {})

const pendingCount = computed(() => items.value.filter(i=>i.status==='pending').length)
const statusCounts = computed(() => { const c={}; items.value.forEach(i=>{c[i.status]=(c[i.status]||0)+1}); return c })
const filters = computed(() => [
  { key:'all',       label:'All',       count: items.value.length },
  { key:'pending',   label:'Pending',   count: statusCounts.value.pending||0 },
  { key:'reviewed',  label:'Reviewed',  count: statusCounts.value.reviewed||0 },
  { key:'approved',  label:'Approved',  count: statusCounts.value.approved||0 },
  { key:'dismissed', label:'Dismissed', count: statusCounts.value.dismissed||0 },
])
const filtered = computed(() => {
  let list = items.value
  if (activeFilter.value !== 'all') list = list.filter(i=>i.status===activeFilter.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(i=>i.name.toLowerCase().includes(q)||i.email.toLowerCase().includes(q)||(i.service_type||'').toLowerCase().includes(q))
  }
  return list
})
const viewFields = computed(() => !viewItem.value ? [] : [
  { label:'Name',         value: viewItem.value.name },
  { label:'Email',        value: viewItem.value.email },
  { label:'Phone',        value: viewItem.value.phone },
  { label:'Service Type', value: viewItem.value.service_type },
  { label:'Event Date',   value: viewItem.value.event_date ? formatDate(viewItem.value.event_date) : null },
  { label:'Budget',       value: viewItem.value.budget },
  { label:'Status',       value: viewItem.value.status },
  { label:'Received',     value: formatDate(viewItem.value.created_at) },
])
const statusOptions = [
  { value:'reviewed',  label:'Mark Reviewed', color:'indigo' },
  { value:'approved',  label:'Approve',       color:'green'  },
  { value:'confirmed', label:'Confirm',       color:'teal'   },
  { value:'completed', label:'Complete',      color:'purple' },
  { value:'dismissed', label:'Dismiss',       color:'gray'   },
]

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : '—' }
function openView(item)      { viewItem.value = item; showView.value = true }
function confirmDelete(item) { deleteTarget.value = item; showConfirm.value = true }

async function loadItems() {
  loading.value = true
  try { const res = await adminRequestsApi.getAll(); items.value = res.data }
  finally { loading.value = false }
}
async function updateStatus(item, status) {
  try { await adminRequestsApi.updateStatus(item.id, status); item.status = status; refreshCounts() } catch(e) {}
}
async function handleDelete() {
  if (!deleteTarget.value) return
  await adminRequestsApi.delete(deleteTarget.value.id); await loadItems(); refreshCounts()
}
onMounted(loadItems)
</script>

<style scoped>
.adm-pending-text { color: #fbbf24; font-weight: 600; }
.adm-service-tag  { padding:3px 10px; border-radius:6px; font-size:0.72rem; font-weight:600; background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.2); color:#a78bfa; display:inline-block; }
.adm-budget-text  { font-size:0.8rem; color:#34d399; }
.adm-req-grid     { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:18px; }
.adm-req-field    { background:var(--adm-surface); border:1px solid var(--adm-border2); border-radius:10px; padding:12px 14px; }
.adm-req-field-label { display:block; font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--adm-text3); margin-bottom:3px; }
.adm-req-field-value { font-size:0.875rem; color:var(--adm-text); font-weight:500; }
.adm-msg-box { background:var(--adm-surface); border:1px solid var(--adm-border2); border-radius:12px; padding:14px; }
.adm-msg-text { color:var(--adm-text2); font-size:0.9rem; line-height:1.75; white-space:pre-wrap; margin:0; }
.adm-status-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.adm-status-options { display:flex; gap:7px; flex-wrap:wrap; }
.adm-status-opt { padding:5px 13px; border-radius:9999px; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s; background:var(--adm-surface); border:1px solid var(--adm-border); color:var(--adm-text3); font-family:inherit; }
.adm-opt-green:hover,.adm-opt-green.adm-opt-active   { background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.3); color:#34d399; }
.adm-opt-indigo:hover,.adm-opt-indigo.adm-opt-active { background:rgba(99,102,241,0.15); border-color:rgba(99,102,241,0.3); color:#a5b4fc; }
.adm-opt-teal:hover,.adm-opt-teal.adm-opt-active     { background:rgba(20,184,166,0.15); border-color:rgba(20,184,166,0.3); color:#2dd4bf; }
.adm-opt-purple:hover,.adm-opt-purple.adm-opt-active { background:rgba(139,92,246,0.15); border-color:rgba(139,92,246,0.3); color:#a78bfa; }
.adm-opt-gray:hover,.adm-opt-gray.adm-opt-active     { background:rgba(148,163,184,0.1); border-color:rgba(148,163,184,0.2); color:var(--adm-text2); }
.adm-reply-btn { text-decoration:none; }
@media(max-width:600px){ .adm-req-grid{ grid-template-columns:1fr; } }
</style>
