<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="eyebrow">Entidad principal</p>
        <h2>Álbumes de jazz</h2>
        <p>Explore los 12 registros iniciales del catálogo.</p>
      </div>
      <router-link class="button button-primary" to="/album/create">Nuevo álbum</router-link>
    </div>

    <p v-if="error" class="message error">{{ error }}</p>
    <p v-if="loading" class="message">Cargando álbumes...</p>

    <div v-if="!loading" class="card-grid">
      <article v-for="album in albums" :key="album.id" class="catalog-card">
        <img class="catalog-image album-image" :src="album.image" :alt="'Imagen de ' + album.title" />
        <div class="card-body">
          <p class="meta">{{ album.release_year }} · {{ album.label }}</p>
          <h3>{{ album.title }}</h3>
          <p><strong>Artista:</strong> {{ album.artist_name }}</p>
          <p><strong>Subgénero:</strong> {{ album.subgenre_name }}</p>
          <div class="card-actions">
            <router-link class="button small-button" :to="'/album/show/' + album.id">Ver</router-link>
            <router-link class="button small-button" :to="'/album/edit/' + album.id">Editar</router-link>
            <button class="button small-button danger-button" type="button" @click="deleteAlbum(album.id)">Eliminar</button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      albums: [],
      loading: true,
      error: ''
    }
  },
  methods: {
    allAlbums() {
      this.loading = true
      this.error = ''
      fetch('/api/albums', { headers: { Accept: 'application/json' } })
        .then((response) => {
          if (!response.ok) throw new Error('No fue posible consultar los álbumes')
          return response.json()
        })
        .then((result) => {
          this.albums = result
        })
        .catch((error) => {
          this.error = error.message
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteAlbum(id) {
      if (!window.confirm('¿Desea eliminar este álbum?')) return

      fetch('/api/albums/' + id, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ _method: 'DELETE' })
      })
        .then((response) => {
          if (!response.ok && response.status !== 204) {
            throw new Error('No fue posible eliminar el álbum')
          }
          this.allAlbums()
        })
        .catch((error) => {
          this.error = error.message
        })
    }
  },
  mounted() {
    this.allAlbums()
  }
}
</script>
