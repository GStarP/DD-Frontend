<template>
  <router-view />
</template>

<script lang="ts" setup>
// must manually import
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
</style>
