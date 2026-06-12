/**
 * 4K Production — main.js
 * Application entry point
 */
import { createApp } from 'vue'
import App    from './App.vue'
import router from './router/index.js'

// Global styles
import './styles/main.css'
import './styles/glassmorphism.css'
import './styles/animations.css'
// NOTE: admin-shared.css is NOT imported here — it's scoped inside AdminLayout
// admin-modals.css IS global because modals use <Teleport to="body">
import './admin/admin-modals.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
