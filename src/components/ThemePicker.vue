<script setup lang="ts">
import {Theme} from '@/themes';
import { Dropdown, DropdownMenu, DropdownItem, type CloseSignals } from '@/components/dropdown/DropdownAll';
import { onMounted } from 'vue';

const defaultTheme = new Theme('theme-default', 'Default');
const darkTheme = new Theme('theme-dark', 'Dark', 'dark');
const lightTheme = new Theme('theme-light', 'Light', 'light');
const themes = [defaultTheme, darkTheme, lightTheme];

let currentTheme: Theme | undefined = undefined;
const root: HTMLHtmlElement = document.documentElement as HTMLHtmlElement;

onMounted(() => {
  currentTheme = themes.find((t) => root.classList.contains(t.name))
});

function pickedTheme(theme: Theme, closeFuncs: CloseSignals) {
  if (theme == currentTheme)
    return;
  
  // remove current theme first
  if (currentTheme && currentTheme.mode != 'default') {
    root.classList.remove(currentTheme.name);
  }

  // then apply new theme
  if (theme.mode != 'default') {
    root.classList.add(theme.name);
  }
  currentTheme = theme;
  
  // close the menu immediately
  closeFuncs.closeMenu(true);
}

function isCurrent(theme: Theme): boolean {
  return theme == currentTheme;
}
</script>

<template>
  <div class="theme-picker">
    <Dropdown>
      <template #toggleButton="{active, toggleFunc, closeFuncs}">
        <div class="theme-button" :class="{active: active}" tabindex="-1" @click="toggleFunc"
          @focusin="closeFuncs.cancelClose()" @focusout="closeFuncs.closeMenu()"
        >
          <font-awesome-icon class="theme-icon" icon="fa-solid fa-moon" />
        </div>
      </template>
      <template #default="{active, closeFuncs}">
        <DropdownMenu v-bind="{active, closeFuncs}" ref="themeDropdownMenu">
          <DropdownItem v-for="t in themes" :class="{current: isCurrent(t)}" @click="pickedTheme(t, closeFuncs)">
            {{t.displayName}}
          </DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </div>
</template>

<style lang="scss" scoped>
.theme-picker {
  .theme-button {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    > .theme-icon {
      align-self: center;
    }
  }
  :deep(.dropdown) {
    height: 100%;
  }
  :deep(.dropdown-item) {
    border-radius: 4px;
    &.current {
      color: var(--color-navbar-current-txt);
      background-color: var(--color-navbar-current-bg);
      pointer-events: none;
    }
  }
}
</style>
