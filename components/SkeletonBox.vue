<template>
  <article class="overflow-hidden text-xs rounded shadow-md game">
    <header class="flex justify-between px-2 py-2 bg-gray-300 skeleton-box"></header>

    <div class="flex flex-wrap px-2 pt-4 pb-4 md:flex-no-wrap">
      <section class="flex flex-col content-center justify-center w-1/2 px-1 md:flex-1">
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
      </section>
      <section class="flex flex-col content-center justify-center w-1/2 px-4 md:flex-1">
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
      </section>
      <section class="flex flex-col content-center justify-center w-full md:w-5/12">
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
        <div class="flex py-2 mb-2 skeleton-box"></div>
      </section>
    </div>

    <footer class="flex justify-between px-2 py-2 skeleton-box"></footer>
  </article>
</template>

<script>
export default {
  name: 'SkeletonBox',
};
</script>

<style></style>
