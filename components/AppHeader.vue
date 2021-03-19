<template>
  <header>
    <div id="nav" class="bg-gray-800 shadow">
      <div class="md:px-8">
        <nav class="relative flex flex-wrap items-center justify-between md:py-4">
          <div
            class="relative z-10 flex content-center justify-center flex-shrink-0 py-4 pl-4 md:p-0"
          >
            <a href="/" class="font-bold leading-none text-white">
              <span class="inline-flex items-center">
                <svg
                  class="w-6 h-6 mr-1 text-white fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.09 11h4.86c-.16-1.61-.71-3.11-1.54-4.4-1.73.83-2.99 2.45-3.32 4.4zM6.91 11c-.33-1.95-1.59-3.57-3.32-4.4-.83 1.29-1.38 2.79-1.54 4.4h4.86zM15.07 11c.32-2.59 1.88-4.79 4.06-6-1.6-1.63-3.74-2.71-6.13-2.95V11h2.07zM8.93 11H11V2.05C8.61 2.29 6.46 3.37 4.87 5c2.18 1.21 3.74 3.41 4.06 6zM15.07 13H13v8.95c2.39-.24 4.54-1.32 6.13-2.95-2.18-1.21-3.74-3.41-4.06-6zM3.59 17.4c1.72-.83 2.99-2.46 3.32-4.4H2.05c.16 1.61.71 3.11 1.54 4.4zM17.09 13c.33 1.95 1.59 3.57 3.32 4.4.83-1.29 1.38-2.79 1.54-4.4h-4.86zM8.93 13c-.32 2.59-1.88 4.79-4.06 6 1.6 1.63 3.74 2.71 6.13 2.95V13H8.93z"
                  />
                </svg>
                <span>SteeleHoops</span>
              </span>
            </a>
          </div>
          <div class="flex-shrink-0 pr-4">
            <button
              ref="openButton"
              @click="open"
              type="button"
              class="block text-gray-100 focus:outline-none hover:text-gray-400 focus:text-gray-100"
              aria-label="Menu"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6Z"
                />
                <path
                  d="M3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12Z"
                />
                <path
                  d="M4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H4Z"
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      <div v-show="isOpen" class="">
        <!-- Off-canvas menu background overlay -->
        <transition
          enter-class="opacity-0"
          enter-active-class="ease-out transition-medium"
          enter-to-class="opacity-100"
          leave-class="opacity-100"
          leave-active-class="ease-out transition-medium"
          leave-to-class="opacity-0"
          appear
        >
          <div v-show="isOpen" class="fixed inset-0 z-10 transition-opacity">
            <div @click="close" class="absolute inset-0 bg-black opacity-50" tabindex="-1"></div>
          </div>
        </transition>

        <!-- Off-canvas menu -->
        <transition
          enter-class="translate-x-full"
          enter-active-class="ease-out transition-slow"
          enter-to-class="translate-x-0"
          leave-class="translate-x-0"
          leave-active-class="ease-in transition-medium"
          leave-to-class="translate-x-full"
          appear
        >
          <div
            v-show="isOpen"
            class="fixed inset-y-0 right-0 z-10 w-full max-w-xs overflow-y-auto transition-transform bg-white"
          >
            <div class="relative z-10 bg-white">
              <div :class="isOpen ? 'block' : 'hidden'" class="absolute top-0 right-0 p-4">
                <button
                  ref="closeButton"
                  @click="close"
                  type="button"
                  class="text-gray-600 focus:outline-none focus:text-gray-900"
                  aria-label="Close"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L13.4142 12L19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L12 10.5858L5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L10.5858 12L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L12 13.4142L18.2929 19.7071Z"
                    />
                  </svg>
                </button>
              </div>
              <div class="px-4 pt-4 pb-6">
                <fieldset class="mt-8">
                  <legend
                    class="block mb-4 text-xs font-semibold tracking-wider text-gray-600 uppercase"
                  >
                    Games Sort
                  </legend>
                  <div>
                    <label class="block font-medium text-gray-500 cursor-pointer">
                      <input
                        class="mr-2 leading-tight"
                        type="radio"
                        name="sortType"
                        value="shFactor"
                        v-model="sortType"
                      />
                      <span class="text-xs font-medium text-gray-900 hover:text-gray-700"
                        >SHFactor</span
                      >
                    </label>
                  </div>
                  <div>
                    <label class="block mt-2 font-medium text-gray-500 cursor-pointer">
                      <input
                        class="mr-2 leading-tight"
                        type="radio"
                        name="sortType"
                        value="totalDiff"
                        v-model="sortType"
                      />
                      <span class="text-xs font-medium text-gray-900 hover:text-gray-700"
                        >Total Diff</span
                      >
                    </label>
                  </div>
                  <div>
                    <label class="block mt-2 font-medium text-gray-500 cursor-pointer">
                      <input
                        class="mr-2 leading-tight"
                        type="radio"
                        name="sortType"
                        value="lineDiff"
                        v-model="sortType"
                      />
                      <span class="text-xs font-medium text-gray-900 hover:text-gray-700"
                        >Line Diff</span
                      >
                    </label>
                  </div>
                  <div>
                    <label class="block mt-2 font-medium text-gray-500 cursor-pointer">
                      <input
                        class="mr-2 leading-tight"
                        type="radio"
                        name="sortType"
                        value="kpDiff"
                        v-model="sortType"
                      />
                      <span class="text-xs font-medium text-gray-900 hover:text-gray-700"
                        >KenPom Diff</span
                      >
                    </label>
                  </div>
                  <div>
                    <label class="block mt-2 font-medium text-gray-500 cursor-pointer">
                      <input
                        class="mr-2 leading-tight"
                        type="radio"
                        name="sortType"
                        value="winPerc"
                        v-model="sortType"
                      />
                      <span class="text-xs font-medium text-gray-900 hover:text-gray-700"
                        >Win%</span
                      >
                    </label>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AppHeader',
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    sortType: {
      get() {
        return this.$store.state.games.sortType;
      },
      set(type) {
        this.$store.commit('games/setSortType', { sortType: type });
      },
    },
  },
  methods: {
    open() {
      this.isOpen = true;
      this.$nextTick(() => {
        this.$refs.closeButton.focus();
      });
    },
    close() {
      this.isOpen = false;
      this.$nextTick(() => {
        this.$refs.openButton.focus();
      });
    },
  },
};
</script>

<style>
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
.transition-transform {
  transition-property: transform;
}
.transition-opacity {
  transition-property: opacity;
}
.transition-medium {
  transition-duration: 0.2s;
}
.translate-x-full {
  transform: translateX(100%);
}
.translate-x-0 {
  transform: translateX(0);
}
.transition-slow {
  transition-duration: 0.3s;
}
</style>
