<template>
    <div class="px-8 py-2 flex justify-between items-start"
        style="background-color: #f6f8fa;border-bottom:1px solid rgb(208, 215, 222);">
        <div class="flex ">
            <icon-code size="32px" />
            <div class="pl-2">
                <a-link class="text-base font-semibold" :hoverable="false">Gist:{{ detail.gistId || '无' }}</a-link>
                <p v-if="detail.editTime" class="m-0 text-xs text-nowrap truncate" style="color:rgb(101, 109, 118);">{{ `编辑于
                    ${dayjs(detail.editTime).fromNow()}` }}</p>
            </div>
        </div>
        <a-space>
            <a-button type="primary" @click="onChange">
                <template #icon>
                    <icon-edit />
                </template>
                编辑
            </a-button>
            <a-popconfirm content="是否确认删除?" type="error" @ok="onDelete">
                <a-button status="danger">
                    <template #icon><icon-delete /></template>
                    删除
                </a-button>
            </a-popconfirm>
            <a-button @click="onExit">
                <template #icon>
                    <icon-export />
                </template>
                返回
            </a-button>
        </a-space>
    </div>
    <div v-if="!isEmpty(detail)" class="m-auto all-gist mt-5 p-4">
        <p class="m-0 text-base text-nowrap truncate mb-2 font-medium">{{ detail.description || '无描述' }}</p>
        <div class="code-hover border-solid border-transparent border rounded-md overflow-hidden cursor-pointer">
            <code-block :tags="detail.tags" :code="detail.code" :language="detail.language" />
        </div>
    </div>
</template>
<script>
import { useRouter, useRoute } from "vue-router"
import { onBeforeMount, ref } from "vue"
import { getGistDetail } from "@/api/local/getGistDetail"
import { deleteGist } from "@/api/local/deleteGist"
import { isEmpty } from "lodash-es"
import dayjs from "dayjs"

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const detail = ref({})

        const onExit = () => {
            if (history.state) {
                router.back()
                return
            }
            router.replace({ name: 'homeView' })
        }

        const onChange = () => {
            router.push({ name: 'create', query: { gistId: route.query.gistId, mode: 'change' } })
        }

        const onDelete = async () => {
            const isDelete = await deleteGist(route.query.gistId)
            if (isDelete) {
                onExit()
            }
        }

        onBeforeMount(async () => {
            const gist = await getGistDetail(route.query.gistId)
            console.log(gist);
            if (isEmpty(gist)) return
            console.log(gist);
            detail.value = gist
        })

        return {
            dayjs,
            onChange,
            onDelete,
            isEmpty,
            detail,
            onExit
        }
    },
}
</script>
<style lang="less" scoped>
.all-gist {
    max-width: 1000px;
}
</style>