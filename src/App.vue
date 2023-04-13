<script setup>
import { reactive, onBeforeUnmount, onMounted } from "vue";
import * as CrComLib from "@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib";

function buttonEvent() {
  console.log("button clicked");

  CrComLib.publishEvent("b", "33", true);
  CrComLib.publishEvent("b", "33", false);
}

const state = reactive({ value: false });
const w = reactive({
  width: 0,
  height: 0,
  pixelRatio: 0,
});

const unsub = CrComLib.subscribeState("b", "33", (value) => {
  console.log(`toggle(33) second selected(${value})`);
  state.value = value;
});

onBeforeUnmount(() => {
  CrComLib.unsubscribeState("n", "33", unsub);
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
