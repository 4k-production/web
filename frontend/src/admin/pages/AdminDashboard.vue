<template>
  <div class="admin-page">
    <div class="adm-page-header">
      <div>
        <h1 class="adm-page-title">Dashboard <span class="gradient-text">Overview</span></h1>
        <p class="adm-page-sub">{{ currentDate }}</p>
      </div>
      <button class="adm-refresh-btn" @click="loadData" :class="{ 'adm-spinning': loading }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="adm-stats-grid">
      <div v-for="(stat, i) in statCards" :key="stat.key"
        class="adm-stat-card" :class="[stat.color, { 'adm-stat-loaded': !loading }]"
        :style="{ animationDelay: `${i * 0.07}s` }"
        @click="$router.push(stat.route)"
      >
        <div class="adm-stat-icon">
          <svg v-if="stat.iconId==='list'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
          <svg v-else-if="stat.iconId==='mail'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
          </svg>
          <svg v-else-if="stat.iconId==='announce'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535"/>
          </svg>
          <svg v-else-if="stat.iconId==='camera'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
        </div>
        <div class="adm-stat-body">
          <div class="adm-stat-num">
            <span v-if="loading" class="adm-skel-num"></span>
            <span v-else>{{ stats[stat.key] ?? 0 }}</span>
          </div>
          <div class="adm-stat-lbl">{{ stat.label }}</div>
        </div>
        <div v-if="stat.badgeKey && !loading && (stats[stat.badgeKey] ?? 0) > 0" class="adm-stat-pill">
          {{ stats[stat.badgeKey] }} {{ stat.badgeLabel }}
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="adm-dash-grid">
      <!-- Recent Activity -->
      <div class="adm-dash-card">
        <div class="adm-dash-hd">
          <h3 class="adm-dash-title">Recent Activity</h3>
          <router-link to="/admin/requests" class="adm-view-all">View all →</router-link>
        </div>

        <div v-if="loading" class="adm-activity-list">
          <div v-for="i in 5" :key="i" class="adm-activity-item">
            <div class="adm-skel-avatar"></div>
            <div class="adm-skel-lines">
              <div class="adm-skel-line" style="width:40%;height:12px;margin-bottom:6px"></div>
              <div class="adm-skel-line" style="width:65%;height:10px"></div>
            </div>
          </div>
        </div>

        <div v-else-if="activity.length === 0" class="adm-empty-sm">No recent activity yet</div>

        <div v-else class="adm-activity-list">
          <div v-for="item in activity" :key="`${item.type}-${item.id}`"
            class="adm-activity-item"
            @click="$router.push(item.type==='request'?'/admin/requests':item.type==='event'?'/admin/events':'/admin/messages')">
            <!-- Event thumbnail avatar -->
            <div v-if="item.type==='event' && item.thumbnail" class="adm-act-thumb">
              <img :src="getThumbUrl(item.thumbnail)" :alt="item.name" />
            </div>
            <div v-else class="adm-act-icon" :class="item.type==='request'?'adm-icon-req':item.type==='event'?'adm-icon-evt':'adm-icon-msg'">
              <svg v-if="item.type==='request'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
              </svg>
              <svg v-else-if="item.type==='event'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
            </div>
            <div class="adm-act-body">
              <div class="adm-act-name">{{ item.name }}</div>
              <div class="adm-act-detail">
                <span class="adm-truncate adm-truncate-lg" :title="item.detail">{{ item.detail }}</span>
              </div>
            </div>
            <div class="adm-act-meta">
              <StatusBadge :status="item.status" />
              <div class="adm-act-time">{{ timeAgo(item.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions + Status -->
      <div class="adm-dash-card">
        <div class="adm-dash-hd"><h3 class="adm-dash-title">Quick Actions</h3></div>
        <div class="adm-quick-actions">
          <router-link v-for="action in quickActions" :key="action.label" :to="action.route" class="adm-qa-btn">
            <div class="adm-qa-icon" :style="{ background: action.bg, borderColor: action.border }">
              <svg :viewBox="action.vb" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" :d="action.path"/>
              </svg>
            </div>
            <div class="adm-qa-body">
              <span class="adm-qa-label">{{ action.label }}</span>
              <span class="adm-qa-desc">{{ action.desc }}</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="adm-qa-arrow">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>
          </router-link>
        </div>

        <div class="adm-status-summary" v-if="!loading">
          <div class="adm-ss-title">System Status</div>
          <div class="adm-ss-row"><span class="adm-ss-dot adm-dot-green"></span><span class="adm-ss-label">API Server</span><span class="adm-ss-val">Online</span></div>
          <div class="adm-ss-row">
            <span class="adm-ss-dot" :class="(stats.unread_messages||0)>0?'adm-dot-amber':'adm-dot-green'"></span>
            <span class="adm-ss-label">Unread Messages</span><span class="adm-ss-val">{{ stats.unread_messages ?? 0 }}</span>
          </div>
          <div class="adm-ss-row">
            <span class="adm-ss-dot" :class="(stats.pending_requests||0)>0?'adm-dot-amber':'adm-dot-green'"></span>
            <span class="adm-ss-label">Pending Requests</span><span class="adm-ss-val">{{ stats.pending_requests ?? 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatusBadge  from '../components/StatusBadge.vue'
import { dashboardApi } from '../services/adminApi.js'

const loading  = ref(true)
const stats    = ref({})
const activity = ref([])

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
)

const statCards = [
  { key:'total_requests',      badgeKey:'pending_requests', badgeLabel:'pending', label:'Service Requests', color:'adm-card-purple', route:'/admin/requests',      iconId:'list'     },
  { key:'total_messages',      badgeKey:'unread_messages',  badgeLabel:'unread',  label:'Contact Messages', color:'adm-card-aqua',   route:'/admin/messages',      iconId:'mail'     },
  { key:'total_announcements', badgeKey:null,               badgeLabel:'',        label:'Announcements',    color:'adm-card-indigo', route:'/admin/announcements', iconId:'announce' },
  { key:'total_portfolio',     badgeKey:null,               badgeLabel:'',        label:'Portfolio Items',  color:'adm-card-teal',   route:'/admin/portfolio',     iconId:'photo'    },
  { key:'total_events',        badgeKey:null,               badgeLabel:'',        label:'Events Room',      color:'adm-card-rose',   route:'/admin/events',        iconId:'camera'   },
]

const quickActions = [
  { label:'New Announcement', desc:'Create and publish',   route:'/admin/announcements', bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.2)', vb:'0 0 24 24', path:'M12 4.5v15m7.5-7.5h-15' },
  { label:'View Messages',    desc:'Check your inbox',     route:'/admin/messages',      bg:'rgba(6,182,212,0.12)',  border:'rgba(6,182,212,0.2)',  vb:'0 0 24 24', path:'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
  { label:'Manage Requests',  desc:'Approve or dismiss',   route:'/admin/requests',      bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.2)', vb:'0 0 24 24', path:'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { label:'Events Room',      desc:'Manage event gallery', route:'/admin/events',        bg:'rgba(244,63,94,0.12)',  border:'rgba(244,63,94,0.2)',  vb:'0 0 24 24', path:'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' },
  { label:'Portfolio',        desc:'Manage showcase items', route:'/admin/portfolio',     bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.2)', vb:'0 0 24 24', path:'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
]

function getThumbUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = import.meta.env.VITE_API_URL || ''
  return `${base}${url}`
}

function timeAgo(dt) {
  if (!dt) return ''
  const m = Math.floor((Date.now() - new Date(dt).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h/24)}d ago`
}

async function loadData() {
  loading.value = true
  try {
    const res      = await dashboardApi.getStats()
    stats.value    = res.data.stats
    activity.value = res.data.recentActivity
  } catch(e) { console.error(e) }
  finally { loading.value = false }
}
onMounted(loadData)
</script>

<style scoped>
.adm-refresh-btn {
  display:flex; align-items:center; gap:8px; padding:8px 16px; border-radius:12px;
  cursor:pointer; background:var(--adm-surface); border:1px solid var(--adm-border);
  color:var(--adm-text3); font-size:0.825rem; font-weight:600; font-family:inherit; transition:all 0.2s;
}
.adm-refresh-btn:hover { background:var(--adm-hover); color:var(--adm-text2); }
.adm-spinning svg { animation:adm-spin 0.8s linear infinite; }
@keyframes adm-spin { to { transform:rotate(360deg); } }
@keyframes adm-stat-in { to { opacity:1; transform:none; } }
@keyframes adm-shimmer { 0%,100%{opacity:.5;} 50%{opacity:1;} }

/* Stats */
.adm-stats-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-bottom:24px; }
.adm-stat-card {
  padding:20px; border-radius:18px; cursor:pointer;
  background:var(--adm-surface); border:1px solid var(--adm-border); backdrop-filter:blur(20px);
  display:flex; align-items:center; gap:14px; position:relative; overflow:hidden;
  opacity:0; transform:translateY(10px); transition:border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}
.adm-stat-card.adm-stat-loaded { animation:adm-stat-in 0.4s ease forwards; }
.adm-stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.adm-stat-card:hover { transform:translateY(-3px) !important; }

.adm-card-purple::before { background:linear-gradient(90deg,#8b5cf6,#6d28d9); }
.adm-card-purple:hover   { border-color:rgba(139,92,246,0.3); box-shadow:0 8px 32px rgba(139,92,246,0.16); }
.adm-card-aqua::before   { background:linear-gradient(90deg,#06b6d4,#0891b2); }
.adm-card-aqua:hover     { border-color:rgba(6,182,212,0.3); box-shadow:0 8px 32px rgba(6,182,212,0.16); }
.adm-card-indigo::before { background:linear-gradient(90deg,#6366f1,#4f46e5); }
.adm-card-indigo:hover   { border-color:rgba(99,102,241,0.3); box-shadow:0 8px 32px rgba(99,102,241,0.16); }
.adm-card-teal::before   { background:linear-gradient(90deg,#14b8a6,#0d9488); }
.adm-card-teal:hover     { border-color:rgba(20,184,166,0.3); box-shadow:0 8px 32px rgba(20,184,166,0.16); }
.adm-card-rose::before   { background:linear-gradient(90deg,#f43f5e,#e11d48); }
.adm-card-rose:hover     { border-color:rgba(244,63,94,0.3); box-shadow:0 8px 32px rgba(244,63,94,0.16); }

.adm-stat-icon {
  width:44px; height:44px; border-radius:12px; flex-shrink:0;
  background:var(--adm-surface); border:1px solid var(--adm-border);
  display:flex; align-items:center; justify-content:center; color:var(--adm-text3);
}
.adm-stat-icon svg { width:20px; height:20px; }
.adm-stat-body { flex:1; min-width:0; }
.adm-stat-num  {
  font-family:'Syne',sans-serif; font-size:1.75rem; font-weight:800;
  background:var(--grad-text); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  line-height:1;
}
.adm-skel-num { display:inline-block; width:48px; height:28px; border-radius:6px; background:var(--adm-surface); animation:adm-shimmer 1.4s infinite; }
.adm-stat-lbl { color:var(--adm-text3); font-size:0.78rem; font-weight:500; margin-top:5px; }
.adm-stat-pill { padding:3px 8px; border-radius:9999px; font-size:0.68rem; font-weight:700; background:rgba(251,191,36,0.15); color:#fbbf24; border:1px solid rgba(251,191,36,0.25); white-space:nowrap; flex-shrink:0; }

/* Dashboard grid */
.adm-dash-grid { display:grid; grid-template-columns:1fr 340px; gap:20px; }
.adm-dash-card {
  padding:24px; border-radius:20px;
  background:var(--adm-card); border:1px solid var(--adm-border); backdrop-filter:blur(20px);
}
.adm-dash-hd   { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.adm-dash-title { font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; color:var(--adm-text); }
.adm-view-all  { color:#a78bfa; font-size:0.8rem; text-decoration:none; transition:color 0.2s; }
.adm-view-all:hover { color:#8b5cf6; }

.adm-activity-list { display:flex; flex-direction:column; }
.adm-activity-item { display:flex; align-items:center; gap:12px; padding:9px 8px; border-radius:11px; cursor:pointer; transition:background 0.15s; }
.adm-activity-item:hover { background:var(--adm-hover); }

.adm-act-icon { width:33px; height:33px; border-radius:9px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.adm-act-icon svg { width:15px; height:15px; }
.adm-icon-req { background:rgba(251,191,36,0.12); border:1px solid rgba(251,191,36,0.2); color:#fbbf24; }
.adm-icon-msg { background:rgba(139,92,246,0.12); border:1px solid rgba(139,92,246,0.2); color:#a78bfa; }
.adm-icon-evt { background:rgba(244,63,94,0.12);  border:1px solid rgba(244,63,94,0.2);  color:#fb7185; }

/* Event thumbnail in activity feed */
.adm-act-thumb {
  width:33px; height:33px; border-radius:9px; flex-shrink:0; overflow:hidden;
  border:1px solid var(--adm-border);
}
.adm-act-thumb img { width:100%; height:100%; object-fit:cover; display:block; }

.adm-act-body  { flex:1; min-width:0; }
.adm-act-name  { font-size:0.84rem; font-weight:600; color:var(--adm-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.adm-act-detail { font-size:0.74rem; color:var(--adm-text3); margin-top:2px; display:flex; }
.adm-act-meta  { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
.adm-act-time  { font-size:0.7rem; color:var(--adm-text4); }

.adm-skel-avatar { width:33px; height:33px; border-radius:9px; background:var(--adm-surface); animation:adm-shimmer 1.4s infinite; flex-shrink:0; }
.adm-skel-lines  { flex:1; }
.adm-skel-line   { border-radius:5px; background:var(--adm-surface); animation:adm-shimmer 1.4s infinite; }
.adm-empty-sm    { text-align:center; padding:32px; color:var(--adm-text3); font-size:0.875rem; }

/* Quick Actions */
.adm-quick-actions { display:flex; flex-direction:column; gap:4px; margin-bottom:20px; }
.adm-qa-btn {
  display:flex; align-items:center; gap:11px; padding:10px 11px; border-radius:12px;
  background:var(--adm-surface); border:1px solid var(--adm-border2);
  cursor:pointer; transition:all 0.2s; text-decoration:none; font-family:inherit;
}
.adm-qa-btn:hover { background:var(--adm-hover); border-color:rgba(139,92,246,0.2); transform:translateX(2px); }
.adm-qa-icon { width:32px; height:32px; border-radius:9px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1px solid; }
.adm-qa-icon svg { width:15px; height:15px; color:var(--adm-text3); }
.adm-qa-body  { flex:1; }
.adm-qa-label { display:block; font-size:0.84rem; font-weight:600; color:var(--adm-text); }
.adm-qa-desc  { font-size:0.73rem; color:var(--adm-text3); }
.adm-qa-arrow { width:13px; height:13px; color:var(--adm-text4); flex-shrink:0; }

/* Status summary */
.adm-status-summary { border-top:1px solid var(--adm-border2); padding-top:16px; display:flex; flex-direction:column; gap:8px; }
.adm-ss-title { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--adm-text4); margin-bottom:2px; }
.adm-ss-row   { display:flex; align-items:center; gap:8px; }
.adm-ss-dot   { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.adm-dot-green { background:#34d399; box-shadow:0 0 5px #34d399; }
.adm-dot-amber { background:#fbbf24; box-shadow:0 0 5px #fbbf24; }
.adm-ss-label { font-size:0.82rem; color:var(--adm-text3); flex:1; }
.adm-ss-val   { font-size:0.82rem; font-weight:600; color:var(--adm-text2); }

@media(max-width:1400px) { .adm-stats-grid{ grid-template-columns:repeat(3,1fr); } }
@media(max-width:1200px) { .adm-stats-grid{ grid-template-columns:repeat(2,1fr); } }
@media(max-width:900px)  { .adm-dash-grid { grid-template-columns:1fr; } }
@media(max-width:640px)  { .adm-stats-grid{ grid-template-columns:1fr 1fr; } }
@media(max-width:400px)  { .adm-stats-grid{ grid-template-columns:1fr; } }
</style>
