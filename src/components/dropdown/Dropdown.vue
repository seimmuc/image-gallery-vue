<script setup lang="ts">
export type CloseSignals = {closeMenu: (immediate?: boolean) => void, cancelClose: () => void};
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  buttonText?: string
}>(), {
  buttonText: "˅"
});

const active = ref(false);
let closingId: NodeJS.Timeout | undefined = undefined

function toggleMenu() {
  cancelClose();
  active.value = !active.value;
}
function closeMenu(instant: boolean = false) {
  cancelClose();
  if (instant === true) {
    active.value = false;
  } else {
    closingId = setTimeout(() => {
      active.value = false;
      closingId = undefined;
    }, 0);
  }
}
function cancelClose() {
  if (closingId) {
    clearTimeout(closingId);
    closingId = undefined;
  }
}

const closeFuncs: CloseSignals = {closeMenu, cancelClose};
</script>

<template>
  <div class="dropdown">
    <slot name="toggleButton" :active="active" :toggleFunc="toggleMenu" :closeFuncs="closeFuncs">
      <button class="dropdown-button" @click="toggleMenu"
        @focusin="closeFuncs.cancelClose()" @focusout="closeFuncs.closeMenu()"
      >{{buttonText}}</button>
    </slot>
    <slot :active="active" :closeFuncs="closeFuncs" />
  </div>
</template>
