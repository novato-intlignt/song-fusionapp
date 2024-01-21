-- Create the DATAB
CREATE DATABASE IF NOT EXISTS SongFusion;

-- Use the DATABASE
USE SongFusion;

-- Create the tables

-- Table of users
CREATE TABLE users (
    id_user BINARY(16) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone INT(10) NOT NULL,
    verification_token VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    authentication_token VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table of artists
CREATE TABLE artists (
    id_artist BINARY(16) PRIMARY KEY,
    name_artist VARCHAR(255) NOT NULL,
    img_artist TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table of songs
CREATE TABLE songs (
    id_song BINARY(16) PRIMARY KEY,
    id_api INT(10) UNIQUE NOT NULL,
    title_song VARCHAR(255) NOT NULL,
    full_title VARCHAR(255) NOT NULL,
    eng_lyrics TEXT,
    esp_lyrics TEXT,
    video_song TEXT,
    id_artist BINARY(16),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_artist) REFERENCES artists(id_artist)
);

-- Table of relationship user-songs
CREATE TABLE user_songs (
    id_user BINARY(16),
    id_song BINARY(16),
    PRIMARY KEY (id_user, id_song),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_song) REFERENCES songs(id_song)
);

-- Table of song's images
CREATE TABLE song_images (
    id_img BINARY(16) PRIMARY KEY,
    id_song BINARY(16),
    type_img VARCHAR(50),
    path_img TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_song) REFERENCES songs(id_song)
);

