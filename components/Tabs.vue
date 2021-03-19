<template>
  <div class="tabs">
    <ul class="flex mb-6 border-b list-reset">
      <li class="mr-1 -mb-px" v-for="tab in tabs" :key="tab.name">
        <a
          href="#"
          class="font-semibold tab"
          @click="selectTab(tab, $event)"
          :class="{ active: tab.isActive }"
          >{{ tab.value }}</a
        >
      </li>
    </ul>
    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [],
    };
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab, e) {
      e.preventDefault();
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name == selectedTab.name;
      });
    },
  },
};
</script>

<style></style>
