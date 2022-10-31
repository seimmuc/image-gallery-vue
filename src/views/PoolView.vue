<script setup lang="ts">
import { ref, watchEffect, type Ref } from 'vue';
import { fetchPool, type IPool } from '../api'
import PostThumbnail from '@/components/PostThumbnail.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pool: Ref<IPool | null> = ref(null);

watchEffect(
  async () => {
    const poolName = route.params.name as string;
    if (!poolName.match(/^[\w\-]+$/)) {
      pool.value = null;
      return;
    }
    try {
      console.info(`fetching '${poolName}'`);
      pool.value = await fetchPool(poolName);
    } catch (SyntaxError) {
      pool.value = null;
    }
  }
);
</script>

<template>
  <main>
    <template v-if="pool && pool.posts">
      <div v-for="post in pool.posts">
        <RouterLink :to="{name: 'post', params: {id: post.id}, query: {pool: pool.name}}">
          <PostThumbnail :post="post"/>
        </RouterLink>
      </div>
    </template>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* background-color: antiquewhite; */
}
div {
  list-style-type: none;
  /* margin: 0.75em 0.75em; */
}
</style>