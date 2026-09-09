function json(data, status = 200) {
  return new Response(data === undefined ? null : JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}

function error(message, status = 400) {
  return json({ error: message }, status)
}

async function nextId(db, table) {
  const row = await db.prepare(`SELECT MAX(CAST(id AS INTEGER)) AS maxId FROM ${table}`).first()
  return String(((row && row.maxId) ? row.maxId : 0) + 1)
}

async function findArtist(db, id) {
  return await db.prepare('SELECT * FROM artists WHERE id = ?').bind(id).first()
}

async function findSubgenre(db, id) {
  return await db.prepare('SELECT * FROM subgenres WHERE id = ?').bind(id).first()
}

async function findAlbum(db, id) {
  return await db.prepare(`
    SELECT albums.*, artists.name AS artist_name, subgenres.name AS subgenre_name
    FROM albums
    JOIN artists ON artists.id = albums.artist_id
    JOIN subgenres ON subgenres.id = albums.subgenre_id
    WHERE albums.id = ?
  `).bind(id).first()
}

async function validateAlbumRelations(db, body) {
  if (!body.artist_id || !body.subgenre_id) {
    return 'Debe seleccionar un artista y un subgénero'
  }
  if (!await findArtist(db, body.artist_id)) return 'El artista indicado no existe'
  if (!await findSubgenre(db, body.subgenre_id)) return 'El subgénero indicado no existe'
  return null
}

async function handleAlbums(request, db, id) {
  if (request.method === 'GET' && !id) {
    const { results } = await db.prepare(`
      SELECT albums.*, artists.name AS artist_name, subgenres.name AS subgenre_name
      FROM albums
      JOIN artists ON artists.id = albums.artist_id
      JOIN subgenres ON subgenres.id = albums.subgenre_id
      ORDER BY CAST(albums.id AS INTEGER)
    `).all()
    return json(results)
  }

  if (request.method === 'GET' && id) {
    const album = await findAlbum(db, id)
    if (!album) return error('Álbum no encontrado', 404)
    return json(album)
  }

  if (request.method === 'POST' && !id) {
    const body = await request.json()
    if (!body.title || !body.release_year || !body.label) return error('Título, año y sello son obligatorios')
    const relationError = await validateAlbumRelations(db, body)
    if (relationError) return error(relationError)

    const newId = await nextId(db, 'albums')
    await db.prepare(`
      INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId,
      body.title,
      body.release_year,
      body.label,
      body.description ?? '',
      body.image ?? '/images/albums/default.png',
      body.artist_id,
      body.subgenre_id
    ).run()
    return json(await findAlbum(db, newId), 201)
  }

  if (request.method === 'POST' && id) {
    const body = await request.json()
    if (body && body._method === 'DELETE') return deleteAlbum(db, id)
    return updateAlbum(db, id, body)
  }

  if (request.method === 'PUT' && id) {
    return updateAlbum(db, id, await request.json())
  }

  if (request.method === 'DELETE' && id) {
    return deleteAlbum(db, id)
  }

  return error('Ruta de álbumes no encontrada', 404)
}

async function updateAlbum(db, id, body) {
  if (!await findAlbum(db, id)) return error('Álbum no encontrado', 404)
  if (!body.title || !body.release_year || !body.label) return error('Título, año y sello son obligatorios')
  const relationError = await validateAlbumRelations(db, body)
  if (relationError) return error(relationError)

  await db.prepare(`
    UPDATE albums SET
      title = ?, release_year = ?, label = ?, description = ?, image = ?, artist_id = ?, subgenre_id = ?
    WHERE id = ?
  `).bind(
    body.title,
    body.release_year,
    body.label,
    body.description ?? '',
    body.image ?? '/images/albums/default.png',
    body.artist_id,
    body.subgenre_id,
    id
  ).run()
  return json(await findAlbum(db, id))
}

async function deleteAlbum(db, id) {
  if (!await findAlbum(db, id)) return error('Álbum no encontrado', 404)
  await db.prepare('DELETE FROM albums WHERE id = ?').bind(id).run()
  return new Response(null, { status: 204 })
}

async function handleArtists(request, db, id) {
  if (request.method === 'GET' && !id) {
    const { results } = await db.prepare('SELECT * FROM artists ORDER BY CAST(id AS INTEGER)').all()
    return json(results)
  }

  if (request.method === 'GET' && id) {
    const artist = await findArtist(db, id)
    if (!artist) return error('Artista no encontrado', 404)
    return json(artist)
  }

  if (request.method === 'POST' && !id) {
    const body = await request.json()
    if (!body.name || !body.country || !body.main_instrument) return error('Nombre, país e instrumento son obligatorios')
    const newId = await nextId(db, 'artists')
    await db.prepare(`
      INSERT INTO artists (id, name, country, birth_year, main_instrument, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId, body.name, body.country, body.birth_year ?? null, body.main_instrument,
      body.description ?? '', body.image ?? '/images/artists/default.png'
    ).run()
    return json(await findArtist(db, newId), 201)
  }

  if (request.method === 'POST' && id) {
    const body = await request.json()
    if (body && body._method === 'DELETE') return deleteArtist(db, id)
    return updateArtist(db, id, body)
  }

  if (request.method === 'PUT' && id) return updateArtist(db, id, await request.json())
  if (request.method === 'DELETE' && id) return deleteArtist(db, id)

  return error('Ruta de artistas no encontrada', 404)
}

async function updateArtist(db, id, body) {
  if (!await findArtist(db, id)) return error('Artista no encontrado', 404)
  if (!body.name || !body.country || !body.main_instrument) return error('Nombre, país e instrumento son obligatorios')
  await db.prepare(`
    UPDATE artists SET name = ?, country = ?, birth_year = ?, main_instrument = ?, description = ?, image = ?
    WHERE id = ?
  `).bind(
    body.name, body.country, body.birth_year ?? null, body.main_instrument,
    body.description ?? '', body.image ?? '/images/artists/default.png', id
  ).run()
  return json(await findArtist(db, id))
}

async function deleteArtist(db, id) {
  if (!await findArtist(db, id)) return error('Artista no encontrado', 404)
  const linked = await db.prepare('SELECT COUNT(*) AS total FROM albums WHERE artist_id = ?').bind(id).first()
  if (linked && linked.total > 0) return error('No se puede eliminar: existen álbumes relacionados con este artista', 409)
  await db.prepare('DELETE FROM artists WHERE id = ?').bind(id).run()
  return new Response(null, { status: 204 })
}

async function handleSubgenres(request, db, id) {
  if (request.method === 'GET' && !id) {
    const { results } = await db.prepare('SELECT * FROM subgenres ORDER BY CAST(id AS INTEGER)').all()
    return json(results)
  }

  if (request.method === 'GET' && id) {
    const subgenre = await findSubgenre(db, id)
    if (!subgenre) return error('Subgénero no encontrado', 404)
    return json(subgenre)
  }

  if (request.method === 'POST' && !id) {
    const body = await request.json()
    if (!body.name || !body.origin_decade || !body.origin_place || !body.characteristics) {
      return error('Nombre, década, lugar y características son obligatorios')
    }
    const newId = await nextId(db, 'subgenres')
    await db.prepare(`
      INSERT INTO subgenres (id, name, origin_decade, origin_place, characteristics, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId, body.name, body.origin_decade, body.origin_place, body.characteristics,
      body.description ?? '', body.image ?? '/images/subgenres/default.png'
    ).run()
    return json(await findSubgenre(db, newId), 201)
  }

  if (request.method === 'POST' && id) {
    const body = await request.json()
    if (body && body._method === 'DELETE') return deleteSubgenre(db, id)
    return updateSubgenre(db, id, body)
  }

  if (request.method === 'PUT' && id) return updateSubgenre(db, id, await request.json())
  if (request.method === 'DELETE' && id) return deleteSubgenre(db, id)

  return error('Ruta de subgéneros no encontrada', 404)
}

async function updateSubgenre(db, id, body) {
  if (!await findSubgenre(db, id)) return error('Subgénero no encontrado', 404)
  if (!body.name || !body.origin_decade || !body.origin_place || !body.characteristics) {
    return error('Nombre, década, lugar y características son obligatorios')
  }
  await db.prepare(`
    UPDATE subgenres SET name = ?, origin_decade = ?, origin_place = ?, characteristics = ?, description = ?, image = ?
    WHERE id = ?
  `).bind(
    body.name, body.origin_decade, body.origin_place, body.characteristics,
    body.description ?? '', body.image ?? '/images/subgenres/default.png', id
  ).run()
  return json(await findSubgenre(db, id))
}

async function deleteSubgenre(db, id) {
  if (!await findSubgenre(db, id)) return error('Subgénero no encontrado', 404)
  const linked = await db.prepare('SELECT COUNT(*) AS total FROM albums WHERE subgenre_id = ?').bind(id).first()
  if (linked && linked.total > 0) return error('No se puede eliminar: existen álbumes relacionados con este subgénero', 409)
  await db.prepare('DELETE FROM subgenres WHERE id = ?').bind(id).run()
  return new Response(null, { status: 204 })
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    if (!pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request)
    }

    const db = env.DB

    try {
      const parts = pathname.split('/').filter(Boolean)
      const resource = parts[1]
      const id = parts[2] || null

      if (resource === 'albums') return await handleAlbums(request, db, id)
      if (resource === 'artists') return await handleArtists(request, db, id)
      if (resource === 'subgenres') return await handleSubgenres(request, db, id)

      return error('Recurso no encontrado', 404)
    } catch (err) {
      return error('Error del servidor: ' + err.message, 500)
    }
  }
}
