<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref, watchEffect, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Post from '../components/Post.vue';
import { type IPost, type IPool, fetchPost } from '../api';

const route = useRoute();
const router = useRouter();
const post: Ref<IPost | null> = ref(null);

// loads new post data when params.id changes
watchEffect(
  async () => {
    const id = parseInt(route.params.id as string);
    if (!Number.isSafeInteger(id))
      return;
    try {
      post.value = await fetchPost(id);
    } catch (SyntaxError) {
      post.value = null;
    }
  }
);

// returns current pool as specified by url query, if it's present on the post object
const currentPool = computed((): IPool | null => {
  const poolName = route.query.pool;
  if (post.value === null || poolName === undefined || !post.value.pools)
    return null;
  const pool = post.value.pools.find(p => p.name == poolName);
  return pool? pool : null;
});

// previous/next post computed properties and navigation functions
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
