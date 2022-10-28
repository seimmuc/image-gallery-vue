<script setup lang="ts">
import type { IPost } from '../api'

const props = defineProps<{
  post: IPost | null
  gotoPrev: ((payload: MouseEvent) => void) | null
  gotoNext: ((payload: MouseEvent) => void) | null  // gotoNext?: ...
}>()
</script>

<template>
  <div class="post-container">
    <h1 v-if="post && post.name">{{post.name}}</h1>
    <div class="image-container">
      <img class="post-image" :src="post?.file_url" :alt="post?.description">
      <div v-if="gotoPrev" @click="gotoPrev" class="side-navigation side-navigation-left">
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
      </div>
      <div v-if="gotoNext" @click="gotoNext" class="side-navigation side-navigation-right">
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </div>
    </div>
    <p v-if="post && post.description">{{post.description}}</p>
  </div>
</template>

<style scoped>
.post-container {
  width: max-content;
  max-width: 90%;
}
h1 {
  margin: 0.2em 0.5em;
}
p {
  white-space: pre-line;
  margin-top: 1.4em;
  margin-inline: 0.3em;
}
.image-container {
  width: fit-content;
  z-index: 0;
}
.post-image {
  display: block;
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
}
.side-navigation-right {
  right: 0;
  background-image: linear-gradient(to left, #00000080, #00000012 75%, #00000000);
}
.fa-chevron-right, .fa-chevron-left {
  color: white;
  position: absolute;
  top: 50%;
}
.fa-chevron-right {
  right: 10%;
}
.fa-chevron-left {
  left: 10%;
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
