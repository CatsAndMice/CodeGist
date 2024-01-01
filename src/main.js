import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./style/normalize.css"
import "./style/global.css"
import CodeEdit from "@/components/CodeEdit.vue"
import CodeBlock from "@/components/CodeBlock.vue"
import { IconDown,IconPlus,IconDelete,IconCode,IconImport,IconEdit,IconSend,IconExport} from '@arco-design/web-vue/es/icon'
createApp(App)
    .use(router)
    .use(CodeEdit)
    .use(CodeBlock)
    .use(IconDown)
    .use(IconPlus)
    .use(IconCode)
    .use(IconImport)
    .use(IconSend)
    .use(IconExport)
    .use(IconDelete)
    .use(IconEdit)
    .mount('#app')
