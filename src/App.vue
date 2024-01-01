<template>
  <!-- 头部 -->
  <div style="background-color: #24292f;--color-text-1:#fff;">
    <a-page-header title="CodeGist" subtitle="即刻记录笔记、代码片段" :show-back="false">
      <template #extra>
        <div class="flex items-center">
          <div v-show="!eq(route.name, pageName)" style="height: 30px;">
            <a-button type="text" @click="onClickPlus" style="width: 30px;height: 30px;">
              <template #icon>
                <icon-plus size="20px" style="color:#fff;" />
              </template>
            </a-button>
          </div>

          <div class="ml-8">
            <a-dropdown position="tr">
              <a-avatar class="cursor-pointer" :image-url="user.avatar">未登陆</a-avatar>
              <template #content>
                <a-doption @click="onClickMyGist">
                  <template #icon>
                    <icon-code />
                  </template>
                  我的 Gist</a-doption>
                <!-- utools不提供登陆快捷入口 -->
                <!-- <a-doption>
                  <template #icon>
                    <icon-import />
                  </template>
                  立即登陆
                </a-doption> -->
              </template>
            </a-dropdown>
          </div>
        </div>
      </template>
    </a-page-header>
  </div>

  <a-divider margin="0" />
  <!-- 内容 -->
  <div class="main pt-0">
    <router-view />
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { eq, hasIn } from "lodash-es"
import { onBeforeMount, ref } from 'vue'

export default {
  setup() {
    const pageName = 'create'
    const router = useRouter()
    const route = useRoute()
    const user = ref({})
    const onClickMyGist = () => {
      const PAGE_NAME = 'homeView'
      if (eq(route.name, PAGE_NAME)) return
      router.push({ name: PAGE_NAME })
    }

    const onClickPlus = () => {
      router.push({ name: pageName })
    }

    onBeforeMount(() => {
      if (hasIn(window, 'utools')) {
        const utoolsUser = utools.getUser()
        if (utoolsUser) {
          user.value = utoolsUser
        }
      }
    })

    return {
      route,
      eq,
      user,
      pageName,
      onClickPlus,
      onClickMyGist
    }
  },
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;

}
</style>
