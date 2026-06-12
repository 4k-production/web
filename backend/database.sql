-- =============================================
-- 4K Production - MySQL Database Setup v2.0
-- =============================================
-- Run: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS fourk_production
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fourk_production;

-- =============================================
-- Table: announcements
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255)  NOT NULL,
  content      LONGTEXT      NOT NULL,
  category     VARCHAR(100)  DEFAULT 'General',
  image_url    VARCHAR(500)  DEFAULT NULL,
  is_featured  TINYINT(1)    DEFAULT 0,
  status       ENUM('draft','published','scheduled') DEFAULT 'published',
  publish_date DATETIME      DEFAULT NULL,
  created_at   DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- Table: portfolio
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  description LONGTEXT      DEFAULT NULL,
  category    VARCHAR(100)  NOT NULL,
  media_type  ENUM('image','video') DEFAULT 'image',
  media_url   LONGTEXT      NOT NULL,
  thumbnail   VARCHAR(500)  DEFAULT NULL,
  client      VARCHAR(200)  DEFAULT NULL,
  is_featured TINYINT(1)    DEFAULT 0,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- Table: service_requests
-- =============================================
CREATE TABLE IF NOT EXISTS service_requests (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(200)  NOT NULL,
  email        VARCHAR(200)  NOT NULL,
  phone        VARCHAR(50)   DEFAULT NULL,
  service_type VARCHAR(100)  NOT NULL,
  event_date   DATE          DEFAULT NULL,
  budget       VARCHAR(100)  DEFAULT NULL,
  message      LONGTEXT      DEFAULT NULL,
  status       ENUM('pending','reviewed','approved','confirmed','dismissed','completed') DEFAULT 'pending',
  created_at   DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- Table: contact_messages
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  email      VARCHAR(200) NOT NULL,
  phone      VARCHAR(50)  DEFAULT NULL,
  message    LONGTEXT     NOT NULL,
  is_read    TINYINT(1)   DEFAULT 0,
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- Table: events
-- =============================================
CREATE TABLE IF NOT EXISTS events (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  event_name   VARCHAR(255) NOT NULL,
  client_name  VARCHAR(255) DEFAULT NULL,
  event_date   DATE         DEFAULT NULL,
  video_url    VARCHAR(500) DEFAULT NULL,
  photos_json  LONGTEXT     DEFAULT NULL, -- JSON array of photo URLs
  slug         VARCHAR(255) UNIQUE DEFAULT NULL,
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- Migration: If tables already exist, add new columns
-- =============================================
-- Run these ALTER statements if upgrading from v1.0:
--
-- ALTER TABLE announcements
--   ADD COLUMN IF NOT EXISTS status ENUM('draft','published','scheduled') DEFAULT 'published',
--   ADD COLUMN IF NOT EXISTS publish_date DATETIME DEFAULT NULL;
--
-- ALTER TABLE service_requests
--   MODIFY COLUMN status ENUM('pending','reviewed','approved','confirmed','dismissed','completed') DEFAULT 'pending';
--
-- UPDATE announcements SET status='published' WHERE status IS NULL;

-- =============================================
-- Seed Data: Announcements
-- =============================================
INSERT INTO announcements (title, content, category, is_featured, status) VALUES
('Grand Opening of Our New Studio!',
 'We are thrilled to announce the opening of our state-of-the-art 4K production studio. Equipped with RED cinema cameras, professional lighting rigs, and a fully soundproofed recording space.',
 'Company News', 1, 'published'),
('New Service: Live Streaming for Corporate Events',
 '4K Production now offers full-scale live streaming services for corporate events, product launches, and conferences. Our team handles everything from multi-camera setups to global broadcast distribution.',
 'New Service', 1, 'published'),
('Award: Best Documentary Production 2024',
 'We are honored to announce that our documentary "Voices of the Valley" has won the Best Documentary award at the National Film Festival 2024.',
 'Achievement', 0, 'published'),
('Collaboration with Top Brands',
 'This quarter, 4K Production has delivered commercial ad campaigns for 12 major brands across East Africa, producing over 40 minutes of high-impact commercial content.',
 'Milestone', 0, 'published');

-- =============================================
-- Seed Data: Portfolio
-- =============================================
INSERT INTO portfolio (title, description, category, media_type, media_url, client, is_featured) VALUES
('Sunrise Brand Campaign',
 'Full commercial ad production for Sunrise Beverages including concept development, shooting, and post-production.',
 'Commercial', 'image', 'https://images.unsplash.com/photo-1536240478700-b869ad10e2c0?w=800',
 'Sunrise Beverages', 1),
('Mountain Heritage Documentary',
 'A cinematic documentary exploring the cultural heritage of mountain communities, shot in 4K RAW.',
 'Documentary', 'image', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
 'Cultural Heritage Foundation', 1),
('Tech Summit 2024 Event Coverage',
 'Complete event coverage including keynote sessions, interviews, and highlight reels for Africa''s largest tech summit.',
 'Event Coverage', 'image', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
 'AfriTech Summit', 1),
('Fashion Week Motion Graphics',
 'Dynamic motion graphics and lower thirds package for the annual Fashion Week broadcast.',
 'Motion Graphics', 'image', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
 'Style Magazine', 0),
('Wedding Cinematic Film',
 'Luxury wedding videography and photography package delivering a cinematic 4K feature film.',
 'Photography', 'image', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
 'Private Client', 0),
('Corporate Brand Identity Video',
 'Brand story video production for a leading financial services company launching in East Africa.',
 'Video Production', 'image', 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=800',
 'FuturePay Financial', 1);

-- =============================================
-- End of Setup Script v2.0
-- =============================================
