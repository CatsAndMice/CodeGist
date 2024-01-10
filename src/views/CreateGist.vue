<template>
    <div class="create-gist mt-4 p-4" v-if="isEdit">
        <a-input v-model="description" placeholder="添加描述" allow-clear :max-length="200" class="mb-4 mt-6" size="large" />

        <code-edit v-model="code" v-model:language="language" v-model:tags="tags" :options="options" />

        <div class="flex justify-end mt-4">
            <a-space size="medium">
                <a-button @click="onExit">
                    <template #icon>
                        <icon-export />
                    </template>
                    返回
                </a-button>
                <a-button type="primary" @click="onClickSubmit" :loading="loading" :disabled="isDisabled">
                    <template #icon>
                        <icon-send />
                    </template>
                    {{ eq(mode, CREATE) ? '创建' : '修改' }}
                </a-button></a-space>
        </div>
    </div>
</template>
<script>
import { onBeforeMount, onMounted, ref, shallowRef, unref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { trim, isEmpty, eq, hasIn } from "lodash-es"
import { useRouter, useRoute } from "vue-router"
import { Notification } from '@arco-design/web-vue'
import { create } from "@/api/local/create"
import { getTags } from "@/api/local/getTags"
import { changeGist } from "@/api/local/changeGist"
import { getGistDetail } from "@/api/local/getGistDetail"
import pageScroll from "@/utils/pageScroll"
import { db } from "medash"
import { to } from "await-to-js"

const CREATE = 'create'
export default {
    setup(props) {
        const router = useRouter()
        const route = useRoute()
        const mode = route.query.mode || CREATE
        const tags = shallowRef([])
        const options = shallowRef([])

        const description = shallowRef('')
        const code = shallowRef('')
        // 获取曾经选择的语言类型
        const lang = eq(mode, CREATE) ? (localStorage.getItem('language') || '') : ''
        const language = shallowRef(lang)
        const loading = ref(false)
        const isDisabled = ref(false)
        const isEdit = ref(false)
        const onExit = () => {
            if (history.state) {
                router.back()
                return
            }
            router.replace({ name: 'homeView' })
        }

        const onRecord = (param) => {
            if (hasIn(window, 'utools')) {
                const utoolsUser = utools.getUser()
                if (utoolsUser) {
                    param = { ...param, ...utoolsUser }
                }
            } else {
                //使用gitee登陆
                const user = db.getSionDb('user')
                if (user) {
                    param = { ...param, avatar: user.avatar_url, nickname: user.name }
                }
            }

            fetch('https://zjje1rnw3q.us.aircode.run/src/data', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(param),
            })
        }

        const onCreate = async () => {

            const codeParams = {
                description: unref(description),
                gistId: uuidv4(),
                code: unref(code),
                language: unref(language),
                editTime: Date.now(),
                tags: unref(tags)
            }
            if (isEmpty(trim(codeParams.code))) {
                Notification.error({ title: '保存 Gist 失败', content: '内容为空', closable: true, duration: 1000 })
                return
            }
            loading.value = true
            const isSuccess = await create(codeParams)
            loading.value = false
            onRecord(codeParams)
            if (isSuccess) {
                isDisabled.value = true
                Notification.success({
                    title: '成功',
                    content: '成功创建一个Gist',
                    closable: true,
                    duration: 1000,
                    onClose: function () {
                        pageScroll.setTop()
                        router.push({ name: 'gistDetail', query: { gistId: codeParams.gistId } })
                    }
                })
            }
        }

        const onChange = async () => {
            const codeParams = {
                description: unref(description),
                gistId: route.query.gistId,
                code: unref(code),
                language: unref(language),
                editTime: Date.now()
            }
            if (isEmpty(trim(codeParams.code))) {
                Notification.error({ title: '修改 Gist 失败', content: '内容为空', closable: true, duration: 1000 })
                return
            }
            loading.value = true
            const isSuccess = await changeGist(codeParams.gistId, codeParams)
            loading.value = false
            if (isSuccess) {
                isDisabled.value = true
                Notification.success({
                    title: '成功',
                    content: '成功修改Gist',
                    closable: true,
                    duration: 1000,
                    onClose: onExit
                })
            }
        }

        const onClickSubmit = () => {
            const unrefMode = unref(mode)
            if (eq(unrefMode, CREATE)) {
                onCreate()
                return
            }
            onChange()
        }

        const getOptions = async () => {
            const [err, tags] = await to(getTags())
            if (err) return []
            return tags.map(t => {
                return {
                    label: t,
                    value: t
                }
            })
        }

        onBeforeMount(async () => {
            //创建模式
            if (eq(mode, CREATE)) {
                isEdit.value = true
                return
            }
            //修改模式
            const gist = await getGistDetail(route.query.gistId)
            if (isEmpty(gist)) return
            language.value = gist.language
            code.value = gist.code
            description.value = gist.description
            isEdit.value = true
        })

        onMounted(async () => {
            // 获取标签数据
            options.value = await getOptions()
        })

        return {
            options,
            tags,
            CREATE,
            isEdit,
            onClickSubmit,
            isDisabled,
            description,
            code,
            mode,
            eq,
            onExit,
            language,
            onCreate,
            loading,
        }
    },
}
</script>
<style lang="less" scoped>
.create-gist {
    max-width: 1000px;
    margin: auto;
}
</style>
