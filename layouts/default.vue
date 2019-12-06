<template>
  <div class="antialiased font-light">
    <AppHeader />
    <Nuxt/>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'

export default {
  name: 'DefaultLayout',
  components: {
    AppHeader
  }
}
</script>

<style>

</style>
