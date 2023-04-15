<script setup>
import { reactive, onBeforeUnmount, onMounted, useCssModule } from "vue";
import * as CrComLib from "@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib";

import { useCrestronStore } from "@/stores/crestron.js";

const crestron = useCrestronStore();

function buttonEvent() {
  CrComLib.publishEvent("b", "33", true);
  CrComLib.publishEvent("b", "33", false);
}

const state = reactive({ value: false });
const w = reactive({
  width: 0,
  height: 0,
  pixelRatio: 0,
});

const audio = new Audio("./pleaseConnect.mp3");

function playAudio() {
  audio.play();
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
}

const sigB33 = CrComLib.subscribeState("b", "33", (value) => {
  state.value = value;
});

const sigB34 = CrComLib.subscribeState("b", "34", (value) => {
  if (value) {
    playAudio();
  }
});

onBeforeUnmount(() => {
  CrComLib.unsubscribeState("n", "33", sigB33);
  CrComLib.unsubscribeState("n", "34", sigB34);
});

onMounted(() => {
  w.width = window.innerWidth;
  w.height = window.innerHeight;
  w.pixelRatio = window.devicePixelRatio;
  window.addEventListener("resize", () => {
    w.width = window.innerWidth;
    w.height = window.innerHeight;
    w.pixelRatio = window.devicePixelRatio;
  });
});
</script>

<template>
  <div>
    <div>
      <button @click="buttonEvent">Join 33</button>
      {{ state.value }}
    </div>
    <div>
      {{ w }}
    </div>
    <div>
      <button @click="playAudio">Play</button>
      <button @click="stopAudio">Stop</button>
    </div>
    <div>{{ crestron.isOnline }}</div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
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
}
</style>
