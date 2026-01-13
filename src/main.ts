import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'
import './iconfont/iconfont.js'
import './style/index.less'

// Import directives
import directives from '@/utils/directives'

const app = createApp(App)

// Register Pinia
app.use(pinia)

// Register custom directives
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as any)[key])
})

// Register global components (if any)
import dIcon from '@/components/public/d-icon.vue'
import dTabs from '@/components/public/d-tabs.vue'
app.component('dIcon', dIcon)
app.component('dTabs', dTabs)

app.mount('#app')
