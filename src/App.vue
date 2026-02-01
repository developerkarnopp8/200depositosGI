<template>
  <div class="container">
    <header class="topbar">
      <div class="h1">DESAFIO DOS 200 DEPÓSITOS</div>
      <nav class="nav">
        <RouterLink to="/">Planilha</RouterLink>
        <RouterLink to="/historico">Histórico</RouterLink>
        <RouterLink to="/config">Config</RouterLink>
      </nav>
    </header>

    <main style="margin-top: 14px;">
      <RouterView />
    </main>
  </div>
</template>
