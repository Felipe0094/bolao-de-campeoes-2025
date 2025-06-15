-- Primeiro, vamos limpar a tabela de jogos
TRUNCATE TABLE matches CASCADE;

-- Inserir os jogos da fase de grupos
INSERT INTO matches (match_date, match_time, home_team_id, away_team_id, group_id, status)
VALUES
-- Grupo A
('2025-06-14', '21:00', (SELECT id FROM teams WHERE name = 'Al Ahly'), (SELECT id FROM teams WHERE name = 'Inter Miami CF'), (SELECT id FROM groups WHERE name = 'A'), 'upcoming'),
('2025-06-19', '13:00', (SELECT id FROM teams WHERE name = 'Palmeiras'), (SELECT id FROM teams WHERE name = 'Al Ahly'), (SELECT id FROM groups WHERE name = 'A'), 'upcoming'),
('2025-06-19', '16:00', (SELECT id FROM teams WHERE name = 'Inter Miami CF'), (SELECT id FROM teams WHERE name = 'FC Porto'), (SELECT id FROM groups WHERE name = 'A'), 'upcoming'),
('2025-06-23', '22:00', (SELECT id FROM teams WHERE name = 'Inter Miami CF'), (SELECT id FROM teams WHERE name = 'Palmeiras'), (SELECT id FROM groups WHERE name = 'A'), 'upcoming'),
('2025-06-23', '22:00', (SELECT id FROM teams WHERE name = 'FC Porto'), (SELECT id FROM teams WHERE name = 'Al Ahly'), (SELECT id FROM groups WHERE name = 'A'), 'upcoming'),

-- Grupo B
('2025-06-15', '15:00', (SELECT id FROM teams WHERE name = 'Paris SG'), (SELECT id FROM teams WHERE name = 'Atlético Madrid'), (SELECT id FROM groups WHERE name = 'B'), 'upcoming'),
('2025-06-15', '23:00', (SELECT id FROM teams WHERE name = 'Botafogo'), (SELECT id FROM teams WHERE name = 'Seattle Sounders FC'), (SELECT id FROM groups WHERE name = 'B'), 'upcoming'),
('2025-06-19', '16:00', (SELECT id FROM teams WHERE name = 'Seattle Sounders FC'), (SELECT id FROM teams WHERE name = 'Atlético Madrid'), (SELECT id FROM groups WHERE name = 'B'), 'upcoming'),
('2025-06-19', '19:00', (SELECT id FROM teams WHERE name = 'Paris SG'), (SELECT id FROM teams WHERE name = 'Botafogo'), (SELECT id FROM groups WHERE name = 'B'), 'upcoming'),
('2025-06-23', '16:00', (SELECT id FROM teams WHERE name = 'Seattle Sounders FC'), (SELECT id FROM teams WHERE name = 'Paris SG'), (SELECT id FROM groups WHERE name = 'B'), 'upcoming'),
('2025-06-23', '16:00', (SELECT id FROM teams WHERE name = 'Atlético Madrid'), (SELECT id FROM teams WHERE name = 'Botafogo'), (SELECT id FROM groups WHERE name = 'B'), 'upcoming'),

-- Grupo C
('2025-06-15', '13:00', (SELECT id FROM teams WHERE name = 'Bayern Munich'), (SELECT id FROM teams WHERE name = 'Auckland City FC'), (SELECT id FROM groups WHERE name = 'C'), 'upcoming'),
('2025-06-16', '19:00', (SELECT id FROM teams WHERE name = 'Boca Juniors'), (SELECT id FROM teams WHERE name = 'Benfica'), (SELECT id FROM groups WHERE name = 'C'), 'upcoming'),
('2025-06-20', '13:00', (SELECT id FROM teams WHERE name = 'Benfica'), (SELECT id FROM teams WHERE name = 'Auckland City FC'), (SELECT id FROM groups WHERE name = 'C'), 'upcoming'),
('2025-06-20', '22:00', (SELECT id FROM teams WHERE name = 'Bayern Munich'), (SELECT id FROM teams WHERE name = 'Boca Juniors'), (SELECT id FROM groups WHERE name = 'C'), 'upcoming'),
('2025-06-24', '15:00', (SELECT id FROM teams WHERE name = 'Benfica'), (SELECT id FROM teams WHERE name = 'Bayern Munich'), (SELECT id FROM groups WHERE name = 'C'), 'upcoming'),
('2025-06-24', '15:00', (SELECT id FROM teams WHERE name = 'Auckland City FC'), (SELECT id FROM teams WHERE name = 'Boca Juniors'), (SELECT id FROM groups WHERE name = 'C'), 'upcoming'),

-- Grupo D
('2025-06-16', '16:00', (SELECT id FROM teams WHERE name = 'Chelsea'), (SELECT id FROM teams WHERE name = 'Club León'), (SELECT id FROM groups WHERE name = 'D'), 'upcoming'),
('2025-06-16', '22:00', (SELECT id FROM teams WHERE name = 'Flamengo'), (SELECT id FROM teams WHERE name = 'Espérance de Tunis'), (SELECT id FROM groups WHERE name = 'D'), 'upcoming'),
('2025-06-20', '15:00', (SELECT id FROM teams WHERE name = 'Flamengo'), (SELECT id FROM teams WHERE name = 'Chelsea'), (SELECT id FROM groups WHERE name = 'D'), 'upcoming'),
('2025-06-20', '18:00', (SELECT id FROM teams WHERE name = 'Club León'), (SELECT id FROM teams WHERE name = 'Espérance de Tunis'), (SELECT id FROM groups WHERE name = 'D'), 'upcoming'),
('2025-06-24', '22:00', (SELECT id FROM teams WHERE name = 'Club León'), (SELECT id FROM teams WHERE name = 'Flamengo'), (SELECT id FROM groups WHERE name = 'D'), 'upcoming'),
('2025-06-24', '22:00', (SELECT id FROM teams WHERE name = 'Espérance de Tunis'), (SELECT id FROM teams WHERE name = 'Chelsea'), (SELECT id FROM groups WHERE name = 'D'), 'upcoming'),

-- Grupo E
('2025-06-17', '16:00', (SELECT id FROM teams WHERE name = 'River Plate'), (SELECT id FROM teams WHERE name = 'Urawa Red Diamonds'), (SELECT id FROM groups WHERE name = 'E'), 'upcoming'),
('2025-06-17', '19:00', (SELECT id FROM teams WHERE name = 'Monterrey'), (SELECT id FROM teams WHERE name = 'Inter Milan'), (SELECT id FROM groups WHERE name = 'E'), 'upcoming'),
('2025-06-21', '16:00', (SELECT id FROM teams WHERE name = 'Inter Milan'), (SELECT id FROM teams WHERE name = 'Urawa Red Diamonds'), (SELECT id FROM groups WHERE name = 'E'), 'upcoming'),
('2025-06-21', '22:00', (SELECT id FROM teams WHERE name = 'River Plate'), (SELECT id FROM teams WHERE name = 'Monterrey'), (SELECT id FROM groups WHERE name = 'E'), 'upcoming'),
('2025-06-25', '22:00', (SELECT id FROM teams WHERE name = 'Inter Milan'), (SELECT id FROM teams WHERE name = 'River Plate'), (SELECT id FROM groups WHERE name = 'E'), 'upcoming'),
('2025-06-25', '22:00', (SELECT id FROM teams WHERE name = 'Urawa Red Diamonds'), (SELECT id FROM teams WHERE name = 'Monterrey'), (SELECT id FROM groups WHERE name = 'E'), 'upcoming'),

-- Grupo F
('2025-06-17', '13:00', (SELECT id FROM teams WHERE name = 'Fluminense'), (SELECT id FROM teams WHERE name = 'Borussia Dortmund'), (SELECT id FROM groups WHERE name = 'F'), 'upcoming'),
('2025-06-17', '19:00', (SELECT id FROM teams WHERE name = 'Ulsan Hyundai'), (SELECT id FROM teams WHERE name = 'Mamelodi Sundowns'), (SELECT id FROM groups WHERE name = 'F'), 'upcoming'),
('2025-06-21', '13:00', (SELECT id FROM teams WHERE name = 'Mamelodi Sundowns'), (SELECT id FROM teams WHERE name = 'Borussia Dortmund'), (SELECT id FROM groups WHERE name = 'F'), 'upcoming'),
('2025-06-21', '19:00', (SELECT id FROM teams WHERE name = 'Fluminense'), (SELECT id FROM teams WHERE name = 'Ulsan Hyundai'), (SELECT id FROM groups WHERE name = 'F'), 'upcoming'),
('2025-06-25', '16:00', (SELECT id FROM teams WHERE name = 'Borussia Dortmund'), (SELECT id FROM teams WHERE name = 'Ulsan Hyundai'), (SELECT id FROM groups WHERE name = 'F'), 'upcoming'),
('2025-06-25', '16:00', (SELECT id FROM teams WHERE name = 'Mamelodi Sundowns'), (SELECT id FROM teams WHERE name = 'Fluminense'), (SELECT id FROM groups WHERE name = 'F'), 'upcoming'),

-- Grupo G
('2025-06-18', '13:00', (SELECT id FROM teams WHERE name = 'Manchester City'), (SELECT id FROM teams WHERE name = 'Wydad AC'), (SELECT id FROM groups WHERE name = 'G'), 'upcoming'),
('2025-06-18', '22:00', (SELECT id FROM teams WHERE name = 'Al Ain'), (SELECT id FROM teams WHERE name = 'Juventus'), (SELECT id FROM groups WHERE name = 'G'), 'upcoming'),
('2025-06-22', '13:00', (SELECT id FROM teams WHERE name = 'Juventus'), (SELECT id FROM teams WHERE name = 'Wydad AC'), (SELECT id FROM groups WHERE name = 'G'), 'upcoming'),
('2025-06-22', '22:00', (SELECT id FROM teams WHERE name = 'Manchester City'), (SELECT id FROM teams WHERE name = 'Al Ain'), (SELECT id FROM groups WHERE name = 'G'), 'upcoming'),
('2025-06-26', '16:00', (SELECT id FROM teams WHERE name = 'Juventus'), (SELECT id FROM teams WHERE name = 'Manchester City'), (SELECT id FROM groups WHERE name = 'G'), 'upcoming'),
('2025-06-26', '16:00', (SELECT id FROM teams WHERE name = 'Wydad AC'), (SELECT id FROM teams WHERE name = 'Al Ain'), (SELECT id FROM groups WHERE name = 'G'), 'upcoming'),

-- Grupo H
('2025-06-18', '15:00', (SELECT id FROM teams WHERE name = 'Real Madrid'), (SELECT id FROM teams WHERE name = 'Al Hilal'), (SELECT id FROM groups WHERE name = 'H'), 'upcoming'),
('2025-06-18', '18:00', (SELECT id FROM teams WHERE name = 'CF Pachuca'), (SELECT id FROM teams WHERE name = 'FC Salzburg'), (SELECT id FROM groups WHERE name = 'H'), 'upcoming'),
('2025-06-22', '16:00', (SELECT id FROM teams WHERE name = 'Real Madrid'), (SELECT id FROM teams WHERE name = 'CF Pachuca'), (SELECT id FROM groups WHERE name = 'H'), 'upcoming'),
('2025-06-22', '19:00', (SELECT id FROM teams WHERE name = 'FC Salzburg'), (SELECT id FROM teams WHERE name = 'Al Hilal'), (SELECT id FROM groups WHERE name = 'H'), 'upcoming'),
('2025-06-26', '21:00', (SELECT id FROM teams WHERE name = 'Al Hilal'), (SELECT id FROM teams WHERE name = 'CF Pachuca'), (SELECT id FROM groups WHERE name = 'H'), 'upcoming'),
('2025-06-26', '22:00', (SELECT id FROM teams WHERE name = 'FC Salzburg'), (SELECT id FROM teams WHERE name = 'Real Madrid'), (SELECT id FROM groups WHERE name = 'H'), 'upcoming');

-- Inserir os jogos das oitavas de final
INSERT INTO matches (match_date, match_time, home_team_id, away_team_id, group_id, status)
VALUES
('2025-06-28', '18:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Oitavas'), 'upcoming'),
('2025-06-28', '22:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Oitavas'), 'upcoming'),
('2025-06-29', '18:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Oitavas'), 'upcoming'),
('2025-06-29', '22:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Oitavas'), 'upcoming'),
('2025-06-30', '18:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Oitavas'), 'upcoming'),
('2025-07-01', '03:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Oitavas'), 'upcoming'),
('2025-07-01', '18:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Oitavas'), 'upcoming'),
('2025-07-02', '03:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Oitavas'), 'upcoming');

-- Inserir os jogos das quartas de final
INSERT INTO matches (match_date, match_time, home_team_id, away_team_id, group_id, status)
VALUES
('2025-07-04', '18:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Quartas'), 'upcoming'),
('2025-07-05', '03:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Quartas'), 'upcoming'),
('2025-07-05', '16:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Quartas'), 'upcoming'),
('2025-07-05', '22:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Quartas'), 'upcoming');

-- Inserir os jogos das semifinais
INSERT INTO matches (match_date, match_time, home_team_id, away_team_id, group_id, status)
VALUES
('2025-07-08', '18:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Semifinal'), 'upcoming'),
('2025-07-09', '18:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Semifinal'), 'upcoming');

-- Inserir a final
INSERT INTO matches (match_date, match_time, home_team_id, away_team_id, group_id, status)
VALUES
('2025-07-13', '18:00', NULL, NULL, (SELECT id FROM groups WHERE name = 'Final'), 'upcoming'); 