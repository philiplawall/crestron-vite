<script lang="ts" setup>
import { reactive, onBeforeUnmount, onMounted } from "vue";
// import * as CrComLib from "@crestron/ch5-crcomlib";

import * as CrComLib from "ch5-crcomlib-lite";

import { useCrestronStore } from "./stores/crestron";

const crestron = useCrestronStore();

function buttonEvent() {
  CrComLib.publishEvent("b", "33", true);
  CrComLib.publishEvent("b", "33", false);
}

function setButton(button: number, state: boolean) {
  CrComLib.publishEvent("b", button.toString(), state);
}

const state = reactive({ value: false, "30": false, "31": false, "32": false });
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

const sigB30 = CrComLib.subscribeState("b", "30", (value: boolean) => {
  state["30"] = value;
});

const sigB31 = CrComLib.subscribeState("b", "31", (value: boolean) => {
  state["31"] = value;
});

const sigB32 = CrComLib.subscribeState("b", "32", (value: boolean) => {
  state["32"] = value;
});

const sigB33 = CrComLib.subscribeState("b", "33", (value: boolean) => {
  state.value = value;
});

const sigB34 = CrComLib.subscribeState("b", "34", (value: boolean) => {
  if (value) {
    playAudio();
  }
});

onBeforeUnmount(() => {
  CrComLib.unsubscribeState("n", "30", sigB30);
  CrComLib.unsubscribeState("n", "31", sigB31);
  CrComLib.unsubscribeState("n", "32", sigB32);

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
    <table>
      <tr>
        <td>
          <button
            @mousedown="setButton(30, true)"
            @mouseup="setButton(30, false)"
            @touchstart="setButton(30, true)"
            @touchend="setButton(30, false)"
          >
            Button 30
          </button>
        </td>
        <td>
          <button
            @mousedown="setButton(31, true)"
            @mouseup="setButton(31, false)"
            @touchstart="setButton(31, true)"
            @touchend="setButton(31, false)"
          >
            Button 31
          </button>
        </td>
        <td>
          <button
            @mousedown="setButton(32, true)"
            @mouseup="setButton(32, false)"
            @touchstart="setButton(32, true)"
            @touchend="setButton(32, false)"
          >
            Button 32
          </button>
        </td>
      </tr>
      <tr>
        <td>{{ state[30] }}</td>
        <td>{{ state[31] }}</td>
        <td>{{ state[32] }}</td>
      </tr>
    </table>

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
