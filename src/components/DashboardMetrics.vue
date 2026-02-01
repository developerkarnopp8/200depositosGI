<script setup lang="ts">
import { computed } from 'vue'
import { useDepositsStore } from '../store/deposits'
import { formatBRL, formatDateBR, clamp } from '../utils/format'

const store = useDepositsStore()

const progressWidth = computed(() => `${clamp(store.percent, 0, 100)}%`)
const forecastText = computed(() => {
  const f = store.completionForecast
  if (!f.possible) return `Previsão: ${f.reason}`
  return `Previsão de conclusão: ${formatDateBR(f.etaISO!)} (aprox.)`
})
</script>

<template>
  <section class="card">
    <div class="row" style="justify-content: space-between; gap: 14px;">
      <div>
        <div class="muted" style="font-size: 12px;">Data inicial</div>
        <div style="display:flex; gap:10px; align-items:center; margin-top: 6px;">
          <input class="input" type="date" :value="store.startDate ?? ''" @change="store.setStartDate(($event.target as HTMLInputElement).value || null)" style="max-width: 220px;" />
          <span class="muted" style="font-size:12px;">(igual no papel: define o início do desafio)</span>
        </div>
      </div>
      <div style="min-width: 240px;">
        <div class="muted" style="font-size: 12px;">Progresso</div>
        <div style="display:flex; justify-content:space-between; margin-top: 6px;">
          <div style="font-weight:900;">{{ store.completedCount }}/200</div>
          <div class="muted">{{ store.percent }}%</div>
        </div>
        <div class="progress" style="margin-top: 8px;">
          <div :style="{ width: progressWidth }"></div>
        </div>
      </div>
    </div>

    <div style="height: 12px;"></div>

    <div class="kpi">
      <div class="box">
        <div class="label">Feitos</div>
        <div class="value">{{ store.completedCount }}</div>
      </div>
      <div class="box">
        <div class="label">Faltam</div>
        <div class="value">{{ store.remainingCount }}</div>
      </div>
      <div class="box">
        <div class="label">Total depositado</div>
        <div class="value">{{ formatBRL(store.totalAmount) }}</div>
      </div>
      <div class="box">
        <div class="label">Média por depósito</div>
        <div class="value">{{ store.completedCount ? formatBRL(store.avgAmount) : '—' }}</div>
      </div>
      <div class="box">
        <div class="label">Menor depósito</div>
        <div class="value">{{ store.minAmount == null ? '—' : formatBRL(store.minAmount) }}</div>
      </div>
      <div class="box">
        <div class="label">Maior depósito</div>
        <div class="value">{{ store.maxAmount == null ? '—' : formatBRL(store.maxAmount) }}</div>
      </div>
    </div>

    <div class="muted" style="margin-top: 10px; font-size: 12px;">
      {{ forecastText }}
    </div>
  </section>
</template>
