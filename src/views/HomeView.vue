<script setup lang="ts">
import PoolPreview from '@/components/PoolPreview.vue';
import { onMounted, ref, type Ref } from 'vue';
import { fetchHome, type IHome } from '@/api';

const home: Ref<IHome | null> = ref(null);

onMounted(async () => {
  home.value = await fetchHome();
});

</script>

<template>
  <main v-if="home">
    <RouterLink v-for="pool in home.pools" :to="{name: 'pool', params: {'name': pool.name}}">
      <PoolPreview :pool="pool"/>
    </RouterLink>
  </main>
  <main v-else>
    <p>Loading...</p>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* background-color: antiquewhite; */
  border-radius: 20px;
}
/* main > * {
  list-style-type: none;
  margin: 0.75em 0.75em;
} */
</style>
