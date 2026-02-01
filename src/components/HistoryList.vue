<script setup lang="ts">
import { computed } from 'vue'
import { useDepositsStore } from '../store/deposits'
import { formatBRL, formatDateBR } from '../utils/format'

const store = useDepositsStore()

const items = computed(() =>
  store.deposits
    .filter(d => d.done)
    .slice()
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
)
</script>

<template>
  <section class="card">
    <div class="row" style="justify-content: space-between;">
      <div style="font-weight: 900;">Histórico</div>
      <div class="muted" style="font-size: 12px;">{{ items.length }} depósitos registrados</div>
    </div>

    <div v-if="!items.length" class="muted" style="margin-top: 10px;">
      Ainda não há depósitos registrados.
    </div>

    <div v-else style="margin-top: 10px; display: grid; gap: 10px;">
      <div v-for="d in items" :key="d.id" class="box" style="border: 1px solid var(--border); border-radius: 12px; padding: 10px; background: rgba(255,255,255,.03);">
        <div class="row" style="justify-content: space-between;">
          <div style="font-weight: 900;">Depósito #{{ d.id }}</div>
          <div class="muted" style="font-size: 12px;">{{ d.date ? formatDateBR(d.date) : '—' }}</div>
        </div>
        <div style="margin-top: 6px; font-weight: 800;">{{ formatBRL(d.amount ?? 0) }}</div>
        <div v-if="d.note" class="muted" style="margin-top: 6px;">{{ d.note }}</div>
      </div>
    </div>

    <div class="muted" style="margin-top: 12px; font-size: 12px;">
      Dica: para editar/desfazer um depósito, clique no número dele na planilha (aba “Planilha”).
    </div>
  </section>
</template>
