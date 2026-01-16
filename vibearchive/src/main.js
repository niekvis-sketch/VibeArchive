import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import './style.css'
import App from './App.vue'
import router from './router'

let app

onAuthStateChanged(auth, () => {
    if (!app) {
        app = createApp(App)
        app.use(createPinia())
        app.use(router)
        app.use(MotionPlugin)
        app.mount('#app')
    }
})
