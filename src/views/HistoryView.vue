<script setup lang="ts">
import { onMounted } from 'vue'
import HistoryList from '../components/HistoryList.vue'
import { useDepositsStore } from '../store/deposits'

const store = useDepositsStore()
onMounted(() => store.initFromStorage())
</script>

<template>
  <div style="display:grid; gap: 14px;">
    <HistoryList />
  </div>
</template>
