<template>
  <!-- 头部 -->
  <div class="header">

  </div>
  <!-- 内容 -->
  <div class="main">
    <router-view />
  </div>
</template>
<style lang="less">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

.main {
  max-width: 900px;
  margin: auto;
}
</style>
