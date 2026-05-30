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
</script>

<template>
  <!-- EVM chain: klik seluruh box buka explorer resmi di tab baru -->
  <a
    v-if="isEvm && explorerUrl"
    :href="explorerUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="bg-base-100 hover:bg-gray-100 dark:hover:bg-[#373f59] rounded shadow flex items-center px-3 py-3 cursor-pointer"
  >
    <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
      <img :src="conf.logo" class="w-full h-full object-cover" />
    </div>
    <div class="ml-3 flex-1 min-w-0">
      <div class="font-semibold text-base truncate capitalize">
        {{ conf?.prettyName || props.name }}
      </div>
      <div class="flex items-center gap-1 mt-0.5">
        <span
          class="text-[10px] px-1.5 py-0.5 rounded font-semibold"
          :class="(conf as any).networkType === 'evm-mainnet'
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'
            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'"
        >
          {{ (conf as any).networkType === 'evm-mainnet' ? 'EVM' : 'EVM Testnet' }}
        </span>
        <span class="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
          <Icon icon="mdi:open-in-new" class="text-xs" />
          explorer
        </span>
      </div>
    </div>
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
  </a>

  <!-- EVM chain tanpa explorerUrl: fallback ke halaman internal -->
  <RouterLink
    v-else-if="isEvm && !explorerUrl"
    :to="`/${name}`"
    class="bg-base-100 hover:bg-gray-100 dark:hover:bg-[#373f59] rounded shadow flex items-center px-3 py-3 cursor-pointer"
  >
    <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
      <img :src="conf.logo" class="w-full h-full object-cover" />
    </div>
    <div class="ml-3 flex-1 min-w-0">
      <div class="font-semibold text-base truncate capitalize">
        {{ conf?.prettyName || props.name }}
      </div>
      <div class="flex items-center gap-1 mt-0.5">
        <span class="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
          EVM
        </span>
      </div>
    </div>
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
  </RouterLink>

  <!-- Cosmos chain: RouterLink biasa ke halaman internal -->
  <RouterLink
    v-else
    :to="`/${name}`"
    class="bg-base-100 hover:bg-gray-100 dark:hover:bg-[#373f59] rounded shadow flex items-center px-3 py-3 cursor-pointer"
  >
    <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
      <img :src="conf.logo" class="w-full h-full object-cover" />
    </div>
    <div class="font-semibold ml-4 text-base flex-1 truncate capitalize">
      {{ conf?.prettyName || props.name }}
    </div>
    <div
      @click="addFavor"
      class="pl-4 text-xl"
      :class="{
        'text-warning': dashboardStore?.favoriteMap?.[props.name],
        'text-gray-300 dark:text-gray-500': !dashboardStore?.favoriteMap?.[props.name],
      }"
    >
      <Icon icon="mdi-star" />
    </div>
  </RouterLink>
</template>
