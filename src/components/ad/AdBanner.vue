<script lang="ts" setup>
import { computed } from 'vue';

// Cek hostname hanya jika berjalan di browser
const aa = computed(() => {
  if (typeof window === 'undefined') return '2396360'; // fallback saat SSR

  const hostname = window.location.hostname;

  // Tentukan ID berdasarkan domain
  switch (hostname) {
    case 'ping.pub':
      return '2395639';
    case 'testnet.ping.pub':
      return '2396360';
    default:
      return '2396360';
  }
});
</script>

<template>
  <!-- Gunakan nilai aa di sini jika diperlukan -->
  <div>
    ID: {{ aa }}
  </div>
</template>

