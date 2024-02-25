<template>
  <div class="flex" style="background-color: #fafafa;">
    <a-affix @change="isAffix = $event" class="bg-white">
      <a-menu class="py-2" v-model:collapsed="isCollapsed" v-model:selected-keys="selectedKeys"
        @menu-item-click="onMenuItemClick" :style="{ width: '250px', height: isAffix ? '100vh' : 'calc(100vh - 72px)' }"
        show-collapse-button :auto-open="true" breakpoint="md">
        <a-menu-item :key="ALL">
          <template #icon>
            <icon-apps size="18px" />
          </template>
          全部
        </a-menu-item>

        <a-sub-menu key="1">
          <template #title>置顶标签</template>
          <template #icon><icon-pushpin size="18px" /></template>
          <a-menu-item v-for="tag in topTags" :key="tag" class="label">
            <template #icon>
              <icon-tag size="18px" />
            </template>
            <span class="flex w-full items-center justify-between">
              <span class="grow truncate">{{ tag }}</span>
              <a-dropdown @click.stop popup-container=".arco-menu-inner">
                <a-button :class="{
                  more: true,
                  hidden: isCollapsed
                }" style="width: auto;height: auto;background-color: transparent;">
                  <template #icon><icon-more size="18px" style="margin: 0;" /></template>
                </a-button>
                <template #content>
                  <a-doption @click="onCancelLabelTop(tag)">取消置顶</a-doption>
                </template>
              </a-dropdown>
            </span>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="2">
          <template #title>全部标签</template>
          <template #icon><icon-tags size="18px" /></template>
          <template v-for="tag in tags">
            <a-menu-item v-if="!topTags.includes(tag)" :key="tag" class="label">
              <template #icon>
                <icon-tag size="18px" />
              </template>
              <span class="flex w-full items-center justify-between">
                <span class="grow truncate">{{ tag }}</span>
                <a-dropdown @click.stop popup-container=".arco-menu-inner">
                  <a-button :class="{
                    more: true,
                    hidden: isCollapsed
                  }" style="width: auto;height: auto;background-color: transparent;">
                    <template #icon><icon-more size="18px" style="margin: 0;" /></template>
                  </a-button>
                  <template #content>
                    <a-doption @click="onLabelTop(tag)">标签置顶</a-doption>
                  </template>
                </a-dropdown>
              </span>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </a-menu>
    </a-affix>
    <div class="grow ml-3 px-3 bg-white">
      <a-affix>
        <div class="flex justify-end py-2 bg-white" :style="{
          width: isCollapsed ? 'calc(100vw - 88px)' : 'calc(100vw - 290px)'
        }">
          <a-input-search v-model="gistParams.name" @clear="onInput" :style="{ 'max-width': '300px' }" @input="onInput"
            :max-length="20" placeholder="请输入 Gist 描述" allow-clear />
        </div>
      </a-affix>

      <div :style="{
        width: isCollapsed ? 'calc(100vw - 88px)' : 'calc(100vw - 290px)'
      }">
        <template v-if="!gistParams.loading">
          <div v-for="(l, index) in gistList" :key="l.gistId" class="pb-4 select-none "
            @click="onClickGistListItem(l.gistId)">
            <div class="flex py-2">
              <icon-code size="32px" style="flex-shrink: 0;" />
              <div class="pl-2 grow text-nowrap truncate">
                <a-link class="text-base font-semibold" :hoverable="false">{{ 'Gist:' + l.gistId }}</a-link>
                <p class="m-0 text-xs truncate" style="color:rgb(101, 109, 118);">{{ '编辑于 ' +
                  dayjs(l.editTime).fromNow() }}</p>
                <p class="m-0 text-xs truncate" style="color:rgb(101, 109, 118);width: 100%;">{{ l.description }}</p>
              </div>
            </div>
            <div :id="getDomId(index)"
              class="code-hover relative border-solid border-transparent border rounded-sm cursor-pointer">
              <code-block :custom-style="{ maxHeight: '200px', overflowY: 'hidden' }" :code="l.code" :tags="l.tags"
                :language="l.language">
                <template #menu>
                  <code-menu :code="l.code" :popup-container="'#' + getDomId(index)" />
                </template>
              </code-block>
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
        <div class="flex justify-center pb-4" style="margin-top: 4px;" v-show="gistParams.total > gistParams.size">
          <a-button-group>
            <a-button @click="onPrevPage" :disabled="gistParams.page === 1">
              <icon-left />
              上一页
            </a-button>
            <a-button @click="onNextPage" :disabled="gte(gistParams.size * gistParams.page, gistParams.total)">
              下一页 <icon-right /></a-button>
          </a-button-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useRouter } from "vue-router"
import { reactive, ref, onActivated, shallowRef } from "vue"
import { getGistList } from "@/api/local/getGistList"
import { getTags } from "@/api/local/getTags"
import { setTopLabel } from "@/api/local/setTopLabel"
import { getTopLabel } from "@/api/local/getTopLabel"
import { cancelTopLabel } from "@/api/local/cancelTopLabel"
import dayjs from "dayjs"
import { debounce, eq, isEmpty, gte } from "lodash-es"
import pageScroll from "@/utils/pageScroll"
import CodeMenu from "@/components/CodeMenu.vue"
import getDocs from "@/api/utools/getDocs"

const ALL = 'ALL'
let unrefSelectedKeys = ALL
export default {
  name: 'HomeView',
  components: {
    CodeMenu
  },
  setup() {
    const router = useRouter()
    const gistParams = reactive({ page: 1, size: 10, loading: false, hasMore: true, total: 0, name: '', tag: '' })
    const gistList = ref([])
    const tags = shallowRef([])

    //置顶标签
    const topTags = shallowRef([])

    const isAffix = shallowRef(false)

    const selectedKeys = shallowRef([ALL])

    const isCollapsed = shallowRef(false)

    const onClickGistListItem = (gistId) => {
      pageScroll.setTop(document.documentElement.scrollTop)
      router.push({ name: 'gistDetail', query: { gistId } })
    }

    const onClickCreate = () => {
      router.push({ name: 'create' })
    }

    const onMenuItemClick = (key) => {
      unrefSelectedKeys = key
      gistParams.name = ''
      gistParams.page = 1
      if (eq(key, ALL)) {
        gistParams.tag = ''
      } else {
        gistParams.tag = key
      }
      pageScroll.setTop()
      getList()
    }

    const getList = async () => {
      gistParams.loading = true
      const list = await getGistList({
        page: gistParams.page,
        size: gistParams.size,
        name: gistParams.name,
        tag: gistParams.tag
      })
      if (list) {
        gistParams.hasMore = list.hasMore
        gistParams.total = list.total
        gistList.value = list.data

        if (isEmpty(list.data) && !eq(unrefSelectedKeys, ALL) && isEmpty(gistParams.name)) {
          selectedKeys.value = [ALL]
          unrefSelectedKeys = ALL
          onMenuItemClick(ALL)
        }
      }
      gistParams.loading = false
      //页面滚动到原处
      pageScroll.scrollTo()
    }

    const onInput = debounce(getList, 1000)

    //标签置顶
    const onLabelTop = (tag) => {
      setTopLabel(tag).then(() => {
        getAllTypeLabel()
      })
    }

    //取消置顶
    const onCancelLabelTop = (tag) => {
      cancelTopLabel(tag).then(() => {
        getAllTypeLabel()
      })
    }

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

    const getDomId = () => {
      const before = 'code'
      return (id) => {
        return before + '_' + id
      }
    }

    //获取全部标签、置顶标签
    const getAllTypeLabel = () => {
      Promise.all([getTags(), getTopLabel()]).then(labels => {
        const [label, topLabel] = labels
        tags.value = label
        topTags.value = topLabel
      })
    }

    // 首次持载也会被触发
    onActivated(() => {
      getDocs(async () => {
        getList()
        getAllTypeLabel()
      })
    })

    return {
      onCancelLabelTop,
      topTags,
      onLabelTop,
      ALL,
      gte,
      isCollapsed,
      onMenuItemClick,
      tags,
      isAffix,
      dayjs,
      onInput,
      gistList,
      gistParams,
      onNextPage,
      onPrevPage,
      onClickCreate,
      onClickGistListItem,
      selectedKeys,
      getDomId: getDomId()
    }
  }
}
</script>
<style lang="less" scoped>
.code-hover {
  :deep {
    .code-menu {
      display: none;
    }

    &:hover {
      border-color: rgb(22, 93, 255);

      .code-menu {
        display: inline-block;
      }
    }
  }
}

.label {
  .more {
    opacity: 0;
  }

  &:hover {
    .more {
      opacity: 1;
    }
  }
}
</style>
