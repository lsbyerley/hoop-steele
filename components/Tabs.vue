<template>
  <div class="tabs">

    <ul class="list-reset flex border-b mb-6">
      <li class="-mb-px mr-1" v-for="tab in tabs" :key="tab.name">
        <a href="#" class="tab font-semibold" @click="selectTab(tab, $event)" :class="{ 'active': tab.isActive }">{{ tab.value }}</a>
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
      tabs: []
    }
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab, e) {
      e.preventDefault()
      this.$ga.event({
        eventCategory: 'Tab',
        eventAction: 'click',
        eventLabel: selectedTab.name
      })
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name == selectedTab.name);
      });
    }
  }
}
</script>

<style>

</style>