<script setup lang="ts">
import type { IPool, IPost } from '@/api';
import { computed, type ComputedRef } from 'vue';
import { useRouter, type RouteLocationRaw } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  pool: IPool
  navTo?: RouteLocationRaw | undefined
}>();

const PHOTOS_LAYOUT: {[pc: number]: {left: number | null, center: number | null, right: number | null}} = {
  0: {left: null, center: null, right: null},
  1: {left: null, center: 0, right: null},
  2: {left: 0, center: null, right: 1},
  3: {left: 1, center: 0, right: 2},
}

function getPostAt(pos: 'left' | 'center' | 'right'): IPost | undefined {
  if (!props.pool.posts || props.pool.posts.length > 3)
    return;
  const l = PHOTOS_LAYOUT[props.pool.posts.length][pos]
  return l === null ? undefined : props.pool.posts[l]
}
const leftPost: ComputedRef<IPost | undefined> = computed(() => getPostAt('left'));
const centerPost: ComputedRef<IPost | undefined> = computed(() => getPostAt('center'));
const rightPost: ComputedRef<IPost | undefined> = computed(() => getPostAt('right'));
</script>

<template>
  <div @click="if (navTo) router.push(navTo);" class="pool-preview">
    <div class="pool-thumb-container">
      <div v-if="leftPost" class="pool-preview-frame pool-preview-frame-left">
        <img class="pool-preview-image" :src="leftPost?.file_url">
      </div>
      <div v-if="rightPost" class="pool-preview-frame pool-preview-frame-right">
        <img class="pool-preview-image" :src="rightPost?.file_url">
      </div>
      <div v-if="centerPost" class="pool-preview-frame pool-preview-frame-center">
        <img class="pool-preview-image" :src="centerPost?.file_url">
      </div>
    </div>
    <div class="pool-thumb-overlay">
      <label class="pool-name">{{ pool.name }}</label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pool-preview {
  width: 400px;
  height: 400px;
  overflow: hidden;
  &:hover {
    overflow: visible;
    // background: radial-gradient(circle, rgba(210, 239, 255, 0.99) 0%, rgba(0,0,0,0) 75%);
    .pool-preview-frame {
      scale: 1.05;
      box-shadow: 2px 5px 6px rgba(0, 0, 0, .6);
    }
  }
}
.pool-preview-frame {
  background-color: #f8f8f8;
  border: 0.5px solid rgb(196, 196, 196);
  display: inline-block;
  padding: 12px 12px 35px;
  text-align: center;
  text-decoration: none;
  box-shadow: 1px 3px 3px rgba(0, 0, 0, .4);
  transition: all .25s linear;
  position: absolute;
  &:hover {
    z-index: 5;
  }
  &-center {
    z-index: 4;
    translate: 88px 40px;
    .pool-preview:hover & {
      // translate: 88px 20px;
      translate: 88px 50px;
      rotate: 0.5deg;
    }
  }
  &-left {
    z-index: 2;
    translate: 75px 45px;
    rotate: -2deg;
    .pool-preview:hover & {
      translate: 15px 20px;
      rotate: -5deg;
    }
  }
  &-right {
    z-index: 3;
    translate: 102px 44px;
    rotate: 2deg;
    .pool-preview:hover & {
      translate: 160px 20px;
      rotate: 5deg;
    }
  }
}
.pool-preview-image {
  display: block;
  width: 200px;
  height: 200px;
  object-fit: cover;
}
.pool-thumb-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 6;
  pointer-events: none;
  .pool-name {
    position: absolute;
    width: 100%;
    bottom: 30px;
    text-align: center;
    font-size: 2.2em;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    color: var(--color-home-text);
    font-weight: bold;
    text-transform: capitalize;
    // text-shadow: 1px 2px 4px lightgray;
    transition: all .25s linear;
    .pool-preview:hover & {
      bottom: 20px;
      // text-shadow: 1px 2px 6px lightgray;
      scale: 1.1;
    }
  }
}
</style>
