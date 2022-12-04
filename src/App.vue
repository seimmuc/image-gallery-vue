<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

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
    </nav>
  </header>
  <RouterView />
</template>

<style lang="scss" scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav#topbar {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  font-size: 15px;
  text-align: center;
  margin-top: 0rem;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  background-color: var(--color-navbar-bg);
  border: 1px solid var(--color-navbar-border, #7778);

  a {
    display: inline-block;
    padding: 0.4rem 1rem;
    border-left: 1px solid var(--color-navbar-border, #7778);
    color: var(--color-navbar-txt);
    &:hover {
      color: var(--color-navbar-hover-txt);
      background-color: var(--color-navbar-hover-bg);
    }

    &.router-link-exact-active {
      color: var(--color-navbar-current-txt);
      background-color: var(--color-navbar-current-bg);
      pointer-events: none;
      // cursor: default;
    }
  }
}

nav a:first-of-type {
  border: 0;
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
