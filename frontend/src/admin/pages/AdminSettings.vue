<template>
  <div class="admin-page">
    <div class="adm-page-header">
      <div>
        <h1 class="adm-page-title">Admin <span class="gradient-text">Settings</span></h1>
        <p class="adm-page-sub">System configuration and account management</p>
      </div>
    </div>

    <div class="adm-settings-grid">
      <!-- Account Card -->
      <div class="adm-settings-card">
        <div class="adm-settings-card-hd">
          <div class="adm-settings-icon adm-icon-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
          </div>
          <div>
            <h3 class="adm-settings-card-title">Admin Account</h3>
            <p class="adm-settings-card-sub">Manage admin credentials</p>
          </div>
        </div>
        <div class="adm-settings-body">
          <div class="adm-info-row"><span class="adm-info-label">Username</span><span class="adm-info-value">administrator</span></div>
          <div class="adm-info-row"><span class="adm-info-label">Role</span><span class="adm-info-value"><span class="adm-badge-purple">Super Admin</span></span></div>
          <div class="adm-info-row"><span class="adm-info-label">Session</span><span class="adm-info-value"><span class="adm-badge-green">Active</span></span></div>
          
        </div>
      </div>

      <!-- Email Card -->
      <div class="adm-settings-card">
        <div class="adm-settings-card-hd">
          <div class="adm-settings-icon adm-icon-aqua">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
          </div>
          <div>
            <h3 class="adm-settings-card-title">Email Notifications</h3>
            <p class="adm-settings-card-sub">Nodemailer SMTP configuration</p>
          </div>
        </div>
        <div class="adm-settings-body">
          <p class="adm-settings-desc">When configured, the system sends confirmation emails to users and notification emails to the admin for every contact form and service request submission.</p>
          <div class="adm-env-block">
            
          </div>
        </div>
      </div>

      <!-- Database Card -->
      <div class="adm-settings-card">
        <div class="adm-settings-card-hd">
          <div class="adm-settings-icon adm-icon-indigo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125S3.75 11.278 3.75 9"/></svg>
          </div>
          <div>
            <h3 class="adm-settings-card-title">Database Tables</h3>
            <p class="adm-settings-card-sub">MySQL schema overview</p>
          </div>
        </div>
        <div class="adm-settings-body">
          <div class="adm-table-info-list">
            <div v-for="t in tables" :key="t.name" class="adm-table-info-row">
              <span class="adm-table-mono">{{ t.name }}</span>
              <span class="adm-table-desc">{{ t.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links Card -->
      <div class="adm-settings-card">
        <div class="adm-settings-card-hd">
          <div class="adm-settings-icon adm-icon-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
          </div>
          <div>
            <h3 class="adm-settings-card-title">Quick Links</h3>
            <p class="adm-settings-card-sub">Navigate to sections</p>
          </div>
        </div>
        <div class="adm-settings-body">
          <div class="adm-quick-links">
            <router-link v-for="link in quickLinks" :key="link.to" :to="link.to" class="adm-quick-link-btn">
              <span>{{ link.label }}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
            </router-link>
            <a href="/" target="_blank" class="adm-quick-link-btn">
              <span>View Public Website</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const tables = [
  { name: 'announcements',    desc: 'News & announcements' },
  { name: 'portfolio',        desc: 'Portfolio items & media' },
  { name: 'service_requests', desc: 'Client service requests' },
  { name: 'contact_messages', desc: 'Contact form submissions' },
]
const quickLinks = [
  { to:'/admin',               label:'Dashboard Overview' },
  { to:'/admin/announcements', label:'Manage Announcements' },
  { to:'/admin/messages',      label:'View Messages' },
  { to:'/admin/requests',      label:'Service Requests' },
  { to:'/admin/portfolio',     label:'Portfolio Manager' },
]
</script>

<style scoped>
.adm-settings-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }

.adm-settings-card {
  border-radius:20px; overflow:hidden;
  background:var(--adm-card); border:1px solid var(--adm-border);
  backdrop-filter:blur(20px);
}
.adm-settings-card-hd {
  display:flex; align-items:center; gap:14px; padding:20px 24px;
  border-bottom:1px solid var(--adm-border2);
}
.adm-settings-icon { width:40px; height:40px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.adm-settings-icon svg { width:20px; height:20px; }
.adm-icon-purple { background:rgba(139,92,246,0.15); border:1px solid rgba(139,92,246,0.22); color:#a78bfa; }
.adm-icon-aqua   { background:rgba(6,182,212,0.15);  border:1px solid rgba(6,182,212,0.22);  color:#22d3ee; }
.adm-icon-indigo { background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.22); color:#a5b4fc; }
.adm-icon-teal   { background:rgba(20,184,166,0.15); border:1px solid rgba(20,184,166,0.22); color:#2dd4bf; }

.adm-settings-card-title { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:var(--adm-text); }
.adm-settings-card-sub   { font-size:0.75rem; color:var(--adm-text3); margin-top:2px; }
.adm-settings-body       { padding:20px 24px; }
.adm-settings-desc       { color:var(--adm-text2); font-size:0.875rem; line-height:1.7; margin-bottom:14px; }

.adm-info-row        { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--adm-border2); }
.adm-info-row:last-of-type { border-bottom:none; }
.adm-info-label      { font-size:0.78rem; color:var(--adm-text3); font-weight:600; letter-spacing:0.04em; text-transform:uppercase; }
.adm-info-value      { font-size:0.875rem; color:var(--adm-text2); }
.adm-badge-purple    { padding:3px 10px; border-radius:9999px; font-size:0.72rem; font-weight:700; background:rgba(139,92,246,0.15); border:1px solid rgba(139,92,246,0.25); color:#a78bfa; }
.adm-badge-green     { padding:3px 10px; border-radius:9999px; font-size:0.72rem; font-weight:700; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.25); color:#34d399; }

.adm-settings-note {
  margin-top:14px; padding:12px 14px; border-radius:10px;
  background:var(--adm-surface); border:1px solid var(--adm-border2);
  font-size:0.8rem; color:var(--adm-text3); line-height:1.6; display:flex; align-items:flex-start; gap:8px;
}
.adm-settings-note code { background:var(--adm-surface); border:1px solid var(--adm-border); padding:1px 5px; border-radius:4px; font-size:0.78rem; color:var(--adm-text2); }

.adm-env-block  { margin-top:14px; }
.adm-env-title  { font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--adm-text3); margin-bottom:8px; }
.adm-env-code   { display:block; background:rgba(0,0,0,0.3); border:1px solid var(--adm-border); border-radius:10px; padding:14px; font-size:0.78rem; color:var(--adm-text2); line-height:1.8; font-family:'Courier New',monospace; white-space:pre; overflow-x:auto; }

.adm-table-info-list { display:flex; flex-direction:column; gap:7px; margin-bottom:14px; }
.adm-table-info-row  { display:flex; align-items:center; gap:12px; padding:9px 14px; background:var(--adm-surface); border:1px solid var(--adm-border2); border-radius:10px; }
.adm-table-mono { font-family:'Courier New',monospace; font-size:0.8rem; color:#a78bfa; font-weight:600; min-width:130px; }
.adm-table-desc { font-size:0.8rem; color:var(--adm-text3); }

.adm-quick-links      { display:flex; flex-direction:column; gap:4px; }
.adm-quick-link-btn   { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:10px; cursor:pointer; transition:all 0.2s; background:var(--adm-surface); border:1px solid var(--adm-border2); color:var(--adm-text2); text-decoration:none; font-size:0.875rem; font-weight:500; }
.adm-quick-link-btn:hover { background:rgba(139,92,246,0.1); border-color:rgba(139,92,246,0.2); color:#a78bfa; }
.adm-quick-link-btn svg { color:var(--adm-text3); flex-shrink:0; }

@media(max-width:900px) { .adm-settings-grid{ grid-template-columns:1fr; } }
</style>
