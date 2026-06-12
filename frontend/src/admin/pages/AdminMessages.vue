<template>
  <div class="admin-page">
    <div class="adm-page-header">
      <div>
        <h1 class="adm-page-title">Contact <span class="gradient-text">Messages</span></h1>
        <p class="adm-page-sub">{{ items.length }} total · <span class="adm-accent-text">{{ unreadCount }} unread</span></p>
      </div>
    </div>

    <div class="adm-filter-bar">
      <div class="adm-search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
        <input v-model="search" type="text" placeholder="Search messages…" class="adm-search-input"/>
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
        <div class="adm-empty-icon">✉️</div>
        <h3>No messages found</h3>
        <p>{{ search ? 'Try different terms' : 'No contact messages yet' }}</p>
      </div>
      <div v-else class="adm-responsive-table">
        <table class="adm-data-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th class="adm-hide-sm">Email</th>
              <th class="adm-hide-md">Phone</th>
              <th>Status</th>
              <th class="adm-hide-md">Date</th>
              <th class="adm-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id" class="adm-table-row" :class="{ 'adm-row-unread': !item.is_read }">
              <td>
                <div class="adm-cell-primary" style="display:flex;align-items:center;gap:6px">
                  <span v-if="!item.is_read" class="adm-unread-dot"></span>
                  <span class="adm-truncate" :title="item.name">{{ item.name }}</span>
                </div>
                <div class="adm-cell-secondary adm-hide-md">
                  <span class="adm-truncate adm-truncate-lg" :title="item.message">{{ item.message }}</span>
                </div>
              </td>
              <td class="adm-hide-sm"><span class="adm-email-text adm-truncate" :title="item.email">{{ item.email }}</span></td>
              <td class="adm-hide-md"><span class="adm-date-text">{{ item.phone || '—' }}</span></td>
              <td><StatusBadge :status="item.is_read ? 'read' : 'unread'" /></td>
              <td class="adm-hide-md"><span class="adm-date-text">{{ formatDate(item.created_at) }}</span></td>
              <td class="adm-actions-col">
                <div class="adm-action-btns">
                  <button class="adm-action-btn adm-btn-view" @click="openView(item)" title="View">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </button>
                  <button v-if="!item.is_read" class="adm-action-btn adm-btn-approve" @click="handleMarkRead(item)" title="Mark read">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
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
          <div class="adm-modal-panel">
            <div class="adm-modal-header">
              <h3 class="adm-modal-title">Message from {{ viewItem.name }}</h3>
              <button class="adm-modal-close" @click="showView = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="adm-modal-body">
              <div class="adm-sender-card">
                <div class="adm-sender-avatar">{{ viewItem.name.charAt(0).toUpperCase() }}</div>
                <div class="adm-sender-info">
                  <div class="adm-sender-name">{{ viewItem.name }}</div>
                  <a :href="`mailto:${viewItem.email}`" class="adm-sender-email">{{ viewItem.email }}</a>
                  <div v-if="viewItem.phone" class="adm-sender-phone">{{ viewItem.phone }}</div>
                </div>
                <div class="adm-sender-meta">
                  <StatusBadge :status="viewItem.is_read ? 'read' : 'unread'" />
                  <div class="adm-date-text" style="margin-top:4px">{{ formatDate(viewItem.created_at) }}</div>
                </div>
              </div>
              <div class="adm-msg-box">
                <p class="adm-msg-text">{{ viewItem.message }}</p>
              </div>
              <div class="adm-modal-footer-actions" style="margin-top:20px">
                <a :href="`mailto:${viewItem.email}`" class="btn btn-primary adm-reply-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
                  Reply via Email
                </a>
                <button v-if="!viewItem.is_read" class="adm-btn-cancel" @click="handleMarkRead(viewItem);showView=false">Mark as Read</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ConfirmModal v-model="showConfirm" title="Delete Message"
      :message="`Delete message from ${deleteTarget?.name}?`"
      confirm-text="Delete" @confirm="handleDelete"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import StatusBadge  from '../components/StatusBadge.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { adminMessagesApi } from '../services/adminApi.js'

const items = ref([]); const loading = ref(true); const search = ref('')
const activeFilter = ref('all'); const showView = ref(false); const showConfirm = ref(false)
const viewItem = ref(null); const deleteTarget = ref(null)
const refreshCounts = inject('refreshCounts', () => {})

const unreadCount = computed(() => items.value.filter(i => !i.is_read).length)
const filters = computed(() => [
  { key:'all',    label:'All',    count: items.value.length },
  { key:'unread', label:'Unread', count: unreadCount.value },
  { key:'read',   label:'Read',   count: items.value.filter(i=>i.is_read).length },
])
const filtered = computed(() => {
  let list = items.value
  if (activeFilter.value === 'unread') list = list.filter(i => !i.is_read)
  else if (activeFilter.value === 'read') list = list.filter(i => i.is_read)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(i => i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.message.toLowerCase().includes(q))
  }
  return list
})

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—' }
function openView(item) { viewItem.value = item; showView.value = true; if (!item.is_read) handleMarkRead(item) }
function confirmDelete(item) { deleteTarget.value = item; showConfirm.value = true }

async function loadItems() {
  loading.value = true
  try { const res = await adminMessagesApi.getAll(); items.value = res.data }
  finally { loading.value = false }
}
async function handleMarkRead(item) {
  try { await adminMessagesApi.markRead(item.id); item.is_read = 1; refreshCounts() } catch(e) {}
}
async function handleDelete() {
  if (!deleteTarget.value) return
  await adminMessagesApi.delete(deleteTarget.value.id); await loadItems(); refreshCounts()
}
onMounted(loadItems)
</script>

<style scoped>
.adm-accent-text  { color: #a78bfa; font-weight: 600; }
.adm-row-unread   { background: rgba(139,92,246,0.04) !important; }
.adm-unread-dot   { display:inline-block; width:7px; height:7px; border-radius:50%; background:#a78bfa; box-shadow:0 0 5px #a78bfa; flex-shrink:0; }

.adm-sender-card  { display:flex; align-items:center; gap:14px; padding:16px; background:var(--adm-surface); border:1px solid var(--adm-border); border-radius:14px; margin-bottom:18px; }
.adm-sender-avatar{ width:44px;height:44px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#8b5cf6,#06b6d4);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;color:#fff; }
.adm-sender-info  { flex:1;min-width:0; }
.adm-sender-name  { font-weight:700;color:var(--adm-text);font-size:0.95rem; }
.adm-sender-email { font-size:0.82rem;color:#a78bfa;text-decoration:none;display:block;margin-top:2px; }
.adm-sender-phone { font-size:0.8rem;color:var(--adm-text3);margin-top:2px; }
.adm-sender-meta  { display:flex;flex-direction:column;align-items:flex-end;gap:4px; }
.adm-msg-box      { padding:16px; background:var(--adm-surface); border:1px solid var(--adm-border2); border-radius:14px; }
.adm-msg-text     { color:var(--adm-text2);font-size:0.9rem;line-height:1.75;white-space:pre-wrap;margin:0; }
.adm-reply-btn    { text-decoration:none; }
</style>
