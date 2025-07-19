<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useDashboard, LoadingStatus, type ChainConfig } from '@/stores/useDashboard';
import ChainSummary from '@/components/ChainSummary.vue';
import AdBanner from '@/components/ad/AdBanner.vue';

import { computed, ref } from 'vue';
import { useBlockchain } from '@/stores';

const dashboard = useDashboard();

const keywords = ref('');
const chains = computed(() => {
  if (keywords.value) {
    const lowercaseKeywords = keywords.value.toLowerCase();
    return Object.values(dashboard.chains).filter(
      (x: ChainConfig) =>
        x.chainName.toLowerCase().includes(lowercaseKeywords) ||
        x.prettyName.toLowerCase().includes(lowercaseKeywords)
    );
  } else {
    return Object.values(dashboard.chains);
  }
});

const featured = computed(() => {
  const names = ['cosmos', 'osmosis', 'akash', 'celestia', 'evmos', 'injective', 'dydx', 'noble'];
  return chains.value
    .filter((x) => names.includes(x.chainName))
    .sort((a, b) => names.indexOf(a.chainName) - names.indexOf(b.chainName));
});

const chainStore = useBlockchain();
</script>

<template>
  <div>
    <!-- Logo & Judul -->
    <div class="flex md:flex-row flex-col items-center justify-center mb-6 mt-14 gap-2">
      <img src="/logo.jpg" alt="Logo" class="w-12 h-12 rounded-full shadow-md" />
      <h1 class="text-primary dark:invert text-3xl md:text-6xl font-bold">
        Pilex3173 Dashboard
      </h1>
    </div>

    <!-- Slogan -->
    <div class="text-center text-base">
      <p class="mb-1">Trusted Validator And Powerful Uptime</p>
    </div>

    <!-- Loading -->
    <div v-if="dashboard.status !== LoadingStatus.Loaded" class="flex justify-center">
      <progress class="progress progress-info w-80 h-1"></progress>
    </div>

    <!-- Featured Chains -->
    <div v-if="featured.length > 0" class="text-center text-base mt-6 text-primary">
      <h2 class="mb-6">Featured Blockchains 🔥</h2>
    </div>

    <div
      v-if="featured.length > 0"
      class="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
    >
      <ChainSummary
        v-for="(chain, index) in featured"
        :key="index"
        :name="chain.chainName"
      />
    </div>

    <!-- Deskripsi -->
    <div class="text-center text-base mt-6 text-primary">
      <h2 class="mb-6">Explore and monitor your favorite testnets and validators.</h2>
    </div>

    <!-- Search -->
    <div class="flex items-center rounded-lg bg-base-100 border border-gray-200 dark:border-gray-700 mt-10">
      <Icon icon="mdi:magnify" class="text-2xl text-gray-400 ml-3" />
      <input
        v-model="keywords"
        :placeholder="'Search for a chain...'"
        class="px-4 h-10 bg-transparent flex-1 outline-none text-base"
      />
      <div class="px-4 text-base hidden md:block">
        {{ chains.length }}/{{ dashboard.length }}
      </div>
    </div>

    <!-- All Chains -->
    <div class="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      <ChainSummary
        v-for="(chain, index) in chains"
        :key="index"
        :name="chain.chainName"
      />
    </div>
  </div>
</template>

<style scoped>
.logo path {
  fill: #171d30;
}
</style>
