<template>
  <a class="dropdown-item">
    <slot/>
  </a>
</template>

<style scoped>
.dropdown-item {
  display: block;
  background-color: transparent;
  padding: 0.25em 1em;
  margin: 0.25em 0;
  font-weight: 500;
  cursor: pointer;
}
</style>
