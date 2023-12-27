import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./style/normalize.css"
import "./style/global.css"
import { create, NInput, NButton } from 'naive-ui'

const naive = create({
    components: [NInput, NButton]
})

createApp(App).use(router).use(naive).mount('#app')
