<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DepositItem } from '../types'
import { formatBRL, todayISO } from '../utils/format'

const props = defineProps<{
  open: boolean
  item: DepositItem | null
  mode: 'create' | 'view' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', payload: { id: number; amount: number; date: string; note: string }): void
  (e: 'update', payload: { id: number; amount: number; date: string; note: string }): void
  (e: 'undo', id: number): void
  (e: 'setMode', mode: 'create' | 'view' | 'edit'): void
}>()

const amount = ref<string>('')
const date = ref<string>(todayISO())
const note = ref<string>('')

const title = computed(() => {
  if (!props.item) return ''
  if (props.mode === 'create') return `Registrar depósito #${props.item.id}`
  if (props.mode === 'edit') return `Editar depósito #${props.item.id}`
  return `Depósito #${props.item.id}`
})

watch(() => [props.open, props.item, props.mode], () => {
  if (!props.open || !props.item) return
  if (props.item.done) {
    amount.value = String(props.item.amount ?? '')
    date.value = props.item.date ?? todayISO()
    note.value = props.item.note ?? ''
  } else {
    amount.value = ''
    date.value = todayISO()
    note.value = ''
  }
}, { immediate: true })

function parseAmount(value: string): number {
  // Accept "10", "10.5", "10,5"
  const normalized = value.replace(',', '.')
  const n = Number(normalized)
  return n
}

function onConfirm() {
  if (!props.item) return
  const n = parseAmount(amount.value)
  if (!(n > 0)) return alert('Informe um valor válido (> 0).')
  if (!date.value) return alert('Informe uma data válida.')
  emit('confirm', { id: props.item.id, amount: n, date: date.value, note: note.value })
}

function onUpdate() {
  if (!props.item) return
  const n = parseAmount(amount.value)
  if (!(n > 0)) return alert('Informe um valor válido (> 0).')
  if (!date.value) return alert('Informe uma data válida.')
  emit('update', { id: props.item.id, amount: n, date: date.value, note: note.value })
}
</script>

<template>
  <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <h2>{{ title }}</h2>
      <div v-if="item" class="muted" style="font-size: 12px; margin-bottom: 12px;">
        <template v-if="mode === 'create'">
          Marque como concluído preenchendo valor e data.
        </template>
        <template v-else>
          Visualize, edite ou desfaça o registro deste depósito.
        </template>
      </div>

      <div class="row" style="gap: 10px;">
        <div style="flex: 1; min-width: 180px;">
          <div class="muted" style="font-size:12px;">Valor (R$)</div>
          <input class="input" :disabled="mode==='view'" inputmode="decimal" placeholder="Ex: 50,00" v-model="amount" />
          <div class="muted" style="font-size:12px; margin-top: 6px;" v-if="mode!=='create' && item?.done && amount">
            Prévia: {{ formatBRL(Number(amount.replace(',', '.')) || 0) }}
          </div>
        </div>

        <div style="width: 180px;">
          <div class="muted" style="font-size:12px;">Data</div>
          <input class="input" type="date" :disabled="mode==='view'" v-model="date" />
        </div>
      </div>

      <div style="margin-top: 10px;">
        <div class="muted" style="font-size:12px;">Observação (opcional)</div>
        <textarea class="textarea" :disabled="mode==='view'" v-model="note" placeholder="Ex: depósito extra / salário / etc."></textarea>
      </div>

      <div class="actions">
        <button class="btn" @click="emit('close')">Fechar</button>

        <template v-if="mode === 'create'">
          <button class="btn primary" @click="onConfirm">Confirmar depósito</button>
        </template>

        <template v-else-if="mode === 'view'">
          <button class="btn primary" @click="emit('setMode','edit')">Editar</button>
          <button class="btn danger" @click="emit('undo', item!.id)">Desfazer depósito</button>
        </template>

        <template v-else-if="mode === 'edit'">
          <button class="btn primary" @click="onUpdate">Salvar alterações</button>
        </template>
      </div>
    </div>
  </div>
</template>
