<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { useRouter, type RouteLocationRaw } from 'vue-router';
import type { IPost } from '../api'

const router = useRouter();

const props = defineProps<{
  post: IPost | null
  // navTo?: RouteLocationRaw | undefined
}>();

const c: any = computed(() => console);
const name: ComputedRef<string | undefined> = computed(() => props.post?.name);
</script>

<template>
  <div class="post-thumb">
    <template v-if="post">
      <img class="thumb-image" :src="post.file_url" :alt="post.description">
      <div class="thumb-overlay" :class="{'thumb-overlay-gradient': !!post.name}">
        <label v-if="post.name" class="post-name">{{ name }}</label>
      </div>
    </template>
    <div v-else class="thumb-image"></div>
  </div>
</template>

<style scoped>
.post-thumb {
  /* width: 250px;
  height: 250px; */
  display: flex;
  overflow: hidden;
  /* border: 1px solid gray; */
  border-radius: 8px;
  cursor: pointer;
  scale: 96%;
  transition: scale .3s ease-in-out;
}
.post-thumb:hover {
  scale: 104%;
}
.thumb-image {
  overflow: hidden;
  width: 250px;
  height: 250px;
  object-fit: cover;
  z-index: 1;
}
.thumb-overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0;
  transition: opacity .3s ease-in-out;
}
.thumb-overlay.thumb-overlay-gradient {
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 90%);
}
.post-thumb:hover .thumb-overlay {
  opacity: 1;
}
.post-name {
  position: absolute;
  left: 4%;
  width: 92%;
  align-self: center;
  bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  /* text-align: center; */
  cursor: inherit;
  user-select: none;
  opacity: 0.9;
  z-index: 3;

  /* text gradient */
  background: linear-gradient(to right, #ffffff 80%, #ff000000 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
