<script setup lang="ts">
import { ref } from 'vue'
import { useDepositsStore } from '../store/deposits'

const store = useDepositsStore()
const resetText = ref('')
const importError = ref<string | null>(null)

function download(filename: string, text: string) {
  const a = document.createElement('a')
  const blob = new Blob([text], { type: 'application/json' })
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

function onExport() {
  const json = store.exportJSON()
  const now = new Date()
  const stamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  download(`desafio-200-depositos_${stamp}.json`, json)
}

async function onImport(e: Event) {
  importError.value = null
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const text = await file.text()
  try {
    store.importJSON(text)
  } catch (err: any) {
    importError.value = err?.message ?? 'Falha ao importar'
  } finally {
    input.value = ''
  }
}

function onReset() {
  if (resetText.value.trim() !== 'RESETAR') {
    alert('Digite RESETAR para confirmar.')
    return
  }
  store.resetAll()
  resetText.value = ''
  alert('Desafio resetado.')
}
</script>

<template>
  <section class="card">
    <div style="font-weight: 900;">Exportar / Importar / Reset</div>
    <div class="muted" style="font-size: 12px; margin-top: 6px;">
      Exportação gera um JSON com todo o estado. Importação restaura esse estado.
    </div>

    <div class="row" style="margin-top: 12px;">
      <button class="btn primary" @click="onExport">Exportar JSON</button>

      <label class="btn" style="display:inline-flex; align-items:center; gap: 10px;">
        Importar JSON
        <input type="file" accept="application/json" style="display:none" @change="onImport" />
      </label>
    </div>

    <div v-if="importError" class="muted" style="margin-top: 10px; color: #fca5a5;">
      {{ importError }}
    </div>

    <div style="height: 12px;"></div>
    <div style="border-top: 1px solid var(--border); padding-top: 12px;">
      <div style="font-weight: 900;">Reset seguro</div>
      <div class="muted" style="font-size: 12px; margin-top: 6px;">
        Para evitar acidente, você precisa digitar <b>RESETAR</b> antes de limpar tudo.
      </div>

      <div class="row" style="margin-top: 10px; align-items: end;">
        <div style="flex: 1; min-width: 220px;">
          <div class="muted" style="font-size: 12px;">Digite RESETAR</div>
          <input class="input" v-model="resetText" placeholder="RESETAR" />
        </div>
        <button class="btn danger" @click="onReset">Resetar desafio</button>
      </div>
    </div>
  </section>
</template>
