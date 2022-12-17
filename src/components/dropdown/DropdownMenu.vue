<script setup lang="ts">
import type { CloseSignals } from './Dropdown.vue';

const props = defineProps<{
  active: boolean
  closeFuncs: CloseSignals | undefined
}>();
</script>

<template>
  <Transition name="movedown">
    <div v-if="active" class="dropdown-menu" tabindex="-1"
      @focusin="() => closeFuncs?.cancelClose()"
      @focusout="() => closeFuncs?.closeMenu()"
    >
      <slot/>
    </div>
  </Transition>
</template>

<style scoped>
.dropdown-menu {
  position: absolute;
  transform-origin: top left;
  width: max-content;
  padding: 0.5em;
  margin-top: 0.5em;
  border-radius: 0.5em;
}
.movedown-enter-active, .movedown-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.movedown-enter-from, .movedown-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>