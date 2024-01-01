import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./style/normalize.css"
import "./style/global.css"
import CodeEdit from "@/components/CodeEdit.vue"
import CodeBlock from "@/components/CodeBlock.vue"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconDown, IconPlus, IconDelete, IconLeft, IconRight, IconCode, IconImport, IconEdit, IconSend, IconExport } from '@arco-design/web-vue/es/icon'
dayjs.extend(relativeTime)
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
    .use(IconLeft)
    .use(IconRight)
    .mount('#app')
