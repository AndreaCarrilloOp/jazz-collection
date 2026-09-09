<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="eyebrow">Entidad secundaria</p>
        <h2>Subgéneros</h2>
        <p>Estilos que permiten organizar y navegar el catálogo.</p>
      </div>
      <router-link class="button button-primary" to="/subgenre/create">Nuevo subgénero</router-link>
    </div>

    <p v-if="error" class="message error">{{ error }}</p>

    <div class="card-grid compact-grid">
      <article v-for="subgenre in subgenres" :key="subgenre.id" class="catalog-card">
        <img class="catalog-image" :src="subgenre.image" :alt="'Imagen de ' + subgenre.name" />
        <div class="card-body">
          <p class="meta">{{ subgenre.origin_decade }} · {{ subgenre.origin_place }}</p>
          <h3>{{ subgenre.name }}</h3>
          <p class="clamp">{{ subgenre.characteristics }}</p>
          <div class="card-actions">
            <router-link class="button small-button" :to="'/subgenre/show/' + subgenre.id">Ver</router-link>
            <router-link class="button small-button" :to="'/subgenre/edit/' + subgenre.id">Editar</router-link>
            <button class="button small-button danger-button" type="button" @click="deleteSubgenre(subgenre.id)">Eliminar</button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return { subgenres: [], error: '' }
  },
  methods: {
    allSubgenres() {
      fetch('/api/subgenres')
        .then((response) => {
          if (!response.ok) throw new Error('No fue posible consultar los subgéneros')
          return response.json()
        })
        .then((result) => {
          this.subgenres = result
        })
        .catch((error) => {
          this.error = error.message
        })
    },
    deleteSubgenre(id) {
      if (!window.confirm('¿Desea eliminar este subgénero? Los álbumes relacionados deben eliminarse o reasignarse primero.')) return
      fetch('/api/subgenres/' + id, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ _method: 'DELETE' })
      })
        .then((response) => {
          if (!response.ok && response.status !== 204) {
            return response.json().then((body) => Promise.reject(new Error(body.error || 'No fue posible eliminar el subgénero')))
          }
          this.allSubgenres()
        })
        .catch((error) => {
          this.error = error.message
        })
    }
  },
  mounted() {
    this.allSubgenres()
  }
}
</script>
