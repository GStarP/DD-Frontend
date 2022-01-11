<template>
  <div class="home">
    <div class="count">{{ count }}</div>
    <el-button @click="inc">Click</el-button>
  </div>
</template>

<script lang="ts" setup>
import axios from "../plugins/axios";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const count = computed(() => store.state.count);
const inc = () => store.commit("inc");

// should raise error in console
axios.get("/no-api");
</script>

<style lang="scss">
.home {
  .count {
    font-size: 36px;
  }
}
</style>
