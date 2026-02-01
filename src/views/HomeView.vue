<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardMetrics from '../components/DashboardMetrics.vue'
import DepositGrid from '../components/DepositGrid.vue'
import DepositModal from '../components/DepositModal.vue'
import Toast from '../components/Toast.vue'
import { useDepositsStore } from '../store/deposits'
import { todayISO } from '../utils/format'
import type { DepositItem } from '../types'

const store = useDepositsStore()

const modalOpen = ref(false)
const modalItem = ref<DepositItem | null>(null)
const modalMode = ref<'create' | 'view' | 'edit'>('create')

const toast = ref<string>('')

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2000)
}

onMounted(() => {
  store.initFromStorage()
  // Opcional: se quiser sugerir data inicial como hoje (sem forçar), mantenha vazio
  // Se preferir preencher automaticamente se estiver null:
  // if (!store.startDate) store.setStartDate(todayISO())
})

function openCell(id: number) {
  const item = store.deposits.find(d => d.id === id) || null
  if (!item) return
  modalItem.value = item
  modalMode.value = item.done ? 'view' : 'create'
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  modalItem.value = null
  modalMode.value = 'create'
}

function confirm(payload: { id: number; amount: number; date: string; note: string }) {
  store.confirmDeposit(payload.id, payload.amount, payload.date || todayISO(), payload.note)
  showToast('Depósito confirmado!')
  closeModal()
}

function update(payload: { id: number; amount: number; date: string; note: string }) {
  store.updateDeposit(payload.id, payload.amount, payload.date || todayISO(), payload.note)
  showToast('Depósito atualizado!')
  closeModal()
}

function undo(id: number) {
  if (!confirm('Deseja desfazer este depósito?')) return
  store.undoDeposit(id)
  showToast('Depósito desfeito.')
  closeModal()
}
</script>

<template>
  <div style="display:grid; gap: 14px;">
    <DashboardMetrics />

    <DepositGrid :deposits="store.deposits" :onCellClick="openCell" />

    <DepositModal
      :open="modalOpen"
      :item="modalItem"
      :mode="modalMode"
      @close="closeModal"
      @confirm="confirm"
      @update="update"
      @undo="undo"
      @setMode="(m) => (modalMode = m)"
    />

    <Toast v-if="toast" :message="toast" />
  </div>
</template>
