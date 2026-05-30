<script lang="ts" setup>
import { useDashboard } from '@/stores';
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const dashboardStore = useDashboard();
const conf = computed(() => dashboardStore.chains[props.name] || {});

const isEvm = computed(() =>
  (conf.value as any).networkType === 'evm-mainnet' ||
  (conf.value as any).networkType === 'evm-testnet'
);

const explorerUrl = computed(() => (conf.value as any).explorerUrl || '');

const addFavor = (e: Event) => {
  e.stopPropagation();
  e.preventDefault();
  dashboardStore.favoriteMap[props.name] = !dashboardStore?.favoriteMap?.[props.name];
  window.localStorage.setItem('favoriteMap', JSON.stringify(dashboardStore.favoriteMap));
};

const openExplorer = (e: Event) => {
  e.stopPropagation();
  e.preventDefault();
  if (explorerUrl.value) {
    window.open(explorerUrl.value, '_blank');
  }
};
</script>

<template>
  <RouterLink
    :to="`/${name}`"
    class="bg-base-100 hover:bg-gray-100 dark:hover:bg-[#373f59] rounded shadow flex items-center px-3 py-3 cursor-pointer group"
  >
    <!-- Chain Logo -->
    <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
      <img :src="conf.logo" class="w-full h-full object-cover" />
    </div>

    <!-- Chain Name + Badge -->
    <div class="ml-3 flex-1 min-w-0">
      <div class="font-semibold text-base truncate capitalize">
        {{ conf?.prettyName || props.name }}
      </div>
      <div class="flex items-center gap-1 mt-0.5">
        <!-- EVM Badge -->
        <span
          v-if="isEvm"
          class="text-[10px] px-1.5 py-0.5 rounded font-semibold"
          :class="(conf as any).networkType === 'evm-mainnet'
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'
            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'"
        >
          {{ (conf as any).networkType === 'evm-mainnet' ? 'EVM' : 'EVM Testnet' }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 ml-2 flex-shrink-0">
      <!-- Open External Explorer button (EVM only) -->
      <button
        v-if="isEvm && explorerUrl"
        @click="openExplorer"
        class="p-1.5 rounded text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        title="Open official block explorer"
      >
        <Icon icon="mdi:open-in-new" class="text-base" />
      </button>

      <!-- Favorite star -->
      <div
        @click="addFavor"
        class="p-1.5 rounded text-xl transition-colors"
        :class="{
          'text-warning': dashboardStore?.favoriteMap?.[props.name],
          'text-gray-300 dark:text-gray-500 hover:text-warning': !dashboardStore?.favoriteMap?.[props.name],
        }"
      >
        <Icon icon="mdi-star" />
      </div>
    </div>
  </RouterLink>
</template>
