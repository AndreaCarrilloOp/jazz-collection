<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="eyebrow">Entidad secundaria</p>
        <h2>{{ pageTitle }}</h2>
      </div>
      <router-link class="button" to="/artist">Volver</router-link>
    </div>

    <p v-if="error" class="message error">{{ error }}</p>

    <div class="detail-layout">
      <div class="detail-image-panel">
        <img class="detail-image" :src="artist.image || '/images/artists/default.png'" :alt="artist.name || 'Artista de jazz'" />
      </div>

      <form class="detail-form" @submit.prevent>
        <label for="nameInput">Nombre</label>
        <input id="nameInput" class="u-full-width" type="text" v-model="artist.name" :disabled="show" />

        <div class="row">
          <div class="six columns">
            <label for="countryInput">País</label>
            <input id="countryInput" class="u-full-width" type="text" v-model="artist.country" :disabled="show" />
          </div>
          <div class="six columns">
            <label for="birthInput">Año de nacimiento</label>
            <input id="birthInput" class="u-full-width" type="number" v-model.number="artist.birth_year" :disabled="show" />
          </div>
        </div>

        <label for="instrumentInput">Instrumento principal</label>
        <input id="instrumentInput" class="u-full-width" type="text" v-model="artist.main_instrument" :disabled="show" />

        <label for="imageInput">Imagen</label>
        <input id="imageInput" class="u-full-width" type="text" v-model="artist.image" :disabled="show" />

        <label for="descriptionInput">Descripción</label>
        <textarea id="descriptionInput" class="u-full-width" rows="5" v-model="artist.description" :disabled="show"></textarea>

        <div v-if="edit || create" class="form-actions">
          <button v-if="edit" class="button button-primary" type="button" @click="updateArtist">Actualizar</button>
          <button v-if="create" class="button button-primary" type="button" @click="createArtist">Crear</button>
        </div>
      </form>
    </div>

    <section v-if="show" class="related-section">
      <h3>Álbumes relacionados</h3>
      <div class="related-list">
        <router-link v-for="album in relatedAlbums" :key="album.id" class="related-item" :to="'/album/show/' + album.id">
          <span>{{ album.title }}</span>
          <span class="meta">{{ album.release_year }}</span>
        </router-link>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  props: ['create', 'edit', 'show'],
  data() {
    return {
      albums: [],
      error: '',
      artist: {
        name: '',
        country: '',
        birth_year: '',
        main_instrument: '',
        description: '',
        image: '/images/artists/default.png'
      }
    }
  },
  computed: {
    pageTitle() {
      if (this.create) return 'Crear artista'
      if (this.edit) return 'Editar artista'
      return 'Detalle del artista'
    },
    relatedAlbums() {
      return this.albums.filter((album) => String(album.artist_id) === String(this.artist.id))
    }
  },
  created() {
    if (!this.create && this.$route.params.id) this.findArtist(this.$route.params.id)
    if (this.show) this.loadAlbums()
  },
  methods: {
    loadAlbums() {
      fetch('/api/albums')
        .then((response) => response.json())
        .then((result) => {
          this.albums = result
        })
    },
    findArtist(id) {
      fetch('/api/artists/' + id)
        .then((response) => {
          if (!response.ok) throw new Error('Artista no encontrado')
          return response.json()
        })
        .then((result) => {
          this.artist = result
        })
        .catch((error) => {
          this.error = error.message
        })
    },
    updateArtist() {
      fetch('/api/artists/' + this.$route.params.id, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(this.artist)
      })
        .then((response) => {
          if (!response.ok) return response.json().then((body) => Promise.reject(new Error(body.error || 'No fue posible actualizar')))
          return response.json()
        })
        .then(() => this.$router.push('/artist'))
        .catch((error) => {
          this.error = error.message
        })
    },
    createArtist() {
      fetch('/api/artists', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(this.artist)
      })
        .then((response) => {
          if (!response.ok) return response.json().then((body) => Promise.reject(new Error(body.error || 'No fue posible crear')))
          return response.json()
        })
        .then(() => this.$router.push('/artist'))
        .catch((error) => {
          this.error = error.message
        })
    }
  }
}
</script>
