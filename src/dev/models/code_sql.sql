--- Create the DATABASE
CREATE DATABASE IF NOT EXISTS SongFusion;

--- Use the DATABASE
USE SongFusion;

--- Create the tables
-- Tabla de Usuarios
CREATE TABLE users (
    id_user VARBINARY(16) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    verification_token VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    authentication_token VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active'
);

-- Tabla de Canciones
CREATE TABLE songs (
    id_song VARBINARY(16) PRIMARY KEY,
    id_api INT(10) UNIQUE NOT NULL,
    title_song VARCHAR(255) NOT NULL,
    eng_lyrics TEXT,
    esp_lyrics TEXT,
    video_song TEXT
);

-- Tabla de Artistas
CREATE TABLE artists (
    id_artist VARBINARY(16) PRIMARY KEY,
    name_artist VARCHAR(255) NOT NULL,
    img_artist TEXT
);

-- Tabla de Relación Usuario-Canción
CREATE TABLE user_songs (
    id_user VARBINARY(16),
    id_song VARBINARY(16),
    PRIMARY KEY (id_user, id_song),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_song) REFERENCES songs(id_song)
);

-- Tabla de Imágenes de Canciones
CREATE TABLE song_images (
    id_img VARBINARY(16) PRIMARY KEY,
    id_song VARBINARY(16),
    type_img VARCHAR(50),
    path_img TEXT,
    FOREIGN KEY (id_song) REFERENCES songs(id_song)
);

