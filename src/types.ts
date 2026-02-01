export type ISODateString = string // e.g. "2026-01-29"

export interface DepositItem {
  id: number // 1..200
  done: boolean
  amount?: number
  date?: ISODateString
  note?: string
}

export interface AppState {
  startDate: ISODateString | null
  deposits: DepositItem[]
}
