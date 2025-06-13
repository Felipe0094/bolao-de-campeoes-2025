-- Primeiro, vamos limpar a tabela de times
TRUNCATE TABLE teams CASCADE;

-- Inserir os times
INSERT INTO teams (name, country, logo_url)
VALUES
-- Grupo A
('Al Ahly', 'Egito', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/al-ahly.png'),
('Inter Miami CF', 'Estados Unidos', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/inter-miami.png'),
('Palmeiras', 'Brasil', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/palmeiras.png'),
('FC Porto', 'Portugal', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/porto.png'),

-- Grupo B
('Paris SG', 'França', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/psg.png'),
('Atlético Madrid', 'Espanha', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/atletico-madrid.png'),
('Botafogo', 'Brasil', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/botafogo.png'),
('Seattle Sounders FC', 'Estados Unidos', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/seattle-sounders.png'),

-- Grupo C
('Bayern Munich', 'Alemanha', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/bayern-munich.png'),
('Auckland City FC', 'Nova Zelândia', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/auckland-city.png'),
('Boca Juniors', 'Argentina', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/boca-juniors.png'),
('Benfica', 'Portugal', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/benfica.png'),

-- Grupo D
('Chelsea', 'Inglaterra', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/chelsea.png'),
('Club León', 'México', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/club-leon.png'),
('Flamengo', 'Brasil', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/flamengo.png'),
('Espérance de Tunis', 'Tunísia', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/esperance-tunis.png'),

-- Grupo E
('River Plate', 'Argentina', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/river-plate.png'),
('Urawa Red Diamonds', 'Japão', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/urawa-red-diamonds.png'),
('Monterrey', 'México', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/monterrey.png'),
('Inter Milan', 'Itália', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/inter-milan.png'),

-- Grupo F
('Fluminense', 'Brasil', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/fluminense.png'),
('Borussia Dortmund', 'Alemanha', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/borussia-dortmund.png'),
('Ulsan Hyundai', 'Coreia do Sul', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/ulsan-hyundai.png'),
('Mamelodi Sundowns', 'África do Sul', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/mamelodi-sundowns.png'),

-- Grupo G
('Manchester City', 'Inglaterra', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/manchester-city.png'),
('Wydad AC', 'Marrocos', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/wydad-ac.png'),
('Al Ain', 'Emirados Árabes Unidos', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/al-ain.png'),
('Juventus', 'Itália', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/juventus.png'),

-- Grupo H
('Real Madrid', 'Espanha', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/real-madrid.png'),
('Al Hilal', 'Arábia Saudita', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/al-hilal.png'),
('CF Pachuca', 'México', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/pachuca.png'),
('FC Salzburg', 'Áustria', 'https://sqlxinffbahbfoydmksy.supabase.co/storage/v1/object/public/app-assets/teams/salzburg.png'); 