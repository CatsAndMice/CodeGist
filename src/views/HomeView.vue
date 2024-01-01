<template>
  <div class="m-auto all-gist mt-9 px-4">
    <div>
      <a-button type="text" @click="onClickPlus" style="--primary-6:0,0,0;">
        <div class="flex items-center">
          <span class="mr-1">全部</span> <a-badge :count="100"
            :dotStyle="{ background: '#E5E6EB', color: '#86909C', boxShadow: 'none' }" />
        </div>
      </a-button>
    </div>
    <a-divider margin="0" />
    <div class="pb-2 select-none" @click="onClickGistListItem(1212)">
      <div class="flex py-2 ">
        <icon-code size="32px" />
        <div class="pl-2">
          <a-link class="text-base font-semibold" :hoverable="false">Gist:1212121212121212121</a-link>
          <p class="m-0 text-xs text-nowrap truncate" style="color:rgb(101, 109, 118);">编辑于</p>
          <p class="m-0 text-xs text-nowrap truncate" style="color:rgb(101, 109, 118);">自动获取变量</p>
        </div>
      </div>
      <div class="code-hover border-solid border-transparent border rounded-md overflow-hidden cursor-pointer">
        <code-block :custom-style="{ maxHeight: '200px', overflowY: 'hidden' }"
          code="cconst a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1const a = 1 1;"
          language="javascript" />
      </div>
    </div>

    <div class="mt-8">
      <a-empty description=" " class="p-0" />
      <p class="text-center text-sm m-0" style="color:rgb(120,120,122);"><span>无数据,</span>
        <a-button type="text" class="p-0 inline" @click="onClickCreate">立即创建</a-button>
      </p>
    </div>
    <div class="flex justify-center" style="margin-top: 4px;"> <a-pagination :total="50" :size="50" show-total /></div>
  </div>
</template>
<script>
import { useRouter } from "vue-router"

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const onClickGistListItem = (gistId) => {
      router.push({ name: 'gistDetail', query: { gistId } })
    }
    const onClickCreate = () => {
      router.push({ name: 'create' })
    }
    return {
      onClickCreate,
      onClickGistListItem
    }
  }
}
</script>
<style lang="less" scoped>
.all-gist {
  max-width: 900px;
}

.code-hover {
  &:hover {
    border-color: rgb(22, 93, 255);
  }
}
</style>
