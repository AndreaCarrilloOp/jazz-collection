import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import './css/normalize.css'
import './css/skeleton.css'
import './css/app.css'

import albumIndex from './album/Index.vue'
import albumDetails from './album/Details.vue'
import artistIndex from './artist/Index.vue'
import artistDetails from './artist/Details.vue'
import subgenreIndex from './subgenre/Index.vue'
import subgenreDetails from './subgenre/Details.vue'

const routes = [
  { path: '/', component: albumIndex, props: true },
  { path: '/album', component: albumIndex, props: true },
  { path: '/album/show/:id', component: albumDetails, props: { show: true } },
  { path: '/album/edit/:id', component: albumDetails, props: { edit: true } },
  { path: '/album/create', component: albumDetails, props: { create: true } },

  { path: '/artist', component: artistIndex, props: true },
  { path: '/artist/show/:id', component: artistDetails, props: { show: true } },
  { path: '/artist/edit/:id', component: artistDetails, props: { edit: true } },
  { path: '/artist/create', component: artistDetails, props: { create: true } },

  { path: '/subgenre', component: subgenreIndex, props: true },
  { path: '/subgenre/show/:id', component: subgenreDetails, props: { show: true } },
  { path: '/subgenre/edit/:id', component: subgenreDetails, props: { edit: true } },
  { path: '/subgenre/create', component: subgenreDetails, props: { create: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
