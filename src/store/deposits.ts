import { defineStore } from 'pinia'
import type { AppState, DepositItem } from '../types'
import { clamp } from '../utils/format'

const STORAGE_KEY = 'desafio-200-depositos:v1'

function createInitialDeposits(): DepositItem[] {
  return Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    done: false,
  }))
}

function safeParseJSON(raw: string): unknown | null {
  try { return JSON.parse(raw) } catch { return null }
}

function isValidISODate(s: unknown): s is string {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
}

function isValidDepositItem(obj: any): obj is DepositItem {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.id !== 'number' || obj.id < 1 || obj.id > 200) return false
  if (typeof obj.done !== 'boolean') return false
  if (obj.done) {
    if (typeof obj.amount !== 'number' || !(obj.amount > 0)) return false
    if (!isValidISODate(obj.date)) return false
    if (obj.note != null && typeof obj.note !== 'string') return false
  }
  return true
}

function isValidState(obj: any): obj is AppState {
  if (!obj || typeof obj !== 'object') return false
  if (obj.startDate !== null && !isValidISODate(obj.startDate)) return false
  if (!Array.isArray(obj.deposits) || obj.deposits.length !== 200) return false
  return obj.deposits.every(isValidDepositItem)
}

export const useDepositsStore = defineStore('deposits', {
  state: (): AppState => ({
    startDate: null,
    deposits: createInitialDeposits(),
  }),

  getters: {
    completedCount: (s) => s.deposits.filter(d => d.done).length,
    remainingCount(): number { return 200 - this.completedCount },
    percent(): number { return Number(((this.completedCount / 200) * 100).toFixed(1)) },
    totalAmount: (s) => s.deposits.reduce((sum, d) => sum + (d.done ? (d.amount ?? 0) : 0), 0),
    avgAmount(): number {
      return this.completedCount > 0 ? this.totalAmount / this.completedCount : 0
    },
    minAmount(): number | null {
      const vals = this.deposits.filter(d => d.done).map(d => d.amount ?? 0)
      if (!vals.length) return null
      return Math.min(...vals)
    },
    maxAmount(): number | null {
      const vals = this.deposits.filter(d => d.done).map(d => d.amount ?? 0)
      if (!vals.length) return null
      return Math.max(...vals)
    },

    // Forecast: deposits/day based on dates, then estimate finish date.
    completionForecast(): { possible: boolean; depositsPerDay?: number; etaISO?: string; reason?: string } {
      const done = this.deposits.filter(d => d.done && d.date)
      if (!this.startDate) return { possible: false, reason: 'Defina a data inicial.' }
      if (done.length < 2) return { possible: false, reason: 'Registre pelo menos 2 depósitos com data.' }

      const dates = done.map(d => d.date as string).sort()
      const first = dates[0]
      const last = dates[dates.length - 1]

      const start = new Date(first + 'T00:00:00Z')
      const end = new Date(last + 'T00:00:00Z')
      const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
      const depositsPerDay = done.length / diffDays

      if (!isFinite(depositsPerDay) || depositsPerDay <= 0) return { possible: false, reason: 'Dados insuficientes.' }

      const remaining = this.remainingCount
      const daysToFinish = Math.ceil(remaining / depositsPerDay)

      const eta = new Date((new Date(last + 'T00:00:00Z')).getTime() + daysToFinish * 24 * 60 * 60 * 1000)
      const y = eta.getUTCFullYear()
      const m = String(eta.getUTCMonth() + 1).padStart(2, '0')
      const d = String(eta.getUTCDate()).padStart(2, '0')
      const etaISO = `${y}-${m}-${d}`

      return { possible: true, depositsPerDay, etaISO }
    },
  },

  actions: {
    persist() {
      const payload: AppState = { startDate: this.startDate, deposits: this.deposits }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },

    initFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = safeParseJSON(raw)
      if (parsed && isValidState(parsed)) {
        this.startDate = parsed.startDate
        this.deposits = parsed.deposits
      }
    },

    setStartDate(dateISO: string | null) {
      this.startDate = dateISO
      this.persist()
    },

    confirmDeposit(id: number, amount: number, dateISO: string, note?: string) {
      if (!(amount > 0)) throw new Error('Valor inválido')
      const idx = this.deposits.findIndex(d => d.id === id)
      if (idx === -1) throw new Error('ID inválido')
      const current = this.deposits[idx]
      this.deposits[idx] = { ...current, done: true, amount, date: dateISO, note: note?.trim() || '' }
      this.persist()
    },

    updateDeposit(id: number, amount: number, dateISO: string, note?: string) {
      if (!(amount > 0)) throw new Error('Valor inválido')
      const idx = this.deposits.findIndex(d => d.id === id)
      if (idx === -1) throw new Error('ID inválido')
      const current = this.deposits[idx]
      if (!current.done) throw new Error('Depósito não está concluído')
      this.deposits[idx] = { ...current, amount, date: dateISO, note: note?.trim() || '' }
      this.persist()
    },

    undoDeposit(id: number) {
      const idx = this.deposits.findIndex(d => d.id === id)
      if (idx === -1) throw new Error('ID inválido')
      this.deposits[idx] = { id, done: false }
      this.persist()
    },

    resetAll() {
      this.startDate = null
      this.deposits = createInitialDeposits()
      localStorage.removeItem(STORAGE_KEY)
    },

    exportJSON(): string {
      const payload: AppState = { startDate: this.startDate, deposits: this.deposits }
      return JSON.stringify(payload, null, 2)
    },

    importJSON(raw: string) {
      const parsed = safeParseJSON(raw)
      if (!parsed || !isValidState(parsed)) throw new Error('Arquivo inválido')
      this.startDate = parsed.startDate
      this.deposits = parsed.deposits
      this.persist()
    },
  },
})
