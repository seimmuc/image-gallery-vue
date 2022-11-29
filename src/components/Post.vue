<script setup lang="ts">
import type { IPost } from '../api';
import ScrollingText from './ScrollingText.vue';

const props = defineProps<{
  post: IPost | null
  gotoPrev: ((payload: MouseEvent) => void) | null
  gotoNext: ((payload: MouseEvent) => void) | null  // gotoNext?: ...
}>();
</script>

<template>
  <div class="post-container">
    <div class="image-container" :class="{titleless: !(post && post.name)}">
      <ScrollingText v-if="post && post.name" :text="post.name" />
      <img class="post-image" :src="post?.file_url" :alt="post?.description">
      <div v-if="gotoPrev" @click="gotoPrev" class="side-navigation side-navigation-left">
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
      </div>
      <div v-if="gotoNext" @click="gotoNext" class="side-navigation side-navigation-right">
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </div>
    </div>
    <p v-if="post && post.description" class="description">{{post.description}}</p>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";

$border-radius: 8px;
$padding-sides: 45px;
$padding-desc-spacer: 30px;
$title-padding: 66px;
$title-size: 30px;
$title-fade: 0.75em;

.post-container {
  width: fit-content;
  max-width: 100%;
  // padding-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-post-bg);
  /* border-style: solid; */
  border-width: 1.5px;
  border-radius: $border-radius;
  overflow: hidden;
}
.image-container :deep(.scrolltext-text) {
  z-index: 2;
  font-size: $title-size;
  line-height: #{$title-size * 1.5};
  margin: math.div($title-padding - $title-size * 1.5, 2) 0;
  color: var(--color-post-title-txt);
  cursor: default;
  &.long {
    padding: 0 calc($title-fade * 0.6);
  }
}
.image-container :deep(.scrolltext-box:not(.fits)) {
  mask-image: linear-gradient(to right, transparent 0%, black $title-fade, black calc(100% - $title-fade), transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black $title-fade, black calc(100% - $title-fade), transparent 100%);
}
.description {
  white-space: pre-line;
  color: var(--color-post-desc-txt, #111);
  background-color: var(--color-post-desc-bg, white);
  padding: 1em calc($padding-sides + 0.5em);
  align-self: start;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
  min-width: 100%;
  max-width: fit-content;
}
.image-container {
  padding: 0 $padding-sides $padding-desc-spacer;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image-container.titleless {
  padding-top: $title-padding;
}
.post-image {
  display: block;
  max-width: 100%;
}
.side-navigation {
  position: absolute;
  top: 0;
  height: 100%;
  width: 40%;
  max-width: 100px;
  cursor: pointer;
  z-index: 1;
  opacity: 0;
  transition: all .4s ease-in-out;
}
.side-navigation:hover {
  opacity: 1;
}
.side-navigation-left {
  left: 0;
  background-image: linear-gradient(to right, #00000080, #00000012 75%, #00000000);
  /* border-top-left-radius: $border-radius; */
}
.side-navigation-right {
  right: 0;
  background-image: linear-gradient(to left, #00000080, #00000012 75%, #00000000);
  /* border-top-right-radius: $border-radius; */
}
.fa-chevron-right, .fa-chevron-left {
  color: white;
  position: absolute;
  top: 50%;
}
.fa-chevron-right {
  right: math.div($padding-sides, 2.6);
}
.fa-chevron-left {
  left: math.div($padding-sides, 2.6);
}

/* @media (min-width: 1024px) {
  TODO add things here
  .post-image {
    width: 100%;
  }
  .post-container {
    max-width: 95%;
  }
} */
</style>
