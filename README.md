# Desafio dos 200 Depósitos (Vue 3)

Checklist/planilha visual de 200 depósitos (1..200) com métricas, histórico, export/import e persistência via `localStorage`.

## Requisitos
- Node.js 18+ (recomendado 20+)
- npm

## Rodar local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Principais features
- Grade 10x20 (200 células)
- Marcar/editar/desfazer depósito com valor, data e observação
- Dashboard: feitos, faltam, %, total, média, min/max, barra de progresso
- Previsão de conclusão baseada no ritmo (quando possível)
- Histórico em lista
- Exportar/Importar JSON
- Reset com confirmação digitada

## Persistência
O estado é salvo automaticamente no localStorage (chave: `desafio-200-depositos:v1`).
