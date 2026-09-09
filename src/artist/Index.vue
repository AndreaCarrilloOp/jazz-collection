<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="eyebrow">Entidad secundaria</p>
        <h2>Artistas</h2>
        <p>Intérpretes y compositores relacionados con los álbumes del catálogo.</p>
      </div>
      <router-link class="button button-primary" to="/artist/create">Nuevo artista</router-link>
    </div>

    <p v-if="error" class="message error">{{ error }}</p>

    <div class="card-grid compact-grid">
      <article v-for="artist in artists" :key="artist.id" class="catalog-card">
        <img class="catalog-image" :src="artist.image" :alt="'Imagen de ' + artist.name" />
        <div class="card-body">
          <p class="meta">{{ artist.country }} · {{ artist.birth_year }}</p>
          <h3>{{ artist.name }}</h3>
          <p><strong>Instrumento:</strong> {{ artist.main_instrument }}</p>
          <div class="card-actions">
            <router-link class="button small-button" :to="'/artist/show/' + artist.id">Ver</router-link>
            <router-link class="button small-button" :to="'/artist/edit/' + artist.id">Editar</router-link>
            <button class="button small-button danger-button" type="button" @click="deleteArtist(artist.id)">Eliminar</button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return { artists: [], error: '' }
  },
  methods: {
    allArtists() {
      fetch('/api/artists', { headers: { Accept: 'application/json' } })
        .then((response) => {
          if (!response.ok) throw new Error('No fue posible consultar los artistas')
          return response.json()
        })
        .then((result) => {
          this.artists = result
        })
        .catch((error) => {
          this.error = error.message
        })
    },
    deleteArtist(id) {
      if (!window.confirm('¿Desea eliminar este artista? Los álbumes relacionados deben eliminarse o reasignarse primero.')) return
      fetch('/api/artists/' + id, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ _method: 'DELETE' })
      })
        .then((response) => {
          if (!response.ok && response.status !== 204) {
            return response.json().then((body) => Promise.reject(new Error(body.error || 'No fue posible eliminar el artista')))
          }
          this.allArtists()
        })
        .catch((error) => {
          this.error = error.message
        })
    }
  },
  mounted() {
    this.allArtists()
  }
}
</script>
