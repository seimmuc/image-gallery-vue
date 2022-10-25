<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref, watchEffect, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Post from '../components/Post.vue'
import { type IPost, type IPool, fetchPost } from '../api'

const route = useRoute();
const router = useRouter();
const post: Ref<IPost | null> = ref(null);
// const pool: Ref<IPool | null> = ref(null);

// watchEffect(
//   async () => {
//     const poolName = route.query.pool;
//     // check if pool name changed
//     if ((pool.value === null ? undefined : pool.value.name) == poolName) {
//       console.info(`pool name did not change: ${poolName}!`)
//       return;
//     }
//     // check if pool is undefined
//     console.info(`new pool: "${poolName}"`);
//     if (!poolName) {
//       pool.value = null;
//       return;
//     }
//     // fetch the pool data
//     const res = await fetch(`/api/pool/${poolName}`)
//     try {
//       pool.value = await res.json();
//     } catch (SyntaxError) {
//       console.error(`Pool '${poolName}' doesn't exist or is invalid.`);
//       return;
//     }
//   }
// );

// watchEffect(async () => {
//   const response = await fetch(url.value)
//   data.value = await response.json()
// });

async function loadImage(id: number): Promise<void> {
  // const res = await fetch(`/api/post/${id}`);
  // post.value = await res.json();
  console.log(`pulling post id(${id})`);
  if (!Number.isSafeInteger(id))
    return;
  try {
    post.value = await fetchPost(id);
  } catch (SyntaxError) {
    post.value = null;
  }
}

watchEffect(
  async () => {
    await loadImage(parseInt(route.params.id as string));
  }
);

const currentPool = computed((): IPool | null => {
  const poolName = route.query.pool;
  if (post.value === null || poolName === undefined || !post.value.pools)
    return null;
  const pool = post.value.pools.find(p => p.name == poolName);
  return pool? pool : null;
});

const prevPostId = computed((): number | undefined => currentPool.value ? currentPool.value.previd : undefined)
const nextPostId = computed((): number | undefined => currentPool.value ? currentPool.value.nextid : undefined)
function gotoPrev(e: MouseEvent) {
  if (!prevPostId.value)
    return;
  router.push({name: 'post', params: {id: prevPostId.value}, query: route.query});
}
function gotoNext(e: MouseEvent) {
  if (!nextPostId.value)
    return;
  router.push({name: 'post', params: {id: nextPostId.value}, query: route.query});
}
</script>

<template>
  <main class="post-view">
    <Post :post="post" :goto-prev="prevPostId? gotoPrev : null" :goto-next="nextPostId? gotoNext : null" />
    <!-- <RouterLink class="navigate navigate-right" :to="{name: 'post', params: {id: userData + 1}}"><font-awesome-icon icon="fa-solid fa-chevron-right" /></RouterLink> -->
  </main>
</template>

<style scoped>
.image-container {
  display: flex;
}

.navigate {
  overflow: hidden;
  white-space: nowrap;
}
</style>
