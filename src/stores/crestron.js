import { defineStore } from "pinia";

export const useCrestronStore = defineStore("crestron", {
  state: () => ({
    online: false,
  }),
  getters: {
    isOnline: (state) => state.online,
  },
  actions: {
    setOnline(online) {
      this.online = online;
    },
  },
});
