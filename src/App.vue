<template>
  <div id="app" class="app-shell">
    <header class="site-header">
      <div>
        <p class="eyebrow">Proyecto 1 - Catálogos temáticos</p>
        <h1>Jazz Collection</h1>
        <p class="subtitle">Catálogo de la mejor música jazz</p>
      </div>
      <div class="record-mark" aria-hidden="true">♪</div>
    </header>

    <nav class="main-nav" aria-label="Navegación principal">
      <router-link class="button button-primary" to="/album">Álbumes</router-link>
      <router-link class="button" to="/artist">Artistas</router-link>
      <router-link class="button" to="/subgenre">Subgéneros</router-link>
    </nav>

    <main class="site-main">
      <router-view></router-view>
    </main>

    <footer class="site-footer">
      <span>Proyecto académico - Servicios Web</span>
      <span>Vue + Cloudflare Workers + D1</span>
    </footer>
  </div>
</template>

<script>
export default {}
</script>
