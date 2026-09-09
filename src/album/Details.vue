<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="eyebrow">Entidad principal</p>
        <h2>{{ pageTitle }}</h2>
      </div>
      <router-link class="button" to="/album">Volver</router-link>
    </div>

    <p v-if="error" class="message error">{{ error }}</p>

    <div class="detail-layout">
      <div class="detail-image-panel">
        <img class="detail-image" :src="album.image || '/images/albums/default.png'" :alt="album.title || 'Álbum de jazz'" />
      </div>

      <form class="detail-form" @submit.prevent>
        <label for="titleInput">Título</label>
        <input id="titleInput" class="u-full-width" type="text" v-model="album.title" :disabled="show" />

        <div class="row">
          <div class="six columns">
            <label for="yearInput">Año de lanzamiento</label>
            <input id="yearInput" class="u-full-width" type="number" v-model.number="album.release_year" :disabled="show" />
          </div>
          <div class="six columns">
            <label for="labelInput">Sello discográfico</label>
            <input id="labelInput" class="u-full-width" type="text" v-model="album.label" :disabled="show" />
          </div>
        </div>

        <div class="row">
          <div class="six columns">
            <label for="artistInput">Artista</label>
            <select id="artistInput" class="u-full-width" v-model="album.artist_id" :disabled="show">
              <option value="">Seleccione un artista</option>
              <option v-for="artist in artists" :key="artist.id" :value="artist.id">{{ artist.name }}</option>
            </select>
          </div>
          <div class="six columns">
            <label for="subgenreInput">Subgénero</label>
            <select id="subgenreInput" class="u-full-width" v-model="album.subgenre_id" :disabled="show">
              <option value="">Seleccione un subgénero</option>
              <option v-for="subgenre in subgenres" :key="subgenre.id" :value="subgenre.id">{{ subgenre.name }}</option>
            </select>
          </div>
        </div>

        <label for="imageInput">Imagen</label>
        <input id="imageInput" class="u-full-width" type="text" v-model="album.image" :disabled="show" />

        <label for="descriptionInput">Descripción</label>
        <textarea id="descriptionInput" class="u-full-width" rows="5" v-model="album.description" :disabled="show"></textarea>

        <div v-if="show" class="relation-links">
          <router-link v-if="album.artist_id" class="button" :to="'/artist/show/' + album.artist_id">Ver artista</router-link>
          <router-link v-if="album.subgenre_id" class="button" :to="'/subgenre/show/' + album.subgenre_id">Ver subgénero</router-link>
        </div>

        <div v-if="edit || create" class="form-actions">
          <button v-if="edit" class="button button-primary" type="button" @click="updateAlbum">Actualizar</button>
          <button v-if="create" class="button button-primary" type="button" @click="createAlbum">Crear</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  props: ['create', 'edit', 'show'],
  data() {
    return {
      artists: [],
      subgenres: [],
      error: '',
      album: {
        title: '',
        release_year: '',
        label: '',
        description: '',
        image: '/images/albums/default.png',
        artist_id: '',
        subgenre_id: ''
      }
    }
  },
  computed: {
    pageTitle() {
      if (this.create) return 'Crear álbum'
      if (this.edit) return 'Editar álbum'
      return 'Detalle del álbum'
    }
  },
  created() {
    this.loadRelations()
    if (!this.create && this.$route.params.id) this.findAlbum(this.$route.params.id)
  },
  methods: {
    loadRelations() {
      Promise.all([
        fetch('/api/artists').then((response) => response.json()),
        fetch('/api/subgenres').then((response) => response.json())
      ])
        .then(([artists, subgenres]) => {
          this.artists = artists
          this.subgenres = subgenres
        })
        .catch(() => {
          this.error = 'No fue posible cargar las entidades relacionadas'
        })
    },
    findAlbum(id) {
      fetch('/api/albums/' + id, { headers: { Accept: 'application/json' } })
        .then((response) => {
          if (!response.ok) throw new Error('Álbum no encontrado')
          return response.json()
        })
        .then((result) => {
          this.album = result
        })
        .catch((error) => {
          this.error = error.message
        })
    },
    updateAlbum() {
      fetch('/api/albums/' + this.$route.params.id, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(this.album)
      })
        .then((response) => {
          if (!response.ok) return response.json().then((body) => Promise.reject(new Error(body.error || 'No fue posible actualizar')))
          return response.json()
        })
        .then(() => this.$router.push('/album'))
        .catch((error) => {
          this.error = error.message
        })
    },
    createAlbum() {
      fetch('/api/albums', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(this.album)
      })
        .then((response) => {
          if (!response.ok) return response.json().then((body) => Promise.reject(new Error(body.error || 'No fue posible crear')))
          return response.json()
        })
        .then(() => this.$router.push('/album'))
        .catch((error) => {
          this.error = error.message
        })
    }
  }
}
</script>
