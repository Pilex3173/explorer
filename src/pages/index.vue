<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useDashboard, LoadingStatus } from '@/stores';
import type { ChainConfig } from '@/types/chaindata';
import ChainSummary from '@/components/ChainSummary.vue';

import { computed, ref } from 'vue';
import { useBlockchain } from '@/stores';

const dashboard = useDashboard();

const keywords = ref('');
const activeTab = ref('cosmos'); // 'cosmos' | 'evm-mainnet' | 'evm-testnet'

// Semua chains
const allChains = computed(() => Object.values(dashboard.chains) as ChainConfig[]);

// Filter berdasarkan tab aktif
const chainsByTab = computed(() => {
  const all = allChains.value;
  if (activeTab.value === 'evm-mainnet') {
    return all.filter((x: any) => x.network_type === 'evm-mainnet' || x.evm_chain_id);
  }
  if (activeTab.value === 'evm-testnet') {
    return all.filter((x: any) => x.network_type === 'evm-testnet');
  }
  // default: cosmos (bukan evm)
  return all.filter((x: any) => !x.evm_chain_id && x.network_type !== 'evm-mainnet' && x.network_type !== 'evm-testnet');
});

// Filter by search keyword
const chains = computed(() => {
  const list = chainsByTab.value;
  if (!keywords.value) return list;
  const kw = keywords.value.toLowerCase();
  return list.filter(
    (x: ChainConfig) =>
      x.chainName.toLowerCase().includes(kw) ||
      x.prettyName.toLowerCase().includes(kw)
  );
});

// Featured hanya untuk tab cosmos
const featured = computed(() => {
  if (activeTab.value !== 'cosmos') return [];
  const names = ['cosmos', 'osmosis', 'akash', 'celestia', 'evmos', 'injective', 'dydx', 'noble'];
  return chains.value
    .filter((x) => names.includes(x.chainName))
    .sort((a, b) => names.indexOf(a.chainName) - names.indexOf(b.chainName));
});

// Hitung jumlah per tab untuk badge
const cosmosCount = computed(() =>
  allChains.value.filter((x: any) => !x.evm_chain_id && x.network_type !== 'evm-mainnet' && x.network_type !== 'evm-testnet').length
);
const evmMainnetCount = computed(() =>
  allChains.value.filter((x: any) => x.network_type === 'evm-mainnet' || x.evm_chain_id).length
);
const evmTestnetCount = computed(() =>
  allChains.value.filter((x: any) => x.network_type === 'evm-testnet').length
);

const chainStore = useBlockchain();

function setTab(tab: string) {
  activeTab.value = tab;
  keywords.value = '';
}
</script>

<template>
  <div class="">
    <!-- Hero -->
    <div class="flex md:!flex-row flex-col items-center justify-center mb-6 mt-14 gap-2">
      <div class="w-16 rounded-full">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 150.000000 132.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,132.000000) scale(0.100000,-0.100000)"
            :fill="chainStore.current?.themeColor || '#6366f1'"
            class="dark:invert"
            stroke="none"
          >
            <path d="M500 1310 l-125 -5 -182 -315 c-100 -173 -182 -321 -182 -329 -1 -7 81 -159 181 -337 l183 -324 372 0 371 0 186 325 c102 179 186 330 186 337 0 7 -82 157 -182 335 l-183 323 -250 -2 c-137 -1 -306 -5 -375 -8z m588 -454 c61 -106 112 -197 112 -201 0 -4 -50 -95 -111 -201 l-112 -194 -231 0 -231 0 -105 181 c-58 100 -109 190 -114 200 -6 14 17 63 104 213 l112 196 232 0 231 0 113 -194z"/>
            <path d="M591 1001 l-54 -6 -87 -150 -88 -150 176 -3 c97 -1 181 -1 187 2 9 3 165 267 183 308 4 9 -233 7 -317 -1z"/>
            <path d="M872 824 l-90 -159 36 -66 c113 -201 147 -258 153 -251 8 8 179 302 179 307 0 2 -37 68 -83 147 -46 78 -88 151 -94 162 -9 16 -24 -5 -101 -140z"/>
            <path d="M360 625 c0 -7 148 -263 172 -297 l19 -28 186 0 c101 0 183 3 181 8 -1 4 -43 78 -93 165 l-90 157 -187 0 c-104 0 -188 -2 -188 -5z"/>
          </g>
        </svg>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <h1 class="text-primary dark:invert text-3xl md:!text-5xl font-bold tracking-tight">
          pilex<span style="-webkit-text-fill-color: #6366f1; color: #6366f1;">3173</span> explorer
        </h1>
        <p class="text-gray-400 text-sm mt-1">Multi-chain block explorer &amp; wallet</p>
      </div>
    </div>

    <!-- Loading bar -->
    <div v-if="dashboard.status !== LoadingStatus.Loaded" class="flex justify-center mb-4">
      <progress class="progress progress-info w-80 h-1"></progress>
    </div>

    <!-- Tab Bar -->
    <div class="flex items-center gap-2 mt-6 mb-4 flex-wrap">
      <!-- Cosmos Tab -->
      <button
        @click="setTab('cosmos')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
        :class="activeTab === 'cosmos'
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-base-100 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-400'"
      >
        <Icon icon="mdi:atom" class="text-base" />
        Cosmos
        <span
          class="text-xs px-1.5 py-0.5 rounded-full"
          :class="activeTab === 'cosmos' ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
        >{{ cosmosCount }}</span>
      </button>

      <!-- EVM Mainnet Tab -->
      <button
        @click="setTab('evm-mainnet')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
        :class="activeTab === 'evm-mainnet'
          ? 'bg-purple-600 text-white border-purple-600'
          : 'bg-base-100 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-purple-400'"
      >
        <Icon icon="mdi:ethereum" class="text-base" />
        EVM Mainnet
        <span
          class="text-xs px-1.5 py-0.5 rounded-full"
          :class="activeTab === 'evm-mainnet' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
        >{{ evmMainnetCount }}</span>
      </button>

      <!-- EVM Testnet Tab -->
      <button
        @click="setTab('evm-testnet')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
        :class="activeTab === 'evm-testnet'
          ? 'bg-amber-500 text-white border-amber-500'
          : 'bg-base-100 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-amber-400'"
      >
        <Icon icon="mdi:flask-outline" class="text-base" />
        EVM Testnet
        <span
          class="text-xs px-1.5 py-0.5 rounded-full"
          :class="activeTab === 'evm-testnet' ? 'bg-amber-400 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
        >{{ evmTestnetCount }}</span>
      </button>
    </div>

    <!-- EVM Notice Banner -->
    <div
      v-if="activeTab !== 'cosmos'"
      class="flex items-start gap-3 p-4 rounded-lg mb-4 border"
      :class="activeTab === 'evm-mainnet'
        ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800'
        : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'"
    >
      <Icon
        icon="mdi:information-outline"
        class="text-xl flex-shrink-0 mt-0.5"
        :class="activeTab === 'evm-mainnet' ? 'text-purple-500' : 'text-amber-500'"
      />
      <div class="text-sm" :class="activeTab === 'evm-mainnet' ? 'text-purple-700 dark:text-purple-300' : 'text-amber-700 dark:text-amber-300'">
        <span class="font-medium">{{ activeTab === 'evm-mainnet' ? 'EVM Mainnet' : 'EVM Testnet' }}</span>
        — Explorer mode untuk EVM chain. Beberapa fitur Cosmos (staking, governance) tidak tersedia.
      </div>
    </div>

    <!-- Featured (Cosmos only) -->
    <div v-if="featured.length > 0" class="text-center text-base mt-2 text-primary">
      <h2 class="mb-4 font-medium">Featured Blockchains 🔥</h2>
    </div>
    <div
      v-if="featured.length > 0"
      class="grid grid-cols-1 gap-4 mb-8 md:!grid-cols-3 lg:!grid-cols-4 2xl:!grid-cols-5"
    >
      <ChainSummary v-for="(chain, index) in featured" :key="index" :name="chain.chainName" />
    </div>

    <!-- Section title -->
    <div class="flex items-center justify-between mt-2 mb-2">
      <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        <span v-if="activeTab === 'cosmos'">All Cosmos Chains</span>
        <span v-else-if="activeTab === 'evm-mainnet'">EVM Mainnets</span>
        <span v-else>EVM Testnets</span>
      </h2>
    </div>

    <!-- Search bar -->
    <div class="flex items-center rounded-lg bg-base-100 border border-gray-200 dark:border-gray-700 mb-4">
      <Icon icon="mdi:magnify" class="text-2xl text-gray-400 ml-3" />
      <input
        :placeholder="activeTab === 'cosmos' ? 'Cari chain Cosmos...' : activeTab === 'evm-mainnet' ? 'Cari EVM mainnet...' : 'Cari EVM testnet...'"
        class="px-4 h-10 bg-transparent flex-1 outline-none text-base"
        v-model="keywords"
      />
      <div class="px-4 text-base hidden md:!block text-gray-400">
        {{ chains.length }} chains
      </div>
    </div>

    <!-- Chain Grid -->
    <div
      v-if="chains.length > 0"
      class="grid grid-cols-1 gap-4 md:!grid-cols-3 lg:!grid-cols-4 2xl:!grid-cols-5"
    >
      <ChainSummary v-for="(chain, index) in chains" :key="index" :name="chain.chainName" />
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon icon="mdi:cloud-off-outline" class="text-5xl mb-3" />
      <p class="text-base">
        <span v-if="keywords">Tidak ada chain yang cocok dengan "{{ keywords }}"</span>
        <span v-else-if="activeTab === 'evm-mainnet'">Belum ada EVM mainnet — tambahkan JSON di <code class="text-indigo-400">chains/mainnet/</code></span>
        <span v-else-if="activeTab === 'evm-testnet'">Belum ada EVM testnet — tambahkan JSON di <code class="text-indigo-400">chains/testnet/</code></span>
        <span v-else>Belum ada chain</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.logo path {
  fill: #171d30;
}
</style>
