<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="eyebrow">Entidad secundaria</p>
        <h2>{{ pageTitle }}</h2>
      </div>
      <router-link class="button" to="/subgenre">Volver</router-link>
    </div>

    <p v-if="error" class="message error">{{ error }}</p>

    <div class="detail-layout">
      <div class="detail-image-panel">
        <img class="detail-image" :src="subgenre.image || '/images/subgenres/default.png'" :alt="subgenre.name || 'Subgénero de jazz'" />
      </div>

      <form class="detail-form" @submit.prevent>
        <label for="nameInput">Nombre</label>
        <input id="nameInput" class="u-full-width" type="text" v-model="subgenre.name" :disabled="show" />

        <div class="row">
          <div class="six columns">
            <label for="decadeInput">Década de origen</label>
            <input id="decadeInput" class="u-full-width" type="text" v-model="subgenre.origin_decade" :disabled="show" />
          </div>
          <div class="six columns">
            <label for="placeInput">Lugar de origen</label>
            <input id="placeInput" class="u-full-width" type="text" v-model="subgenre.origin_place" :disabled="show" />
          </div>
        </div>

        <label for="characteristicsInput">Características</label>
        <input id="characteristicsInput" class="u-full-width" type="text" v-model="subgenre.characteristics" :disabled="show" />

        <label for="imageInput">Imagen</label>
        <input id="imageInput" class="u-full-width" type="text" v-model="subgenre.image" :disabled="show" />

        <label for="descriptionInput">Descripción</label>
        <textarea id="descriptionInput" class="u-full-width" rows="5" v-model="subgenre.description" :disabled="show"></textarea>

        <div v-if="edit || create" class="form-actions">
          <button v-if="edit" class="button button-primary" type="button" @click="updateSubgenre">Actualizar</button>
          <button v-if="create" class="button button-primary" type="button" @click="createSubgenre">Crear</button>
        </div>
      </form>
    </div>

    <section v-if="show" class="related-section">
      <h3>Álbumes relacionados</h3>
      <div class="related-list">
        <router-link v-for="album in relatedAlbums" :key="album.id" class="related-item" :to="'/album/show/' + album.id">
          <span>{{ album.title }}</span>
          <span class="meta">{{ album.artist_name }}</span>
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
      subgenre: {
        name: '',
        origin_decade: '',
        origin_place: '',
        characteristics: '',
        description: '',
        image: '/images/subgenres/default.png'
      }
    }
  },
  computed: {
    pageTitle() {
      if (this.create) return 'Crear subgénero'
      if (this.edit) return 'Editar subgénero'
      return 'Detalle del subgénero'
    },
    relatedAlbums() {
      return this.albums.filter((album) => String(album.subgenre_id) === String(this.subgenre.id))
    }
  },
  created() {
    if (!this.create && this.$route.params.id) this.findSubgenre(this.$route.params.id)
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
    findSubgenre(id) {
      fetch('/api/subgenres/' + id)
        .then((response) => {
          if (!response.ok) throw new Error('Subgénero no encontrado')
          return response.json()
        })
        .then((result) => {
          this.subgenre = result
        })
        .catch((error) => {
          this.error = error.message
        })
    },
    updateSubgenre() {
      fetch('/api/subgenres/' + this.$route.params.id, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(this.subgenre)
      })
        .then((response) => {
          if (!response.ok) return response.json().then((body) => Promise.reject(new Error(body.error || 'No fue posible actualizar')))
          return response.json()
        })
        .then(() => this.$router.push('/subgenre'))
        .catch((error) => {
          this.error = error.message
        })
    },
    createSubgenre() {
      fetch('/api/subgenres', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(this.subgenre)
      })
        .then((response) => {
          if (!response.ok) return response.json().then((body) => Promise.reject(new Error(body.error || 'No fue posible crear')))
          return response.json()
        })
        .then(() => this.$router.push('/subgenre'))
        .catch((error) => {
          this.error = error.message
        })
    }
  }
}
</script>
