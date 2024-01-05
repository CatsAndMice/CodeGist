<template>
  <div class="m-auto all-gist mt-9 px-4">
    <div class="flex justify-between pb-2">
      <a-button type="text" class="mr-4" style="--primary-6:0,0,0;">
        <div class="flex items-center">
          <span class="mr-1">全部</span> <a-badge :count="gistParams.total"
            :dotStyle="{ background: '#E5E6EB', color: '#86909C', boxShadow: 'none' }" />
        </div>
      </a-button>
      <a-input-search v-model="gistParams.name" @clear="onInput" :style="{ 'max-width': '300px' }" @input="onInput"
        :max-length="20" placeholder="请输入 Gist 描述" allow-clear />
    </div>
    <a-divider margin="0" />

    <template v-if="!gistParams.loading">
      <div v-for="l in gistList" :key="l.gistId" class="pb-4 select-none" @click="onClickGistListItem(l.gistId)">
        <div class="flex py-2">
          <icon-code size="32px" style="flex-shrink: 0;" />
          <div class="pl-2 grow text-nowrap truncate">
            <a-link class="text-base font-semibold" :hoverable="false">{{ 'Gist:' + l.gistId }}</a-link>
            <p class="m-0 text-xs truncate" style="color:rgb(101, 109, 118);">{{ '编辑于 ' +
              dayjs(l.editTime).fromNow() }}</p>
            <p class="m-0 text-xs truncate" style="color:rgb(101, 109, 118);width: 100%;">{{ l.description }}</p>
          </div>
        </div>
        <div class="code-hover border-solid border-transparent border rounded-md overflow-hidden cursor-pointer">
          <code-block :custom-style="{ maxHeight: '200px', overflowY: 'hidden' }" :code="l.code" :language="l.language" />
        </div>
      </div>
    </template>

    <a-skeleton v-else :animation="true">
      <a-space direction="vertical" :style="{ width: '100%' }" size="large">
        <a-skeleton-line :rows="5" />
      </a-space>
    </a-skeleton>


    <div v-show="!gistParams.total && !gistParams.loading" class="mt-8">
      <a-empty description=" " class="p-0" />
      <p class="text-center text-sm m-0" style="color:rgb(120,120,122);"><span>无数据,</span>
        <a-button type="text" class="p-0 inline" @click="onClickCreate">立即创建</a-button>
      </p>
    </div>
    <!-- v-show="gistParams.total > gistParams.size" -->
    <div class="flex justify-center pb-4" style="margin-top: 4px;" v-show="gistParams.total > gistParams.size">
      <a-button-group>
        <a-button @click="onPrevPage" :disabled="gistParams.page === 1">
          <icon-left />
          上一页
        </a-button>
        <a-button @click="onNextPage" :disabled="(gistParams.size * gistParams.page) > gistParams.total">
          下一页 <icon-right /></a-button>
      </a-button-group>
    </div>
  </div>
</template>
<script>
import { useRouter } from "vue-router"
import { reactive, ref, onActivated, nextTick } from "vue"
import { getGistList } from "@/api/local/getGistList"
import dayjs from "dayjs"
import { debounce } from "lodash-es"
import pageScroll from "@/utils/pageScroll"
export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const gistParams = reactive({ page: 1, size: 10, loading: false, hasMore: true, total: 0, name: '' })
    const gistList = ref([])

    const onClickGistListItem = (gistId) => {
      pageScroll.setTop(document.documentElement.scrollTop)
      router.push({ name: 'gistDetail', query: { gistId } })
    }

    const onClickCreate = () => {
      router.push({ name: 'create' })
    }

    const getList = async () => {
      gistParams.loading = true
      const list = await getGistList({
        page: gistParams.page,
        size: gistParams.size,
        name: gistParams.name
      })
      console.log(list);
      if (list) {
        gistParams.hasMore = list.hasMore
        gistParams.total = list.total
        gistList.value = list.data
      }
      gistParams.loading = false
      //页面滚动到原处
      pageScroll.scrollTo()
    }

    const onInput = debounce(getList, 1000)

    const onPrevPage = () => {
      pageScroll.setTop()
      gistParams.page--
      getList()
    }

    const onNextPage = () => {
      pageScroll.setTop()
      gistParams.page++
      getList()
    }

    // 首次持载也会被触发
    onActivated(getList)
    return {
      dayjs,
      onInput,
      gistList,
      gistParams,
      onNextPage,
      onPrevPage,
      onClickCreate,
      onClickGistListItem
    }
  }
}
</script>
<style lang="less" scoped>
.all-gist {
  max-width: 1000px;
}

.code-hover {
  &:hover {
    border-color: rgb(22, 93, 255);
  }
}
</style>
