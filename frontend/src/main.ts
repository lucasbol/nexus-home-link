import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import views
import Dashboard from './views/Dashboard.vue'
import NotFound from './views/NotFound.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]
})

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
