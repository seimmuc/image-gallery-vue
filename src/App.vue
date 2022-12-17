<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ThemePicker from './components/ThemePicker.vue';

if (true || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  console.log('enabling dark mode');
  document.documentElement.classList.remove('theme-light');
  document.documentElement.classList.add('theme-dark');
} else {
  console.log('enabling light mode');
  document.documentElement.classList.remove('theme-dark');
  document.documentElement.classList.add('theme-light');
}
</script>

<template>
  <header>
    <nav id="topbar">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink :to="{name: 'pool', params: {name: 'all'}}">Pools</RouterLink>
      <RouterLink :to="{name: 'post', params: {id: 1}, query: {pool: 'all'}}">Post</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <ThemePicker />
    </nav>
  </header>
  <RouterView />
</template>

<style lang="scss" scoped>
@use "sass:math";

$navbar-height: 2.6em;
$navbar-text-height: 1.5em;
$border-width: 1px;

header {
  line-height: 1.5;
  max-height: 100vh;
}

nav#topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: $navbar-height;
  font-size: 15px;
  text-align: center;
  margin-top: 0rem;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  background-color: var(--color-navbar-bg);
  border: $border-width solid var(--color-navbar-border, #7778);
  transition: color 0.25s ease, background-color 0.25s ease;
  a {
    display: inline-block;
    padding: calc(math.div(($navbar-height - $navbar-text-height), 2) - $border-width) 1rem;
    text-decoration: none;
    color: var(--color-navbar-txt);
    line-height: $navbar-text-height;
    &.router-link-exact-active {
      color: var(--color-navbar-current-txt);
      background-color: var(--color-navbar-current-bg);
      pointer-events: none;
    }
  }
  a, :deep(.theme-button), :deep(.theme-picker .dropdown-item) {
    transition: color 0.25s ease, background-color 0.25s ease;
    cursor: pointer;
    &:hover, &.active {
      color: var(--color-navbar-hover-txt);
      background-color: var(--color-navbar-hover-bg);
    }
  }
  a, :deep(.theme-button) {
    border-left: $border-width solid var(--color-navbar-border, #7778);
    &:last-of-type {
      border-right: $border-width solid var(--color-navbar-border, #7778);
    }
  }

  > :deep(.theme-picker) {
    margin-left: auto;
    margin-right: 20px;
    height: 100%;
    aspect-ratio: 1 / 1;
  }
  :deep(.theme-picker .dropdown-menu) {
    right: 0;
    transform-origin: top right;
    z-index: 1;
    color: var(--color-navbar-txt);
    background-color: var(--color-navbar-bg);
    .dropdown-item:hover:not(.movedown-leave-active) {
      color: var(--color-navbar-hover-txt);
      background-color: var(--color-navbar-hover-bg);
    }
    &.movedown-leave-from .dropdown-item {
      transition: background-color 0s;
      background-color: transparent;
    }
  }
}

/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
