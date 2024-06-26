import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./style/normalize.css"
import "./style/global.css"
import "@arco-design/web-vue/es/notification/style/index.css"
import "@arco-design/web-vue/es/message/style/index.css"
import CodeEdit from "@/components/CodeEdit.vue"
import CodeBlock from "@/components/CodeBlock.vue"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'

import { IconDown, IconPlus, IconGithub, IconPushpin, IconCopy, IconDriveFile, IconFolderAdd, IconMore, IconTags, IconApps, IconTag, IconDelete, IconLeft, IconRight, IconCode, IconImport, IconEdit, IconSend, IconExport } from '@arco-design/web-vue/es/icon'
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
    .use(IconGithub)
    .use(IconLeft)
    .use(IconRight)
    .use(IconTags)
    .use(IconTag)
    .use(IconApps)
    .use(IconMore)
    .use(IconCopy)
    .use(IconPushpin)
    .use(IconFolderAdd)
    .use(IconDriveFile)
    .mount('#app')

