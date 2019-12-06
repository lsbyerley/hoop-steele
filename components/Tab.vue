<template>
  <transition name="fade" appear mode="out-in">
    <div v-if="isActive">
      <slot></slot>
    </div>
  </transition>
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
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>