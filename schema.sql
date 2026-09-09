PRAGMA foreign_keys = ON;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS subgenres;
CREATE TABLE artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  birth_year INTEGER,
  main_instrument TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT
);
CREATE TABLE subgenres (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  origin_decade TEXT NOT NULL,
  origin_place TEXT NOT NULL,
  characteristics TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT
);
CREATE TABLE albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  release_year INTEGER NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  artist_id TEXT NOT NULL,
  subgenre_id TEXT NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (subgenre_id) REFERENCES subgenres(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
INSERT INTO artists (id, name, country, birth_year, main_instrument, description, image) VALUES ('1', 'Miles Davis', 'Estados Unidos', 1926, 'Trompeta', 'Trompetista y compositor cuya obra atravesó varias etapas fundamentales del jazz moderno.', '/images/artists/miles-davis.jpg');
INSERT INTO artists (id, name, country, birth_year, main_instrument, description, image) VALUES ('2', 'John Coltrane', 'Estados Unidos', 1926, 'Saxofón tenor y soprano', 'Saxofonista y compositor reconocido por su desarrollo armónico, técnico y espiritual dentro del jazz.', '/images/artists/john-coltrane.jpg');
INSERT INTO artists (id, name, country, birth_year, main_instrument, description, image) VALUES ('3', 'Charles Mingus', 'Estados Unidos', 1922, 'Contrabajo', 'Contrabajista, compositor y director de banda con una obra marcada por el blues, el gospel y la experimentación.', '/images/artists/charles-mingus.jpg');
INSERT INTO artists (id, name, country, birth_year, main_instrument, description, image) VALUES ('4', 'Thelonious Monk', 'Estados Unidos', 1917, 'Piano', 'Pianista y compositor asociado al bebop, conocido por su lenguaje armónico y rítmico distintivo.', '/images/artists/thelonious-monk.jpg');
INSERT INTO artists (id, name, country, birth_year, main_instrument, description, image) VALUES ('5', 'Dave Brubeck', 'Estados Unidos', 1920, 'Piano', 'Pianista y compositor cuya obra popularizó el uso de métricas poco habituales en el jazz.', '/images/artists/dave-brubeck.jpg');
INSERT INTO artists (id, name, country, birth_year, main_instrument, description, image) VALUES ('6', 'Herbie Hancock', 'Estados Unidos', 1940, 'Piano y teclados', 'Pianista y compositor que ha trabajado desde el post-bop hasta la fusión con funk y música electrónica.', '/images/artists/herbie-hancock.jpg');
INSERT INTO subgenres (id, name, origin_decade, origin_place, characteristics, description, image) VALUES ('1', 'Modal Jazz', 'Década de 1950', 'Estados Unidos', 'Improvisación basada en modos y estructuras armónicas abiertas.', 'Enfoque que reduce la dependencia de progresiones de acordes rápidas y da mayor espacio a la exploración melódica.', '/images/subgenres/modal-jazz.png');
INSERT INTO subgenres (id, name, origin_decade, origin_place, characteristics, description, image) VALUES ('2', 'Hard Bop', 'Década de 1950', 'Estados Unidos', 'Bebop con mayor presencia de blues, gospel, soul y ritmos marcados.', 'Estilo desarrollado como una extensión del bebop con un sonido más directo y fuerte conexión con tradiciones afroamericanas.', '/images/subgenres/hard-bop.png');
INSERT INTO subgenres (id, name, origin_decade, origin_place, characteristics, description, image) VALUES ('3', 'Cool Jazz', 'Finales de 1940 y década de 1950', 'Estados Unidos', 'Sonoridad contenida, arreglos detallados y énfasis en el espacio y el equilibrio.', 'Corriente que suele presentar tempos moderados, timbres suaves y arreglos con una estética más relajada.', '/images/subgenres/cool-jazz.png');
INSERT INTO subgenres (id, name, origin_decade, origin_place, characteristics, description, image) VALUES ('4', 'Post-Bop', 'Década de 1960', 'Estados Unidos', 'Combina hard bop, modal jazz y elementos de exploración armónica y rítmica.', 'Categoría amplia para música que amplió el vocabulario del bop sin abandonar por completo sus estructuras.', '/images/subgenres/post-bop.png');
INSERT INTO subgenres (id, name, origin_decade, origin_place, characteristics, description, image) VALUES ('5', 'Jazz Fusion', 'Finales de 1960 y década de 1970', 'Estados Unidos', 'Uso de instrumentos eléctricos y mezcla con rock, funk y ritmos amplificados.', 'Fusión del lenguaje improvisado del jazz con recursos tímbricos y rítmicos de géneros populares contemporáneos.', '/images/subgenres/jazz-fusion.png');
INSERT INTO subgenres (id, name, origin_decade, origin_place, characteristics, description, image) VALUES ('6', 'Bebop', 'Década de 1940', 'Estados Unidos', 'Tempos rápidos, improvisación compleja y armonías con numerosas extensiones y sustituciones.', 'Estilo central del jazz moderno que desplazó el énfasis desde el baile hacia la improvisación instrumental y la escucha.', '/images/subgenres/bebop.png');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('1', 'Kind of Blue', 1959, 'Columbia Records', 'Álbum emblemático de Miles Davis asociado al desarrollo y popularización del jazz modal.', '/images/albums/kind-of-blue.png', '1', '1');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('2', 'Bitches Brew', 1970, 'Columbia Records', 'Trabajo de Miles Davis que incorporó instrumentación eléctrica y se convirtió en una referencia del jazz fusion.', '/images/albums/bitches-brew.png', '1', '5');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('3', 'A Love Supreme', 1965, 'Impulse! Records', 'Suite de John Coltrane con una fuerte dimensión espiritual y un lenguaje ligado al jazz modal.', '/images/albums/a-love-supreme.png', '2', '1');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('4', 'Blue Train', 1957, 'Blue Note Records', 'Grabación de John Coltrane reconocida como una obra destacada del hard bop de finales de los años cincuenta.', '/images/albums/blue-train.png', '2', '2');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('5', 'Mingus Ah Um', 1959, 'Columbia Records', 'Álbum de Charles Mingus que integra blues, gospel, composición avanzada y recursos del hard bop.', '/images/albums/mingus-ah-um.png', '3', '2');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('6', 'The Black Saint and the Sinner Lady', 1963, 'Impulse! Records', 'Obra extensa de Charles Mingus con escritura orquestal, cambios de textura y elementos asociados al post-bop.', '/images/albums/black-saint.png', '3', '4');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('7', 'Brilliant Corners', 1957, 'Riverside Records', 'Álbum de Thelonious Monk con composiciones complejas que reflejan su lenguaje pianístico y compositivo.', '/images/albums/brilliant-corners.png', '4', '6');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('8', 'Monk''s Dream', 1963, 'Columbia Records', 'Grabación del cuarteto de Thelonious Monk que reúne composiciones propias y su enfoque rítmico-armónico característico.', '/images/albums/monks-dream.png', '4', '6');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('9', 'Time Out', 1959, 'Columbia Records', 'Álbum del Dave Brubeck Quartet conocido por explorar métricas poco comunes dentro de un sonido asociado al cool jazz.', '/images/albums/time-out.png', '5', '3');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('10', 'Jazz Impressions of Japan', 1964, 'Columbia Records', 'Trabajo del Dave Brubeck Quartet inspirado por una gira en Japón y presentado con un enfoque lírico y atmosférico.', '/images/albums/jazz-impressions-japan.png', '5', '3');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('11', 'Head Hunters', 1973, 'Columbia Records', 'Álbum de Herbie Hancock que combina improvisación de jazz con funk, sintetizadores e instrumentación eléctrica.', '/images/albums/head-hunters.png', '6', '5');
INSERT INTO albums (id, title, release_year, label, description, image, artist_id, subgenre_id) VALUES ('12', 'Maiden Voyage', 1965, 'Blue Note Records', 'Álbum conceptual de Herbie Hancock con composiciones abiertas y un lenguaje armónico representativo del post-bop.', '/images/albums/maiden-voyage.png', '6', '4');
