<script setup lang="ts">
import DepositCell from './DepositCell.vue'
import type { DepositItem } from '../types'

defineProps<{
  deposits: DepositItem[]
  onCellClick: (id: number) => void
}>()
</script>

<template>
  <section class="card">
    <div class="grid" aria-label="Grade de depósitos (1 a 200)">
      <DepositCell
        v-for="d in deposits"
        :key="d.id"
        :item="d"
        :onClick="onCellClick"
      />
    </div>
  </section>
</template>
