<template>
  <!-- 头部 -->
  <div style="background-color: #24292f;--color-text-1:#fff;">
    <a-page-header title="CodeGist" subtitle="即刻记录笔记、代码" :show-back="false">
      <template #title>
        <span class="title">CodeGist</span>
      </template>
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
              <a-avatar class="cursor-pointer" :image-url="user.avatar">{{ isEmpty(user) ? '未登录' : '' }}</a-avatar>
              <template #content>
                <a-doption @click="onClickMyGist">
                  <template #icon>
                    <icon-code />
                  </template>
                  我的 Gist</a-doption>
                <!-- utools环境不提供Gitee授权登陆 -->
                <template v-if="!isUtools">
                  <a-doption v-if="isEmpty(user)" @click="onLogin">
                    <template #icon>
                      <icon-import />
                    </template>
                    立即登录
                  </a-doption>
                  <a-doption v-else @click="onExit">
                    <template #icon>
                      <icon-export />
                    </template>
                    退出登录
                  </a-doption>
                </template>
              </template>
            </a-dropdown>
          </div>
        </div>
      </template>
    </a-page-header>
  </div>

  <a-divider margin="0" />
  <!-- 内容 -->
  <div class="pt-0 ">
    <router-view v-slot="{ Component }">
      <!-- 缓存meta.isCache为true的组件 -->
      <keep-alive>
        <component v-if="route.meta.isCache" :is="Component" />
      </keep-alive>
      <component v-if="!route.meta.isCache" :is="Component" />
    </router-view>
  </div>

  <a-back-top :style="{
    position: 'fixed',
    right: '40px',
    bottom: '40px'
  }">

    <div class="back-top flex justify-center items-center cursor-pointer bg-white"
      style="box-shadow: 2px 2px 10px 0 rgba(0,0,0,.15);height: 42px;width: 42px;border-radius: 12px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
        <path
          d="M512 843.2c-36.2 0-66.4-13.6-85.8-21.8-10.8-4.6-22.6 3.6-21.8 15.2l7 102c.4 6.2 7.6 9.4 12.6 5.6l29-22c3.6-2.8 9-1.8 11.4 2l41 64.2c3 4.8 10.2 4.8 13.2 0l41-64.2c2.4-3.8 7.8-4.8 11.4-2l29 22c5 3.8 12.2.6 12.6-5.6l7-102c.8-11.6-11-20-21.8-15.2-19.6 8.2-49.6 21.8-85.8 21.8z">
        </path>
        <path
          d="m795.4 586.2-96-98.2C699.4 172 513 32 513 32S324.8 172 324.8 488l-96 98.2c-3.6 3.6-5.2 9-4.4 14.2L261.2 824c1.8 11.4 14.2 17 23.6 10.8L419 744s41.4 40 94.2 40c52.8 0 92.2-40 92.2-40l134.2 90.8c9.2 6.2 21.6.6 23.6-10.8l37-223.8c.4-5.2-1.2-10.4-4.8-14zM513 384c-34 0-61.4-28.6-61.4-64s27.6-64 61.4-64c34 0 61.4 28.6 61.4 64S547 384 513 384z">
        </path>
      </svg>
    </div>
  </a-back-top>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { eq, hasIn, isEmpty } from "lodash-es"
import { onMounted, ref, shallowRef, unref } from 'vue'
import giteeLogin from "@/api/usr/giteeLogin"

export default {
  beforeRouteEnter(to, from, next) {
    console.log(1212)
  },
  setup() {
    const pageName = 'create'
    const isUtools = shallowRef(false)
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

    const onLogin = () => {
      //重新登陆前，先把已缓存的数据清空
      giteeLogin.onExit()
      giteeLogin.onLogin()
    }

    const onExit = () => {
      giteeLogin.onExit()
      user.value = {}
    }

    onMounted(async () => {
      isUtools.value = hasIn(window, 'utools')
      //utools环境不支持跳转其他页面
      if (unref(isUtools)) {
        const utoolsUser = utools.getUser()
        if (utoolsUser) {
          user.value = utoolsUser
        }

        //处理utools环境首次进入空白
        router.push({ name: 'homeView' })

        return
      }

      const giteeUser = await giteeLogin.getUser()
      if (giteeUser) {
        user.value = {
          avatar: giteeUser.avatar_url,
          nickname: giteeUser.name
        }
        return
      }

      //处理跳转链接暂无code值
      setTimeout(async () => {
        //链接存在code并且没有登录过
        if (route.query.code && isEmpty(giteeUser)) {
          const codeLoginUser = await giteeLogin.getToken(route.query.code)
          if (codeLoginUser) {
            user.value = {
              avatar: codeLoginUser.avatar_url,
              nickname: codeLoginUser.name
            }
          }
        }
      }, 100)
    })

    return {
      route,
      eq,
      user,
      pageName,
      onClickPlus,
      onLogin,
      onClickMyGist,
      isEmpty,
      onExit,
      isUtools
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

.cursor-pointer {
  .arco-avatar-image {
    transform: none !important;
  }
}

.title {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(rgb(194, 173, 255), rgb(237, 255, 158));
}

.back-top {
  &:hover {
    transform: scale(1.1) translateZ(30px);
  }
}
</style>
