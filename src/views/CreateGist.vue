<template>
    <div class="create-header text-center">
        <h3 class="create-header--title px-3">Record now code snippets.</h3>
    </div>
    <div class="create-gist mt-2 px-4" v-if="isEdit">
        <a-input v-model="description" placeholder="添加描述" allow-clear :max-length="200" class="mb-4 " size="large" />
        <code-edit v-model="code" v-model:language="language" v-model:tags="tags" :default-tags="defaultTags"
            :options="options" />

        <div class="flex justify-end my-4">
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
import { trim, isEmpty, eq, hasIn, unset } from "lodash-es"
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

        //默认标签
        const defaultTags = shallowRef([])
        //标签列表
        const options = shallowRef([])

        const description = shallowRef('')
        const code = shallowRef('')
        // 获取曾经选择的语言类型
        const lang = eq(mode, CREATE) ? (localStorage.getItem('language') || 'markdown') : ''
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
                //数据中不能存在_id 
                if (utoolsUser) {
                    param = { ...param, ...utoolsUser }
                    unset(param, '_id')
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
                editTime: Date.now(),
                tags: unref(tags)
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
            defaultTags.value = gist.tags || []
            tags.value = gist.tags || []
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
            defaultTags,
        }
    },
}
</script>
<style lang="less" scoped>
.create-header {
    .create-header--title {
        padding: 20px;
        margin: 0;
        font-size: 32px;
        font-weight: 300;
    }

    margin-top: -1px;
    background-image: linear-gradient(rgba(255, 255, 255, 0) 60%, rgb(255, 255, 255)),
    linear-gradient(70deg, rgb(221, 244, 255) 32%, rgb(218, 251, 225));
}

.create-gist {
    max-width: 1000px;
    margin: auto;
}
</style>
