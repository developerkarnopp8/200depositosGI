<script setup lang="ts">
import type { DepositItem } from '../types'

defineProps<{
  item: DepositItem
  onClick: (id: number) => void
}>()
</script>

<template>
  <div class="cell" :class="{ done: item.done }" @click="onClick(item.id)" :title="item.done ? 'Concluído (clique para ver/editar)' : 'Pendente (clique para registrar)'">
    {{ item.id }}
  </div>
</template>
