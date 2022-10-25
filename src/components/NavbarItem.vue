<script setup lang="ts">
defineProps<{
  to: string
  active: boolean
}>()
</script>

<template>
  <li class="navbar-item" :class="{active: true}">
    <RouterLink :to="to"><slot></slot></RouterLink>
  </li>
</template>

<style>
.navbar-item {
  list-style: none;
  padding: 5px 10px;
}
</style>