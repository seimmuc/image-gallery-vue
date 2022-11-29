<script setup lang="ts">
import { onMounted, onUpdated, ref, type Ref } from 'vue';

const props = withDefaults(defineProps<{
  text: string
  color?: string | undefined
  pauseFor?: number
  textSpeed?: number
  resizeObserve?: boolean
}>(), {
  color: undefined,
  pauseFor: 3000,
  textSpeed: 75,
  resizeObserve: true
});

const eBox: Ref<HTMLDivElement | null> = ref(null);
const eTxt: Ref<HTMLParagraphElement | null> = ref(null);

const isLong: Ref<boolean> = ref(false);
let anim: Animation | null = null;
let hovered = false;

onMounted(() => {
  if (!eTxt.value || !eBox.value)
    return;
  
  if (props.resizeObserve) {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target !== eBox.value) {
          continue;
        }
        updateBox();
      }
    });
    resizeObserver.observe(eBox.value);
  } else {
    updateBox();
  }
});

onUpdated(() => {
  updateBox();
});

function updateBox() {
  if (!eTxt.value || !eBox.value || eBox.value.clientWidth <= 0)
    return;
  if (anim != null) {
    const a = anim;
    anim = null;
    a.cancel();
  }
  const boxWidth = eBox.value.clientWidth;
  const tcs = getComputedStyle(eTxt.value);
  const txtWidth = eTxt.value.clientWidth - parseFloat(tcs.paddingLeft) - parseFloat(tcs.paddingRight)
  console.log(`box width: ${boxWidth}, text width: ${txtWidth}`);
  isLong.value = txtWidth > boxWidth;
  if (isLong.value) {
    const {textKeyframes, timing} = generateAnimation(boxWidth, txtWidth - boxWidth, props.textSpeed);
    anim = eTxt.value.animate(textKeyframes, timing);
    anim.finished.then(textSwitchDirections);
    anim.reverse();
    anim.finish();
  }
}

function textSwitchDirections(animation: Animation) {
  if (animation != anim) {
    return;
  }
  new Promise(resolve => setTimeout(resolve, props.pauseFor)).then(() => {
    if (animation != anim) {
      return;
    }
    animation.reverse();
    if (hovered)
      animation.pause();
    animation.finished.then(textSwitchDirections);
  });
}

function generateAnimation(boxWidth: number, extraWidth: number, textSpeed: number): {textKeyframes: Keyframe[], timing: KeyframeAnimationOptions} {
  const timing: KeyframeAnimationOptions = {
    duration: (extraWidth / textSpeed) * 1000,
    iterations: 1,
    fill: 'both'
  }
  const textKeyframes: Keyframe[] = [
    {left: '0%', transform: 'translateX(0%)'},
    {left: '100%', transform: 'translateX(-100%)'}
  ];
  return {textKeyframes, timing};
}

function onBoxHoverStart() {
  hovered = true;
  if (anim && anim.playState == 'running')
    anim?.pause();
}
function onBoxHoverEnd() {
  hovered = false;
  if (anim && anim.playState == 'paused')
    anim.play();
}
</script>

<template>
  <div ref="eBox" class="scrolltext-box" :class="{fits: !isLong}" @mouseenter="onBoxHoverStart" @mouseleave="onBoxHoverEnd">
    <p ref="eTxt" class="scrolltext-text" :class="{long: isLong}"
        :style="{'--tex-col': color}" :title="isLong? text : undefined">
      {{text}}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.scrolltext-box {
  width: 0;
  min-width: 100%;
  display: flex;
  overflow: hidden;
  &.fits {
    place-content: center;
  }
}
.scrolltext-text {
  color: var(--tex-col, white);
  width: fit-content;
  white-space: nowrap;
}
</style>
