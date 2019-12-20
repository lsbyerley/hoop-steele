<template>
  <div v-if="isActive">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    name: { required: true },
    value: { required: true },
    selected: { default: false}
  },
  mounted() {
    this.isActive = this.selected;
  },
  data() {
    return {
      isActive: false
    }
  }
}
</script>

<style>

</style>