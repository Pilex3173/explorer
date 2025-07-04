<script lang="ts" setup>
import { isBech32Address } from '@/libs/utils';
import { useBlockchain, useFormatter } from '@/stores';
import MdEditor from 'md-editor-v3';
import { computed, onMounted, ref } from 'vue';
import nameMatcha from '@leapwallet/name-matcha'; // ✅ pakai default export
import { fromBase64, toHex } from '@cosmjs/encoding';

const chainStore = useBlockchain()
const props = defineProps(['value']);
const format = useFormatter();

function isMD() {
  if (
    props.value &&
    (String(props.value).indexOf('\n') > -1 || String(props.value).indexOf('\\n') > -1)
  ) {
    return true;
  }
  return false;
}

function isAddress() {
  return isBech32Address(props.value) && String(props.value).indexOf('valoper1') === -1;
}

const toHexOutput = ref(false);

const text = computed(() => {
  if (!props.value) return "";
  const v = String(props.value);

  switch (true) {
    case v.length === 28 && v.endsWith("="): {
      return format.validator(v) || v;
    }
    case /^[1-9]\d{3}-\d{1,2}-\d{1,2}T\d{1,2}:\d{2}:\d{2}[.\d]*Z$/g.test(v): {
      return new Date(v).toLocaleString(navigator.language);
    }
    case toHexOutput.value:
      return toHex(fromBase64(v)).toUpperCase();
  }

  return v;
});

const names = ref([] as { name?: string | null; provider?: string }[]);

onMounted(() => {
  if (isAddress()) {
    nameMatcha.lookupAll(props.value).then((re: any) => {
      names.value = Object.keys(re).map(key => ({
        name: re[key],
        provider: key
      }));
    });
  }
});

const isConvertable = computed(() => {
  return String(props.value).endsWith('=') && props.value.length !== 28;
});
</script>

<template>
  <MdEditor
    v-if="isMD()"
    :model-value="format.multiLine(value)"
    previewOnly
    class="md-editor-recover"
  />
</template>

