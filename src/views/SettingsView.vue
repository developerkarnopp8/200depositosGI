<script setup lang="ts">
import { onMounted } from 'vue'
import ExportImportPanel from '../components/ExportImportPanel.vue'
import { useDepositsStore } from '../store/deposits'

const store = useDepositsStore()
onMounted(() => store.initFromStorage())
</script>

<template>
  <div style="display:grid; gap: 14px;">
    <ExportImportPanel />
  </div>
</template>
